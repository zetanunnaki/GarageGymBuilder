import fs from "fs";
import path from "path";
import matter from "gray-matter";
import https from "https";
import http from "http";

const API_KEY = "a34ec7e113fd3f211e45fc9c44ecaabb";
const API_URL = "https://api.kie.ai/api/v1/flux/kontext/generate";
const STATUS_URL = "https://api.kie.ai/api/v1/flux/kontext/record-info";
const contentDir = path.join(process.cwd(), "src/content");
const coversDir = path.join(process.cwd(), "public/images/covers");
const contentTypes = ["best-gear", "reviews", "guides", "builds"];

// Ensure covers directory exists
if (!fs.existsSync(coversDir)) {
  fs.mkdirSync(coversDir, { recursive: true });
}

function fetchJson(url, options = {}) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith("https") ? https : http;
    const req = mod.request(url, options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on("error", reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function generateImage(prompt) {
  const body = JSON.stringify({
    prompt,
    aspectRatio: "16:9",
    outputFormat: "jpeg",
    model: "flux-kontext-pro",
    safetyTolerance: 2,
    enableTranslation: false,
  });

  const res = await fetchJson(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body,
  });

  if (res.body.code !== 200) {
    throw new Error(`Generate failed: ${JSON.stringify(res.body)}`);
  }

  return res.body.data.taskId;
}

async function pollForResult(taskId, maxAttempts = 60) {
  for (let i = 0; i < maxAttempts; i++) {
    await sleep(5000);
    const url = `${STATUS_URL}?taskId=${taskId}`;
    const res = await fetchJson(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${API_KEY}` },
    });

    const data = res.body.data;
    if (!data) continue;

    if (data.successFlag === 1 && data.response?.resultImageUrl) {
      return data.response.resultImageUrl;
    }
    if (data.successFlag === 2 || data.successFlag === 3) {
      throw new Error(`Task failed: ${data.errorMessage || "Unknown error"}`);
    }
    process.stdout.write(".");
  }
  throw new Error("Timeout waiting for image generation");
}

async function downloadImage(url, filePath) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith("https") ? https : http;
    mod.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location, filePath).then(resolve).catch(reject);
      }
      const fileStream = fs.createWriteStream(filePath);
      res.pipe(fileStream);
      fileStream.on("finish", () => {
        fileStream.close();
        resolve();
      });
      fileStream.on("error", reject);
    }).on("error", reject);
  });
}

// Collect all articles that need cover images
const articles = [];
for (const type of contentTypes) {
  const dir = path.join(contentDir, type);
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");
    const content = fs.readFileSync(path.join(dir, file), "utf8");
    const { data } = matter(content);
    const coverFileName = slug + ".jpg";
    const coverPath = path.join(coversDir, coverFileName);

    // Skip if cover already exists
    if (fs.existsSync(coverPath)) {
      console.log(`  SKIP ${slug} (cover exists)`);
      continue;
    }

    articles.push({
      slug,
      title: data.title || slug,
      category: data.category || type,
      type,
      coverPath,
      coverFileName,
    });
  }
}

console.log(`\nFound ${articles.length} articles needing cover images.\n`);

// Generate prompts tailored to each article
function makePrompt(article) {
  const base = `Dark moody professional product photography style, gym equipment in a dimly lit garage gym setting, dramatic orange accent lighting, black and dark gray tones, industrial atmosphere, high contrast, cinematic composition, no text, no watermarks, 16:9 aspect ratio`;

  const specifics = {
    "best-power-racks-under-500": `A powerful steel power rack/squat cage in a dark garage gym with dramatic orange side lighting illuminating the steel frame, barbell loaded with plates resting on j-cups, ${base}`,
    "best-adjustable-dumbbells": `A pair of modern adjustable dumbbells on a dark rubber gym floor, dramatic orange backlight casting long shadows, ${base}`,
    "best-budget-barbells": `A close-up of an Olympic barbell loaded with iron plates on a dark rubber floor, dramatic orange rim lighting on the knurling, ${base}`,
    "best-air-bikes": `An air bike/assault bike in a dark garage gym with dramatic orange accent lighting hitting the fan blades, moody atmosphere, ${base}`,
    "best-weight-benches": `An adjustable weight bench in an incline position in a dark garage gym, orange accent light highlighting the steel frame, ${base}`,
    "best-weight-sets": `Olympic barbell with stacked weight plates on the floor in a dark garage gym, orange light reflecting off the iron plates, ${base}`,
    "best-garage-gym-accessories": `Various gym accessories (chalk, bands, wrist wraps, ab wheel) arranged on a dark rubber floor with dramatic orange accent lighting, ${base}`,
    "rep-pr4000-vs-rogue-r3": `Two power racks side by side in a dark garage gym, one slightly smaller than the other, dramatic orange lighting creating competition atmosphere, ${base}`,
    "best-resistance-bands": `Resistance bands of different colors and thicknesses draped over a power rack in a dark garage gym with orange accent lighting, ${base}`,
    "best-olympic-barbells": `Multiple Olympic barbells displayed vertically in a barbell holder in a dark gym, close-up on knurling details, orange rim lighting, ${base}`,
    "best-pull-up-bars": `A wall-mounted pull-up bar in a dark garage gym with dramatic orange uplighting, muscular silhouette, ${base}`,
    "best-bumper-plates": `Colorful bumper plates stacked on a plate tree in a dark garage gym, orange accent light highlighting the rubber texture, ${base}`,
    "best-gym-flooring": `Horse stall rubber mats being laid on a concrete garage floor, dramatic overhead orange lighting, dark atmosphere, ${base}`,
    "fitness-reality-810xlt-review": `A budget power rack/cage with pull-up bar in a residential garage gym, orange accent lighting on the steel frame, ${base}`,
    "rep-fitness-pr4000-review": `A mid-range 3x3 steel power rack with numbered uprights in a dark garage gym, orange accent light on the steel, ${base}`,
    "bowflex-selecttech-552-review": `Bowflex-style adjustable dumbbells with dial mechanism on a dark background, orange accent backlight, ${base}`,
    "titan-t3-power-rack-review": `A heavy-duty power rack with laser-cut numbered holes in a dark garage gym, dramatic orange side lighting, ${base}`,
    "rogue-echo-bike-review": `A heavy-duty air bike with fan blades in a dark garage gym, dramatic orange lighting on the frame, sweat drops visible, ${base}`,
    "flybird-adjustable-bench-review": `A foldable adjustable weight bench at incline position in a dark garage gym, orange accent lighting, ${base}`,
    "cap-barbell-300-review": `A 300lb Olympic weight set with barbell and cast iron plates on a dark garage floor, orange accent lighting, ${base}`,
    "rogue-monster-lite-r3-review": `A premium heavy-duty power rack with thick steel uprights and multiple attachments in a dark garage gym, orange lighting highlighting American steel construction, ${base}`,
    "garage-gym-flooring-guide": `Close-up of thick rubber gym flooring being installed on concrete, utility knife cutting mat, orange work light illumination, ${base}`,
    "how-to-build-a-garage-gym": `Wide shot of a complete garage gym setup with rack, barbell, plates, bench visible in a residential garage, dramatic orange overhead lighting, ${base}`,
    "garage-gym-ventilation-guide": `A garage gym with a large industrial fan mounted on the wall, airflow visible with chalk dust, orange accent lighting, ${base}`,
    "garage-gym-lighting-guide": `LED shop lights illuminating a dark garage gym, dramatic before-and-after feel with one side dark and one side bright with orange-tinted LED light, ${base}`,
    "barbell-maintenance-guide": `Close-up of barbell maintenance tools (brush, oil, cloth) next to a barbell shaft showing knurling detail, orange accent light, ${base}`,
    "home-gym-programming-guide": `A notebook and pen on a weight bench in a dark garage gym, training program written on page, barbell visible in background, orange accent lighting, ${base}`,
    "garage-gym-mistakes-to-avoid": `A cluttered, disorganized garage gym with equipment scattered around, warning orange lighting creating dramatic shadows, ${base}`,
    "soundproofing-garage-gym": `Acoustic foam panels and rubber mats in a garage gym setting, barbell on floor, sound wave visualization with orange accents, ${base}`,
    "home-gym-vs-commercial-gym": `Split image: dark empty garage gym on one side vs crowded bright commercial gym on the other, orange dividing line, ${base}`,
    "buying-used-gym-equipment": `Used gym equipment (slightly worn rack, plates with patina) in a pickup truck bed or on a driveway, golden hour orange lighting, ${base}`,
    "garage-gym-safety": `Safety spotter arms catching a barbell in a dark power rack, dramatic orange emergency-style lighting, ${base}`,
    "home-gym-under-500": `A minimal but functional home gym setup with squat stands, barbell, and plates in a small garage, budget feel, orange accent lighting, ${base}`,
    "home-gym-under-1000": `A complete home gym with power rack, bench, barbell, plates, and rubber flooring in a one-car garage, orange accent lighting, ${base}`,
    "home-gym-under-2000": `A premium home gym setup with rack, air bike, bench, and full plate set in a two-car garage, professional orange lighting, ${base}`,
    "dream-gym-under-5000": `An ultimate dream garage gym with premium rack, multiple barbells, full bumper plate set, air bike, dumbbells — luxurious dark atmosphere with rich orange accent lighting, ${base}`,
  };

  return specifics[article.slug] || `${article.title}, ${base}`;
}

// Process articles sequentially (rate limit: 20 per 10 seconds)
async function main() {
  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    console.log(`[${i + 1}/${articles.length}] Generating: ${article.slug}`);

    try {
      const prompt = makePrompt(article);
      const taskId = await generateImage(prompt);
      process.stdout.write(`  Task ${taskId} — waiting`);

      const imageUrl = await pollForResult(taskId);
      console.log(`\n  Downloading...`);

      await downloadImage(imageUrl, article.coverPath);
      console.log(`  DONE -> ${article.coverFileName}`);

      // Rate limit: wait 1 second between requests
      if (i < articles.length - 1) await sleep(1000);
    } catch (err) {
      console.error(`\n  ERROR: ${err.message}`);
    }
  }

  console.log(`\nFinished! Check public/images/covers/`);
}

main();
