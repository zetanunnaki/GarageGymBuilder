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
  console.log("API response:", JSON.stringify(res.body, null, 2));
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

async function main() {
  const name = "test-4k-cover";
  const prompt = "Ultra high resolution professional product photography of a heavy-duty black steel power rack with barbell loaded with iron plates, inside a dark residential garage gym. Concrete walls, rubber floor mats, chalk dust in the air. Dramatic cinematic lighting with warm orange accent light from the left side casting sharp shadows across the steel frame. Shot on a full-frame camera with shallow depth of field. Hyperrealistic, editorial fitness magazine quality, 8K detail, no people, no text, no logos, no watermarks.";

  const jpgPath = path.join(coversDir, name + ".jpg");
  const webpPath = path.join(coversDir, name + ".webp");

  console.log("Generating test cover image...");
  console.log("Prompt:", prompt);
  console.log("");

  const taskId = await generateImage(prompt);
  process.stdout.write(`Task ${taskId} — waiting`);
  const imageUrl = await pollForResult(taskId);
  console.log(`\nDownloading from: ${imageUrl}`);
  await downloadImage(imageUrl, jpgPath);

  const jpgSize = fs.statSync(jpgPath).size;
  console.log(`JPG size: ${(jpgSize / 1024).toFixed(0)} KB`);

  // Convert to high-quality WebP
  await sharp(jpgPath).webp({ quality: 90 }).toFile(webpPath);
  const webpSize = fs.statSync(webpPath).size;
  console.log(`WebP size: ${(webpSize / 1024).toFixed(0)} KB (${Math.round((1 - webpSize / jpgSize) * 100)}% smaller)`);

  // Also check dimensions
  const metadata = await sharp(webpPath).metadata();
  console.log(`Dimensions: ${metadata.width}x${metadata.height}`);

  console.log(`\nDone! Check: public/images/covers/${name}.webp`);
  console.log("Compare with existing covers to evaluate quality.");
}

main().catch(console.error);
