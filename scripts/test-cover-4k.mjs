import fs from "fs";
import path from "path";
import https from "https";
import http from "http";
import sharp from "sharp";

const API_KEY = "a34ec7e113fd3f211e45fc9c44ecaabb";
const GENERATE_URL = "https://api.kie.ai/api/v1/gpt4o-image/generate";
const STATUS_URL = "https://api.kie.ai/api/v1/gpt4o-image/record-info";
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
    size: "3:2",
    nVariants: 1,
  });
  const res = await fetchJson(GENERATE_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
    body,
  });
  if (res.body.code !== 200) throw new Error(JSON.stringify(res.body));
  return res.body.data.taskId;
}

async function pollForResult(taskId) {
  for (let i = 0; i < 120; i++) {
    await sleep(5000);
    const res = await fetchJson(`${STATUS_URL}?taskId=${taskId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    const data = res.body.data;
    if (!data) { process.stdout.write("."); continue; }
    if (data.successFlag === 1 && data.response?.resultUrls?.length) {
      return data.response.resultUrls[0];
    }
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
  const name = "test-4k-final";
  const prompt = "Ultra high resolution professional product photography of a heavy-duty black steel power rack with loaded Olympic barbell inside a dark residential garage gym. Concrete block walls, thick black rubber floor mats, scattered chalk dust particles floating in the air. Dramatic cinematic lighting with warm orange accent light from the left side casting sharp angular shadows across the matte black steel frame and chrome barbell. Additional iron plates stacked on the floor beside the rack. Shot on a full-frame camera with 85mm lens, shallow depth of field. Hyperrealistic, editorial fitness magazine cover quality. No people, no text, no logos, no watermarks.";

  const rawPath = path.join(coversDir, name + ".png");
  const webpPath = path.join(coversDir, name + ".webp");

  console.log("Step 1: Generating via 4o Image API (1536x1024)...");
  const taskId = await generateImage(prompt);
  process.stdout.write(`Task ${taskId} — waiting`);
  const imageUrl = await pollForResult(taskId);
  console.log(`\nDownloading...`);
  await downloadImage(imageUrl, rawPath);

  const rawMeta = await sharp(rawPath).metadata();
  console.log(`Raw: ${rawMeta.width}x${rawMeta.height} (${(fs.statSync(rawPath).size / 1024).toFixed(0)} KB)`);

  console.log("\nStep 2: Upscaling to 4K (3840x2560) with Lanczos...");
  await sharp(rawPath)
    .resize(3840, 2560, { kernel: sharp.kernel.lanczos3, fit: "fill" })
    .sharpen({ sigma: 0.8, m1: 0.5, m2: 0.5 })
    .webp({ quality: 90 })
    .toFile(webpPath);

  const finalMeta = await sharp(webpPath).metadata();
  const finalSize = fs.statSync(webpPath).size;
  console.log(`Final: ${finalMeta.width}x${finalMeta.height} (${(finalSize / 1024).toFixed(0)} KB)`);

  fs.unlinkSync(rawPath);
  console.log(`\nDone! Check: public/images/covers/${name}.webp`);
}

main().catch(console.error);
