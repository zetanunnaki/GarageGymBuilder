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

const S = `. Dark moody garage gym photography with dramatic orange accent lighting, industrial concrete and steel atmosphere, realistic photograph, black and dark gray color palette with orange highlights, no people visible, no text, no watermarks, no cartoons, 16:9 aspect ratio, cinematic composition`;

const toGenerate = [
  { name: "best-home-gym-accessories-under-50", prompt: `Flat lay arrangement of home gym accessories on dark concrete floor: jump rope, ab wheel, foam roller, resistance bands, lifting straps, barbell collars, chalk block, wooden gymnastic rings. Items arranged in a clean grid pattern with space between each${S}` },
  { name: "best-cardio-machines-under-500", prompt: `Row of four budget cardio machines in a dark garage gym: magnetic rowing machine, indoor spin bike, compact treadmill, upright exercise bike. Machines lined up on dark rubber flooring${S}` },
  { name: "best-weight-benches-under-300", prompt: `Adjustable weight bench set at incline position in a dark garage gym, with a loaded Olympic barbell on a rack behind it. Black vinyl pad bench with steel frame${S}` },
  { name: "best-power-racks-under-1000", prompt: `Three power racks of increasing size side by side in a dark warehouse gym. Small budget rack, mid-range rack with cable system, large feature-rich cage. Loaded barbells on each${S}` },
  { name: "best-home-gym-equipment-under-100", prompt: `Collection of budget gym equipment arranged on a dark rubber floor: doorway pull-up bar, pair of hex dumbbells, resistance band set, ab roller wheel, slam ball, speed jump rope, foam roller, lifting belt. Artful arrangement${S}` },
  { name: "is-bowflex-552-worth-it", prompt: `Close-up product photography of a pair of adjustable dumbbells with weight selection dial mechanism sitting on a dark rubber gym floor. The dial shows weight numbers. Dramatic orange side lighting on the dumbbell surface${S}` },
  { name: "is-flybird-bench-worth-it", prompt: `Black adjustable weight bench set at incline angle in a dark garage gym. Compact foldable design with steel frame and padded vinyl surface. Single bench isolated on dark rubber floor${S}` },
  { name: "is-fitness-reality-810xlt-worth-it", prompt: `Budget power rack with silver steel frame in a dark garage gym. Loaded Olympic barbell resting on J-hooks at chest height. Multi-grip pull-up bar on top. Simple clean rack design${S}` },
  { name: "is-powerblock-elite-worth-it", prompt: `Pair of rectangular block-style adjustable dumbbells with black housing and metal selector pin sitting on dark rubber gym floor. The unique cage design of the dumbbells is visible${S}` },
  { name: "flybird-vs-marcy-bench", prompt: `Two weight benches facing each other in a dark garage gym: lightweight foldable adjustable bench on the left, heavy-duty Olympic bench press station with built-in uprights and leg developer on the right. Orange light strip between them${S}` },
  { name: "sunny-spin-bike-vs-schwinn", prompt: `Indoor spin bike with heavy flywheel on the left and upright exercise bike with digital display on the right, facing each other in a dark garage gym. Orange dividing light between them${S}` },
  { name: "fitness-reality-vs-sportsroyals", prompt: `Basic silver steel power rack on the left and large black power cage with cable crossover system on the right, in a dark warehouse gym. Orange accent light between the two racks${S}` },
  { name: "titan-ssb-vs-yes4all-trap-bar", prompt: `Safety squat bar with curved camber and padded shoulder yoke lying next to a hexagonal trap bar, both on a dark rubber gym floor. Close-up showing the unique shapes of each specialty barbell${S}` },
];

async function main() {
  console.log(`Generating ${toGenerate.length} cover images via Kie.ai Flux Kontext Max...\n`);
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
      const inputSize = fs.statSync(jpgPath).size;
      await sharp(jpgPath).webp({ quality: 80 }).toFile(webpPath);
      const outputSize = fs.statSync(webpPath).size;
      fs.unlinkSync(jpgPath);
      console.log(`  DONE -> ${item.name}.webp (${(outputSize / 1024).toFixed(0)}KB, ${Math.round((1 - outputSize / inputSize) * 100)}% smaller)`);
      if (i < toGenerate.length - 1) await sleep(1500);
    } catch (err) {
      console.error(`\n  ERROR: ${err.message}`);
    }
  }
  console.log("\nAll done!");
}

main();
