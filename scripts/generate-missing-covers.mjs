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
    prompt,
    aspectRatio: "16:9",
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

const toGenerate = [
  {
    name: "mikolo-f4-power-cage-review",
    prompt: "Professional product photography of a heavy-duty black steel power cage with lat pulldown attachment in a dark residential garage gym. The cage has dual pulley cables and a loaded Olympic barbell on j-cups. Dark moody atmosphere with dramatic orange side lighting on the steel frame. Concrete floor with rubber mats. Realistic photograph, home gym equipment, no people, no text, no cartoons.",
  },
  {
    name: "sportsroyals-power-cage-review",
    prompt: "Professional product photography of a large all-in-one power cage with cable crossover system in a dark warehouse gym. Multiple cable attachment points, pulleys, and a loaded barbell. Dark moody atmosphere with warm orange accent lighting on the black steel frame. Realistic photograph, heavy-duty gym equipment, no people, no text.",
  },
  {
    name: "assault-airbike-review",
    prompt: "Professional product photography of a black assault air bike in a dark CrossFit gym. Large fan blades visible, heavy steel frame with handles and pedals. Close-up dramatic angle with orange rim lighting from behind casting shadows on the dark rubber floor. Realistic photograph, cardio equipment, no people, no text.",
  },
  {
    name: "concept2-rowerg-review",
    prompt: "Professional product photography of a Concept2 rowing machine on a dark gym floor. The PM5 monitor is visible and glowing. Long aluminum rail with sliding seat. Dark moody atmosphere with dramatic orange side lighting casting long shadows. Realistic photograph, indoor rowing machine, no people, no text.",
  },
  {
    name: "powerblock-elite-90-review",
    prompt: "Professional product photography of a pair of PowerBlock adjustable dumbbells sitting on a dark rubber gym floor. The block-style adjustable mechanism with selector pin visible. Dark moody garage gym background with dramatic orange backlight reflecting off the metal. Realistic photograph, fitness equipment, no people, no text.",
  },
  {
    name: "synergee-olympic-barbell-review",
    prompt: "Professional product photography of an Olympic barbell resting in a power rack with aggressive knurling detail visible on the shaft. Black phosphate finish on the bar. Dark moody garage gym atmosphere with orange accent lighting highlighting the knurling pattern. Chalk dust particles in the air. Realistic photograph, no people, no text.",
  },
  {
    name: "marcy-olympic-bench-review",
    prompt: "Professional product photography of an Olympic weight bench with built-in uprights and barbell catches in a dark garage gym. The bench is in flat position with weight plates loaded on the bar. Dark moody atmosphere with warm orange side lighting on the steel frame. Realistic photograph, home gym equipment, no people, no text.",
  },
  {
    name: "yes4all-kettlebell-set-review",
    prompt: "Professional product photography of a set of cast iron kettlebells in graduating sizes lined up on a dark rubber gym floor. Black painted kettlebells from small to large. Dark moody garage gym atmosphere with dramatic orange accent light from the side illuminating the kettlebell handles. Realistic photograph, no people, no text.",
  },
];

async function main() {
  console.log(`Generating ${toGenerate.length} missing cover images via Kie.ai Flux Kontext Max...\n`);
  for (let i = 0; i < toGenerate.length; i++) {
    const item = toGenerate[i];
    const jpgPath = path.join(coversDir, item.name + ".jpg");
    const webpPath = path.join(coversDir, item.name + ".webp");

    if (fs.existsSync(webpPath)) {
      console.log(`[${i + 1}/${toGenerate.length}] SKIP (exists): ${item.name}.webp`);
      continue;
    }

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
      const savings = Math.round((1 - outputSize / inputSize) * 100);
      console.log(`  DONE -> ${item.name}.webp (${(outputSize / 1024).toFixed(0)}KB, ${savings}% smaller than jpg)`);

      if (i < toGenerate.length - 1) await sleep(2000);
    } catch (err) {
      console.error(`\n  ERROR: ${err.message}`);
    }
  }
  console.log("\nAll done! Verify images in public/images/covers/");
}

main();
