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
  const body = JSON.stringify({ prompt, aspectRatio: "16:9", outputFormat: "jpeg", model: "flux-kontext-max", safetyTolerance: 2, enableTranslation: false, promptUpsampling: true });
  const res = await fetchJson(API_URL, { method: "POST", headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" }, body });
  if (res.body.code !== 200) throw new Error(JSON.stringify(res.body));
  return res.body.data.taskId;
}

async function pollForResult(taskId) {
  for (let i = 0; i < 90; i++) {
    await sleep(5000);
    const res = await fetchJson(`${STATUS_URL}?taskId=${taskId}`, { method: "GET", headers: { Authorization: `Bearer ${API_KEY}` } });
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

const items = [
  { name: "best-cable-machines-home-gym", prompt: "Dark moody garage gym with a wall-mounted cable machine and lat bar attachment, dramatic orange rim lighting illuminating the steel cables and pulleys. Cinematic 16:9. Realistic photograph, no people, no text." },
  { name: "best-power-towers", prompt: "A tall black power tower dip station in a dark garage gym with orange accent lighting from behind. Pull-up bar visible at the top, dip handles in center. Cinematic. Realistic photograph, no people, no text." },
  { name: "best-recovery-tools", prompt: "Collection of recovery tools on a dark gym floor — foam roller, massage gun, and stretching wheel arranged together. Dramatic warm orange side lighting. Cinematic 16:9. Realistic photograph, no people, no text." },
  { name: "home-gym-accessories-essentials", prompt: "Flat lay of home gym accessories on dark surface — lifting belt, barbell collars, chalk, wrist wraps, knee sleeves, lifting straps arranged neatly. Dramatic orange accent lighting from above. Cinematic 16:9. Realistic photograph, no people, no text." },
  { name: "best-specialty-bars", prompt: "Three specialty barbells displayed in a dark garage gym — safety squat bar, EZ curl bar, and trap bar arranged together. Dramatic orange side lighting on the knurling and steel. Cinematic 16:9. Realistic photograph, no people, no text." },
  { name: "best-cardio-machines-home-gym", prompt: "Dark home gym with an air bike and rowing machine side by side, dramatic orange ambient lighting creating silhouettes of the equipment. Cinematic 16:9. Realistic photograph, no people, no text." },
  { name: "home-gym-on-a-budget-complete-guide", prompt: "A modest but clean garage gym setup with power rack, barbell, bench, and plates on rubber floor mats. Budget-friendly equipment in a dark garage with warm orange work light. Cinematic 16:9. Realistic photograph, no people, no text." },
  { name: "valor-fitness-bd62-review", prompt: "Close-up of a wall-mounted cable pulley machine with weight stack in a dark garage gym. Orange rim lighting highlighting the steel frame and cable. Cinematic 16:9. Realistic photograph, no people, no text." },
  { name: "titan-safety-squat-bar-review", prompt: "A safety squat bar with padded yoke racked in a power cage in a dark garage gym. Dramatic orange accent lighting on the cambered handles. Cinematic 16:9. Realistic photograph, no people, no text." },
];

async function main() {
  console.log(`Generating ${items.length} cover images...\n`);
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const jpgPath = path.join(coversDir, item.name + ".jpg");
    const webpPath = path.join(coversDir, item.name + ".webp");
    if (fs.existsSync(webpPath)) { console.log(`[${i+1}] SKIP: ${item.name}`); continue; }
    console.log(`[${i+1}/${items.length}] ${item.name}`);
    try {
      const taskId = await generateImage(item.prompt);
      process.stdout.write(`  ${taskId} `);
      const url = await pollForResult(taskId);
      console.log("\n  Downloading...");
      await downloadImage(url, jpgPath);
      await sharp(jpgPath).webp({ quality: 80 }).toFile(webpPath);
      fs.unlinkSync(jpgPath);
      console.log(`  DONE ${item.name}.webp`);
      if (i < items.length - 1) await sleep(2000);
    } catch (e) { console.error(`  ERROR: ${e.message}`); }
  }
  console.log("\nAll done!");
}
main();
