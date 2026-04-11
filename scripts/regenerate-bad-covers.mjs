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

// Stronger, more explicit prompts
const toRegenerate = [
  {
    name: "best-resistance-bands",
    prompt: "Professional product photography of colorful rubber resistance bands, loop bands and tube bands with handles, laid out on a dark black rubber gym floor in a garage gym. Dark moody atmosphere with dramatic orange side lighting. Fitness equipment photography, high contrast, black background, no people, no text, no cartoons, realistic photograph.",
  },
  {
    name: "best-bumper-plates",
    prompt: "Professional product photography of colorful rubber bumper plates stacked on a weight plate storage tree in a dark garage gym. Red, blue, yellow, green bumper plates. Dark moody atmosphere with dramatic orange accent lighting from the side. Realistic photograph, fitness equipment, no people, no text, no food.",
  },
  {
    name: "best-weight-sets",
    prompt: "Professional product photography of a complete Olympic barbell and weight plate set on a dark garage gym floor. 7-foot barbell with cast iron plates loaded on both sides, extra plates stacked nearby. Dark moody atmosphere with warm orange accent lighting. Realistic photograph, gym equipment, no fantasy, no people, no text.",
  },
  {
    name: "best-weight-benches",
    prompt: "Professional product photography of a black adjustable weight bench in incline position inside a dark garage gym. Padded bench with steel frame, dark rubber floor. Dramatic orange accent lighting from the side. Realistic photograph, fitness equipment, no cars, no people, no text.",
  },
  {
    name: "best-adjustable-dumbbells",
    prompt: "Professional product photography of a pair of modern adjustable dumbbells sitting on a dark rubber gym floor. Black hexagonal dumbbell heads with chrome handles. Dark moody garage gym background with dramatic orange backlight. Realistic photograph, fitness equipment, no snow, no outdoors, no people, no text.",
  },
  {
    name: "best-olympic-barbells",
    prompt: "Professional product photography of multiple Olympic barbells displayed in a vertical barbell holder rack inside a dark gym. Close-up showing the chrome shafts and knurling patterns. Dark moody atmosphere with orange accent rim lighting. Realistic photograph, gym equipment, no outdoor scenes, no landscaping, no people, no text.",
  },
  {
    name: "best-pull-up-bars",
    prompt: "Professional product photography of a wall-mounted multi-grip pull-up bar installed on a dark concrete wall in a garage gym. Steel pull-up bar with multiple grip positions. Dark moody atmosphere with dramatic orange uplighting. Realistic photograph, fitness equipment, no wood, no crafts, no people, no text.",
  },
  {
    name: "best-air-bikes",
    prompt: "Professional product photography of a heavy-duty black air bike with large fan blades in a dark garage gym. The fan bike has handles and pedals, sitting on a dark rubber floor. Dramatic orange accent lighting illuminating the fan and frame. Realistic photograph, fitness cardio equipment, no animals, no water, no outdoors, no text.",
  },
  {
    name: "garage-gym-flooring-guide",
    prompt: "Close-up professional photograph of thick black rubber gym flooring mats being installed on a concrete garage floor. A utility knife cutting the edge of a horse stall mat. Dark garage setting with orange work light illumination. Realistic photograph, gym construction, no desert, no creatures, no fantasy, no text.",
  },
  {
    name: "home-gym-programming-guide",
    prompt: "A training notebook and pen sitting on a flat weight bench in a dark garage gym, with a barbell and power rack visible in the background. The notebook shows handwritten training numbers. Dark moody atmosphere with warm orange accent lighting. Realistic photograph, fitness setting, no fruit, no outdoors, no text overlay.",
  },
  {
    name: "fitness-reality-810xlt-review",
    prompt: "Professional product photography of a black steel power rack cage with pull-up bar in a residential garage gym. Budget power rack with barbell on j-cups. Dark moody atmosphere with dramatic orange side lighting on the steel frame. Realistic photograph, home gym equipment, no anime, no cartoons, no people, no text.",
  },
  {
    name: "cap-barbell-300-review",
    prompt: "Professional product photography of an Olympic barbell loaded with cast iron weight plates sitting on the floor of a dark garage gym. 300 pound weight set with 45lb plates visible. Dark moody atmosphere with orange accent lighting reflecting off the chrome bar. Realistic photograph, fitness equipment, no people, no movies, no text.",
  },
  {
    name: "home-gym-vs-commercial-gym",
    prompt: "Split composition photograph showing contrast: left side is a dark moody home garage gym with power rack and orange accent lighting, right side is a bright modern commercial gym interior with machines. The two halves show the comparison between home and commercial gym. Realistic photograph, no phones, no screens, no people, no text.",
  },
];

async function main() {
  for (let i = 0; i < toRegenerate.length; i++) {
    const item = toRegenerate[i];
    const jpgPath = path.join(coversDir, item.name + ".jpg");
    const webpPath = path.join(coversDir, item.name + ".webp");

    console.log(`[${i + 1}/${toRegenerate.length}] Regenerating: ${item.name}`);
    try {
      const taskId = await generateImage(item.prompt);
      process.stdout.write(`  Task ${taskId} — waiting`);
      const imageUrl = await pollForResult(taskId);
      console.log(`\n  Downloading...`);
      await downloadImage(imageUrl, jpgPath);

      // Convert to WebP
      const inputSize = fs.statSync(jpgPath).size;
      await sharp(jpgPath).webp({ quality: 80 }).toFile(webpPath);
      const outputSize = fs.statSync(webpPath).size;
      fs.unlinkSync(jpgPath);
      const savings = Math.round((1 - outputSize / inputSize) * 100);
      console.log(`  DONE -> ${item.name}.webp (${savings}% smaller than jpg)`);

      if (i < toRegenerate.length - 1) await sleep(1500);
    } catch (err) {
      console.error(`\n  ERROR: ${err.message}`);
    }
  }
  console.log("\nAll done! Check the images.");
}

main();
