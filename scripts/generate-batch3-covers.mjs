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

const baseSuffix = `. Dark moody garage gym photography with dramatic orange accent lighting, industrial atmosphere, realistic photograph, black and dark gray color palette with orange highlights, no people visible, no text, no watermarks, 16:9 aspect ratio, cinematic composition`;

const toGenerate = [
  {
    name: "yes4all-hex-trap-bar-review",
    prompt: `A hexagonal trap bar (hex bar) with Olympic weight plates loaded on both sides, sitting on a dark rubber gym floor with chalk dust, prominent orange rim lighting outlining the steel frame${baseSuffix}`,
  },
  {
    name: "yes4all-plyo-box-review",
    prompt: `A wooden plyometric box (3-in-1 design with multiple heights visible) made of birch plywood, sitting on dark rubber gym floor, dramatic orange rim lighting highlighting the wood grain texture${baseSuffix}`,
  },
  {
    name: "wod-nation-jump-rope-review",
    prompt: `A speed jump rope with aluminum handles and steel cable coiled on a dark rubber gym floor, dramatic orange accent lighting${baseSuffix}`,
  },
  {
    name: "bodylastics-resistance-bands-review",
    prompt: `A set of resistance bands with handles, ankle straps, and door anchor arranged neatly on a dark rubber gym floor, multiple colors of rubber tubing visible, dramatic orange accent lighting${baseSuffix}`,
  },
  {
    name: "iron-bull-dip-belt-review",
    prompt: `A weightlifting dip belt with thick neoprene padding and a steel chain hanging from a pull-up bar, with a 45 lb weight plate attached to the chain, dark moody background, dramatic orange rim lighting${baseSuffix}`,
  },
  {
    name: "sunny-sf-rw5515-rower-review",
    prompt: `A magnetic rowing machine with sliding seat and footplates, on a dark rubber gym floor, side angle view showing the full length of the rower, dramatic orange accent lighting${baseSuffix}`,
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
      process.stdout.write(`  Task ${taskId} -- waiting`);
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
