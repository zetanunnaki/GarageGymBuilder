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
    name: "home-gym-for-women",
    prompt: `A clean organized home gym in a residential setting with adjustable dumbbells, a power rack with loaded barbell, an adjustable bench, and kettlebells. Modern welcoming atmosphere with soft orange accent lighting${baseSuffix}`,
  },
  {
    name: "home-gym-for-seniors",
    prompt: `A well-lit safe home gym with a power rack with prominent safety bars, adjustable dumbbells, and rubber flooring. Warm inviting atmosphere with bright but soft orange accent lighting${baseSuffix}`,
  },
  {
    name: "home-gym-for-mma",
    prompt: `A combat sports home gym with a heavy punching bag, kettlebells, power rack with barbell, and a jump rope. Gritty training atmosphere with dramatic orange accent lighting${baseSuffix}`,
  },
  {
    name: "home-gym-rehab-recovery",
    prompt: `A rehab-focused home gym with resistance bands, foam roller, lacrosse ball, adjustable dumbbells, and a foam mat. Clean professional therapy space with soft orange accent lighting${baseSuffix}`,
  },
  {
    name: "home-gym-for-kids-teens",
    prompt: `A family-friendly home gym with a power rack with safety bars prominently shown, light dumbbells, kettlebells, and a pull-up bar. Welcoming bright atmosphere with warm orange accent lighting${baseSuffix}`,
  },
  {
    name: "home-gym-for-runners",
    prompt: `A runners home gym with a power rack, barbell with moderate weight, adjustable dumbbells, foam roller, and running shoes visible. Athletic atmosphere with dramatic orange accent lighting${baseSuffix}`,
  },
  {
    name: "how-to-choose-kettlebell",
    prompt: `A single large cast iron kettlebell with visible handle and ball-shaped body, prominently displayed on a dark rubber gym floor, dramatic orange rim lighting highlighting the metal texture${baseSuffix}`,
  },
  {
    name: "how-to-choose-weight-plates",
    prompt: `A detailed close-up shot of stacked Olympic weight plates on a plate tree, cast iron and rubber bumper plates visible together, dramatic orange rim lighting showing the variety${baseSuffix}`,
  },
  {
    name: "home-gym-small-spaces",
    prompt: `A compact apartment home gym in a small space with foldable adjustable bench, wall-mounted pull-up bar, adjustable dumbbells, and resistance bands. Efficient organized setup with warm orange accent lighting${baseSuffix}`,
  },
  {
    name: "home-gym-for-travel",
    prompt: `A travel fitness bag with resistance bands, jump rope, gymnastics rings, and suspension trainer arranged neatly, dark moody background with orange accent lighting${baseSuffix}`,
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
