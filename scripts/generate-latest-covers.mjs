import fs from "fs";
import path from "path";
import https from "https";
import http from "http";
import sharp from "sharp";

const API_KEY = "a34ec7e113fd3f211e45fc9c44ecaabb";
const API_URL = "https://api.kie.ai/api/v1/flux/kontext/generate";
const STATUS_URL = "https://api.kie.ai/api/v1/flux/kontext/record-info";
const coversDir = "C:/Users/Issam/GarageGymBuilder/public/images/covers";

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
    prompt, aspectRatio: "16:9", outputFormat: "jpeg",
    model: "flux-kontext-max", safetyTolerance: 2,
    enableTranslation: false, promptUpsampling: true,
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

const baseSuffix = `. Dark moody garage gym photography with dramatic orange accent lighting, industrial atmosphere, realistic photograph, black and dark gray color palette with orange highlights, no people visible, no text, no watermarks, professional product photography style, 16:9 aspect ratio, cinematic composition`;

const toGenerate = [
  // New reviews (2)
  {
    name: "titan-deadlift-jack-review",
    prompt: `A heavy-duty black steel deadlift bar jack sitting on a dark rubber garage gym floor, ready to lift a loaded Olympic barbell. Dramatic orange side lighting reflects off the steel frame${baseSuffix}`,
  },
  {
    name: "yes4all-olympic-plates-review",
    prompt: `A stack of cast iron Olympic weight plates on a dark rubber gym floor, 45lb plates clearly visible with the classic Olympic hole pattern, dramatic orange rim lighting on the iron edges${baseSuffix}`,
  },
  // New comparison articles (5)
  {
    name: "mikolo-f4-vs-fitness-reality",
    prompt: `Two power racks side by side in a dark garage gym, one with a LAT pulldown attachment and one simpler, dramatic orange accent lighting creating a competitive atmosphere${baseSuffix}`,
  },
  {
    name: "bowflex-vs-powerblock",
    prompt: `Two sets of adjustable dumbbells side by side on a dark rubber gym floor, one with a dial-based system and one with a pin-based cage system, dramatic orange accent lighting${baseSuffix}`,
  },
  {
    name: "concept2-vs-assault-bike",
    prompt: `A Concept2 rowing machine and an Assault air bike side by side in a dark garage gym, dramatic orange accent lighting on both, industrial atmosphere${baseSuffix}`,
  },
  {
    name: "cap-vs-synergee-barbell",
    prompt: `Two Olympic barbells on a dark rubber gym floor, side by side close-up shot showing knurling details, dramatic orange rim lighting reflecting off the chrome${baseSuffix}`,
  },
  {
    name: "three-way-rack-comparison",
    prompt: `Three power racks lined up in a dark garage gym, each with different features visible, dramatic orange accent lighting creating depth${baseSuffix}`,
  },
  // Buyer's guides (5)
  {
    name: "how-to-choose-power-rack",
    prompt: `A single massive steel power rack centered in a dark garage gym, dramatic orange spotlight from above illuminating the uprights and safety bars, contemplative atmosphere${baseSuffix}`,
  },
  {
    name: "how-to-choose-barbell",
    prompt: `Close-up detail shot of an Olympic barbell knurling pattern, chrome sleeves visible, dramatic orange rim lighting showing the precision engineering${baseSuffix}`,
  },
  {
    name: "how-to-choose-adjustable-dumbbells",
    prompt: `A single adjustable dumbbell with its weight selection mechanism prominently visible on a dark rubber gym floor, dramatic orange accent lighting highlighting the dial or pin system${baseSuffix}`,
  },
  {
    name: "how-to-choose-weight-bench",
    prompt: `An adjustable weight bench at the incline position in a dark garage gym, dramatic orange side lighting showing the pad details and frame construction${baseSuffix}`,
  },
  {
    name: "how-to-choose-gym-flooring",
    prompt: `Close-up of thick black rubber gym flooring being installed on concrete, with visible floor texture and edges, dramatic orange work light illumination${baseSuffix}`,
  },
  // Build variations (2)
  {
    name: "home-gym-under-3000",
    prompt: `A premium complete home gym setup with power rack, barbell with plates, adjustable bench, dumbbells, and air bike visible in a well-organized garage gym, dramatic orange accent lighting creating a professional atmosphere${baseSuffix}`,
  },
  {
    name: "home-gym-under-4000",
    prompt: `An ultimate commercial-grade home gym with sportsroyals-style power cage, Concept2 rower, premium dumbbells, and complete plate collection visible in a large garage, luxurious orange accent lighting${baseSuffix}`,
  },
  // Training discipline guides (3)
  {
    name: "crossfit-home-gym-setup",
    prompt: `A CrossFit-style home gym with power rack, air bike, kettlebells, and bumper plates visible, dramatic orange accent lighting, high-intensity training atmosphere${baseSuffix}`,
  },
  {
    name: "powerlifting-home-gym-setup",
    prompt: `A powerlifting-focused home gym with a massive steel power cage loaded with heavy plates, bench press setup visible, dramatic orange accent lighting emphasizing the raw strength atmosphere${baseSuffix}`,
  },
  {
    name: "bodybuilding-home-gym-setup",
    prompt: `A bodybuilding-focused home gym with cable crossover system, adjustable dumbbells, incline bench, and multiple plates, dramatic orange accent lighting showing variety of equipment${baseSuffix}`,
  },
];

async function main() {
  for (let i = 0; i < toGenerate.length; i++) {
    const item = toGenerate[i];
    const jpgPath = path.join(coversDir, item.name + ".jpg");
    const webpPath = path.join(coversDir, item.name + ".webp");

    if (fs.existsSync(webpPath)) { console.log(`SKIP ${item.name}`); continue; }

    console.log(`[${i + 1}/${toGenerate.length}] Generating: ${item.name}`);
    try {
      const taskId = await generateImage(item.prompt);
      process.stdout.write(`  Task ${taskId} — waiting`);
      const imageUrl = await pollForResult(taskId);
      console.log(`\n  Downloading...`);
      await downloadImage(imageUrl, jpgPath);
      await sharp(jpgPath).webp({ quality: 80 }).toFile(webpPath);
      fs.unlinkSync(jpgPath);
      console.log(`  DONE -> ${item.name}.webp`);
      if (i < toGenerate.length - 1) await sleep(1500);
    } catch (err) {
      console.error(`\n  ERROR: ${err.message}`);
    }
  }
  console.log("\nAll done!");
}

main();
