import fs from "fs";
import path from "path";
import https from "https";
import http from "http";

const API_KEY = "a34ec7e113fd3f211e45fc9c44ecaabb";
const API_URL = "https://api.kie.ai/api/v1/flux/kontext/generate";
const STATUS_URL = "https://api.kie.ai/api/v1/flux/kontext/record-info";
const coversDir = path.join(process.cwd(), "public/images/covers");

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

async function generateImage(prompt, aspectRatio = "16:9") {
  const body = JSON.stringify({
    prompt, aspectRatio, outputFormat: "jpeg",
    model: "flux-kontext-pro", safetyTolerance: 2, enableTranslation: false,
  });
  const res = await fetchJson(API_URL, {
    method: "POST",
    headers: { Authorization: "Bearer " + API_KEY, "Content-Type": "application/json" },
    body,
  });
  if (res.body.code !== 200) throw new Error(JSON.stringify(res.body));
  return res.body.data.taskId;
}

async function pollForResult(taskId) {
  for (let i = 0; i < 60; i++) {
    await sleep(5000);
    const res = await fetchJson(STATUS_URL + "?taskId=" + taskId, {
      method: "GET", headers: { Authorization: "Bearer " + API_KEY },
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

const images = [
  {
    name: "hero-bg",
    aspectRatio: "21:9",
    prompt: "Ultra wide panoramic shot of a dark industrial garage gym interior, dramatic orange neon accent lighting from the sides, steel power rack silhouette in center, concrete floor with rubber mats, chains and barbells visible, thick atmospheric haze/fog, cinematic moody photography, no people, no text, high contrast black and orange color palette",
  },
  {
    name: "bento-power-racks",
    aspectRatio: "9:16",
    prompt: "Vertical shot of a massive steel power rack in a dark garage gym, dramatic orange side lighting illuminating the steel uprights, loaded barbell, dark moody atmosphere, industrial photography style, no text, no people",
  },
  {
    name: "bento-budget-builds",
    aspectRatio: "16:9",
    prompt: "Wide shot of a complete budget home gym setup in a garage, power rack with barbell, weight plates on floor, rubber mats, warm orange overhead light, inviting but industrial atmosphere, dark tones, no text, no people",
  },
];

async function main() {
  for (const img of images) {
    const jpgPath = path.join(coversDir, img.name + ".jpg");
    const webpPath = path.join(coversDir, img.name + ".webp");
    if (fs.existsSync(webpPath)) { console.log("SKIP " + img.name); continue; }
    console.log("Generating: " + img.name);
    try {
      const taskId = await generateImage(img.prompt, img.aspectRatio);
      process.stdout.write("  Waiting");
      const url = await pollForResult(taskId);
      console.log("\n  Downloading...");
      await downloadImage(url, jpgPath);
      console.log("  DONE -> " + img.name + ".jpg");
      await sleep(1000);
    } catch (err) { console.error("  ERROR: " + err.message); }
  }
  console.log("\nNow convert to WebP with the convert script.");
}

main();
