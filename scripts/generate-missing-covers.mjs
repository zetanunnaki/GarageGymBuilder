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

const toGenerate = [
  {
    name: "best-kettlebells",
    prompt: "Professional product photography of black cast iron kettlebells of different sizes arranged on a dark rubber gym floor. Three kettlebells from small to large. Dark moody garage gym background with dramatic orange accent side lighting. Realistic photograph, fitness equipment, no people, no text.",
  },
  {
    name: "best-recovery-tools",
    prompt: "Professional product photography of foam roller, lacrosse ball, massage gun, and resistance band arranged on a dark rubber gym floor. Recovery and mobility tools. Dark moody atmosphere with warm orange accent lighting. Realistic photograph, fitness accessories, no people, no text.",
  },
  {
    name: "best-gym-mirrors",
    prompt: "A large wall-mounted mirror reflecting a dark garage gym interior with a power rack and barbell visible in the reflection. Orange accent lighting creating dramatic reflections. Dark moody atmosphere, realistic photograph, no people, no text.",
  },
  {
    name: "how-to-build-lifting-platform",
    prompt: "A DIY wooden lifting platform in a garage gym, plywood center section with rubber mats on the sides. Construction tools visible nearby. Dark moody atmosphere with warm orange work light. Realistic photograph, gym construction, no people, no text.",
  },
  {
    name: "home-gym-over-40",
    prompt: "A welcoming home garage gym with adjustable dumbbells, resistance bands, and a weight bench. Warm inviting atmosphere with soft orange lighting, clean organized space. Mature and accessible feel. Realistic photograph, no people, no text.",
  },
  {
    name: "garage-gym-electrical-setup",
    prompt: "Close-up of electrical outlet and LED shop lights in a dark garage gym. Extension cord running along the wall, circuit breaker panel visible in background. Orange accent lighting from LED strips. Realistic photograph, electrical setup, no people, no text.",
  },
  {
    name: "barbell-only-exercises",
    prompt: "An Olympic barbell loaded with iron plates sitting on a dark rubber gym floor, dramatic low-angle shot. No rack, no bench visible — just the barbell and plates in an empty dark space. Dramatic orange rim lighting on the chrome bar. Realistic photograph, no people, no text.",
  },
  {
    name: "apartment-gym-under-300",
    prompt: "A compact home gym setup in a small apartment room. Adjustable dumbbells, resistance bands, a foldable bench, and a yoga mat arranged neatly in a small space. Clean modern apartment with dark accents and warm orange lamp light. Realistic photograph, no people, no text.",
  },
  {
    name: "best-trap-bars",
    prompt: "Professional product photography of a black hex bar (trap bar) with loaded weight plates on a dark rubber gym floor. Hexagonal frame clearly visible from above angle. Dark moody garage gym with orange accent lighting. Realistic photograph, no people, no text.",
  },
  {
    name: "organizing-your-garage-gym",
    prompt: "A perfectly organized garage gym with wall-mounted pegboard storage, plate tree with organized weight plates, barbells on wall holders, and clean rubber floor. Dark atmosphere with warm orange overhead lighting. Everything in its place. Realistic photograph, no people, no text.",
  },
  {
    name: "winter-garage-gym-training",
    prompt: "A cold garage gym in winter with visible breath vapor in the air. Space heater glowing orange in the corner, frost on the garage door window. A barbell sits on a power rack ready to use. Cold blue tones mixed with warm orange heater glow. Realistic photograph, no people, no text.",
  },
  {
    name: "best-jump-ropes",
    prompt: "Professional product photography of a speed jump rope coiled on a dark rubber gym floor. Thin steel cable with black handles. Dark moody background with orange accent side lighting reflecting off the cable. Realistic photograph, fitness equipment, no people, no text.",
  },
  {
    name: "home-gym-insurance-liability",
    prompt: "A dark garage gym with a clipboard and insurance documents sitting on a weight bench. Power rack and equipment visible in the moody background. Orange desk lamp illuminating the paperwork. Professional and serious atmosphere. Realistic photograph, no people visible, no text readable.",
  },
  {
    name: "home-gym-nutrition-basics",
    prompt: "A protein shaker bottle and container of creatine powder sitting on a weight bench in a dark garage gym. A barbell and rack visible in the background. Dark moody atmosphere with warm orange accent lighting on the supplements. Realistic photograph, fitness nutrition, no people, no text.",
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
