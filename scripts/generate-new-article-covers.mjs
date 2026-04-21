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
  {
    name: "senior-home-gym-build",
    prompt: `A well-organized, accessible home gym with adjustable bench, resistance bands, foam roller, and yoga mat on clean rubber flooring, safety grab bar visible on wall, well-lit and welcoming but still dramatic atmosphere${baseSuffix}`,
  },
  {
    name: "womens-home-gym-build",
    prompt: `A modern home gym setup with power rack, kettlebells, resistance bands, adjustable bench, and barbell with colorful bumper plates, hip thrust pad visible, clean organized space${baseSuffix}`,
  },
  {
    name: "beginner-home-gym-build",
    prompt: `A simple starter home gym with a power rack, Olympic barbell with plates, adjustable bench, and rubber floor mats in a clean single-car garage, inviting and organized${baseSuffix}`,
  },
  {
    name: "olympic-weightlifting-home-gym-build",
    prompt: `An Olympic weightlifting platform made of plywood and rubber in a garage gym, barbell loaded with colorful bumper plates in the catch position, chalk dust visible in the air${baseSuffix}`,
  },
  {
    name: "strength-vs-hypertrophy-programming",
    prompt: `A training notebook open on a weight bench showing a written workout program, barbell and dumbbells visible in background, split lighting suggesting two different training approaches${baseSuffix}`,
  },
  {
    name: "home-gym-deload-recovery-guide",
    prompt: `Recovery tools arranged on a dark rubber gym floor: foam roller, massage gun, resistance band, and yoga mat, with a resting barbell in the background, calm restful atmosphere${baseSuffix}`,
  },
  {
    name: "home-gym-warm-up-guide",
    prompt: `Resistance bands and a foam roller on a dark rubber gym floor next to a power rack, dynamic stretching area with yoga mat visible, warm orange lighting suggesting preparation and activation${baseSuffix}`,
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
