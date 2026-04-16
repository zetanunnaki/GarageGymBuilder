import fs from "fs";
import path from "path";
import https from "https";
import http from "http";
import sharp from "sharp";

const API_KEY = "a34ec7e113fd3f211e45fc9c44ecaabb";
const API_URL = "https://api.kie.ai/api/v1/flux/kontext/generate";
const STATUS_URL = "https://api.kie.ai/api/v1/flux/kontext/record-info";
const productsDir = "C:/Users/Issam/GarageGymBuilder/public/images/products";

function fetchJson(url, options = {}) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith("https") ? https : http;
    const req = mod.request(url, options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on("error", reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function generateImage(prompt) {
  const body = JSON.stringify({
    prompt,
    aspectRatio: "1:1",
    outputFormat: "jpeg",
    model: "flux-kontext-max",
    safetyTolerance: 2,
    enableTranslation: false,
    promptUpsampling: true,
  });
  const res = await fetchJson(API_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
    body,
  });
  if (res.body.code !== 200) throw new Error(JSON.stringify(res.body));
  return res.body.data.taskId;
}

async function pollForResult(taskId) {
  for (let i = 0; i < 90; i++) {
    await sleep(5000);
    const res = await fetchJson(`${STATUS_URL}?taskId=${taskId}`, {
      method: "GET", headers: { Authorization: `Bearer ${API_KEY}` },
    });
    const data = res.body.data;
    if (!data) continue;
    if (data.successFlag === 1 && data.response?.resultImageUrl) return data.response.resultImageUrl;
    if (data.successFlag >= 2) throw new Error(data.errorMessage || "Failed");
    process.stdout.write(".");
  }
  throw new Error("Timeout");
}

async function downloadImage(url, filePath) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith("https") ? https : http;
    mod.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location)
        return downloadImage(res.headers.location, filePath).then(resolve).catch(reject);
      const s = fs.createWriteStream(filePath);
      res.pipe(s);
      s.on("finish", () => { s.close(); resolve(); });
    }).on("error", reject);
  });
}

const BASE_STYLE = "Product centered on a pure black background (#0a0a0a). Single piece of gym equipment, studio lighting with warm orange rim light from behind. Clean isolated product shot, no floor visible, no gym background, no people, no text, no logos. Square 1:1 composition. Photorealistic, high-end e-commerce product photography.";

const toGenerate = [
  {
    name: "fitness-reality-810xlt",
    prompt: `A black steel power rack cage with pull-up bar and loaded barbell on j-cups. ${BASE_STYLE}`,
  },
  {
    name: "mikolo-f4",
    prompt: `A black steel power cage with lat pulldown cable system and dual pulleys attached. Barbell on j-cups. ${BASE_STYLE}`,
  },
  {
    name: "sportsroyals-rack",
    prompt: `A large black power cage with cable crossover system, multiple pulleys and attachment points. ${BASE_STYLE}`,
  },
  {
    name: "bowflex-552",
    prompt: `A pair of Bowflex-style adjustable dumbbells in their cradle. Black and red weight selector dial mechanism visible. ${BASE_STYLE}`,
  },
  {
    name: "powerblock-elite-90",
    prompt: `A pair of block-style adjustable dumbbells with square metal housing and selector pin. Black with silver accents. ${BASE_STYLE}`,
  },
  {
    name: "cap-barbell-300",
    prompt: `An Olympic barbell loaded with cast iron weight plates on both sides. Chrome bar with black iron plates. ${BASE_STYLE}`,
  },
  {
    name: "synergee-barbell",
    prompt: `A single Olympic barbell with black phosphate finish, aggressive knurling visible on the shaft. No plates loaded. ${BASE_STYLE}`,
  },
  {
    name: "assault-airbike",
    prompt: `A black heavy-duty air bike with large fan blades, dual-action handlebars, and heavy steel frame. ${BASE_STYLE}`,
  },
  {
    name: "concept2-rowerg",
    prompt: `A rowing machine with long aluminum rail, flywheel housing on the left, and a small digital monitor. Gray and black. ${BASE_STYLE}`,
  },
  {
    name: "flybird-bench",
    prompt: `A black adjustable weight bench in incline position. Padded seat and backrest with steel frame legs. ${BASE_STYLE}`,
  },
  {
    name: "marcy-bench",
    prompt: `An Olympic weight bench with built-in barbell uprights and leg developer attachment. Black padded bench, steel frame. ${BASE_STYLE}`,
  },
  {
    name: "rogue-echo-bike",
    prompt: `A heavy black air bike with large steel fan shroud, thick steel frame, and rubber-grip handlebars. ${BASE_STYLE}`,
  },
  {
    name: "titan-deadlift-jack",
    prompt: `A steel deadlift bar jack — a lever mechanism that lifts a barbell off the ground for easy plate loading. Black powder-coated. ${BASE_STYLE}`,
  },
  {
    name: "yes4all-kettlebells",
    prompt: `A set of three cast iron kettlebells in graduating sizes (small, medium, large). Black painted finish with visible handles. ${BASE_STYLE}`,
  },
  {
    name: "yes4all-plates",
    prompt: `A stack of black cast iron Olympic weight plates, 45lb and 25lb plates leaning together showing the center hole. ${BASE_STYLE}`,
  },
];

async function main() {
  console.log(`Generating ${toGenerate.length} product images via Kie.ai Flux Kontext Max...\n`);
  for (let i = 0; i < toGenerate.length; i++) {
    const item = toGenerate[i];
    const jpgPath = path.join(productsDir, item.name + ".jpg");
    const webpPath = path.join(productsDir, item.name + ".webp");

    console.log(`[${i + 1}/${toGenerate.length}] Generating: ${item.name}`);
    try {
      const taskId = await generateImage(item.prompt);
      process.stdout.write(`  Task ${taskId} — waiting`);
      const imageUrl = await pollForResult(taskId);
      console.log(`\n  Downloading...`);
      await downloadImage(imageUrl, jpgPath);

      const inputSize = fs.statSync(jpgPath).size;
      await sharp(jpgPath).webp({ quality: 80 }).toFile(webpPath);
      const outputSize = fs.statSync(webpPath).size;
      fs.unlinkSync(jpgPath);
      console.log(`  DONE -> ${item.name}.webp (${(outputSize / 1024).toFixed(0)}KB)`);

      if (i < toGenerate.length - 1) await sleep(2000);
    } catch (err) {
      console.error(`\n  ERROR: ${err.message}`);
    }
  }
  console.log("\nAll done!");
}

main();
