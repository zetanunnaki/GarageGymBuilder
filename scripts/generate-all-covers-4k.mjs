import fs from "fs";
import path from "path";
import https from "https";
import http from "http";
import sharp from "sharp";

const API_KEY = "a34ec7e113fd3f211e45fc9c44ecaabb";
const GENERATE_URL = "https://api.kie.ai/api/v1/gpt4o-image/generate";
const STATUS_URL = "https://api.kie.ai/api/v1/gpt4o-image/record-info";
const coversDir = "C:/Users/Issam/GarageGymBuilder/public/images/covers";
const progressFile = "C:/Users/Issam/GarageGymBuilder/scripts/cover-progress.json";

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
  const body = JSON.stringify({ prompt, size: "3:2", nVariants: 1 });
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

function buildPrompt(article) {
  const { type, title, category, slug } = article;
  const base = "Dark moody garage gym setting with near-black (#0a0a0a) background tones and deep charcoal (#27272a zinc-900) surfaces. Dramatic cinematic lighting with warm burnt-orange (#ea580c) accent light from the left side casting sharp angular shadows. Concrete or cinder block walls, black rubber floor mats, industrial athletic atmosphere. The overall palette must be very dark with orange as the only color accent — no blue, no green, no bright colors. Hyperrealistic professional product photography, editorial fitness magazine quality, shot on full-frame camera with 85mm lens. No people, no text, no logos, no watermarks, no cartoons, no illustrations.";

  if (type === "reviews") {
    const product = title.replace(/ Review$/i, "").replace(/^The /i, "");
    const categoryHints = {
      "Power Racks": `a ${product} power rack/cage with steel frame and pull-up bar, barbell racked on j-cups`,
      "Dumbbells": `a pair of ${product} dumbbells on a weight rack or bench`,
      "Barbells": `a ${product} barbell on a rack with weight plates loaded, showing knurling detail`,
      "Benches": `a ${product} adjustable weight bench in incline position`,
      "Cardio": `a ${product} cardio machine (exercise bike, rower, or treadmill)`,
      "Accessories": `${product} fitness accessory/equipment laid out on a gym bench or floor`,
      "Weight Plates": `${product} weight plates stacked or loaded on a barbell`,
      "Kettlebells": `${product} kettlebells arranged on the gym floor`,
      "Recovery": `${product} recovery/mobility tool on a gym bench`,
      "Cable Machines": `a ${product} cable machine station with weight stack`,
      "Power Towers": `a ${product} power tower with dip bars and pull-up station`,
      "Flooring": `${product} gym flooring mats installed on a garage floor`,
    };
    const subject = categoryHints[category] || `${product} gym equipment prominently displayed`;
    return `Professional product photography of ${subject}. ${base}`;
  }

  if (type === "guides") {
    const guideSubjects = {
      "how-to-build-a-garage-gym": "a fully equipped home garage gym with power rack, barbell, plates, bench, and dumbbells arranged in a well-organized space",
      "how-to-choose-power-rack": "multiple power rack styles side by side — full cage, half rack, and squat stand — showing different configurations",
      "how-to-choose-barbell": "several Olympic barbells displayed horizontally showing different knurling patterns and sleeve finishes",
      "how-to-choose-weight-bench": "multiple weight benches — flat, incline, and adjustable — arranged showing different positions",
      "how-to-choose-adjustable-dumbbells": "modern adjustable dumbbell sets on a rack, showing the dial and selector mechanism",
      "how-to-choose-gym-flooring": "close-up of thick black rubber gym flooring being installed, with a utility knife and measuring tape",
      "how-to-choose-weight-plates": "assorted weight plates — cast iron, rubber bumper, and calibrated — arranged by size on the floor",
      "how-to-choose-cardio-machine": "a rowing machine, air bike, and spin bike arranged in a row showing different cardio options",
      "how-to-choose-pull-up-bar": "different pull-up bar styles — doorway, wall-mounted, and ceiling-mounted — installed on a concrete wall",
      "how-to-choose-kettlebell": "cast iron kettlebells of various weights arranged in ascending order on a rubber mat",
      "garage-gym-flooring-guide": "thick black horse stall mats being laid down on a concrete garage floor, with edges butted together",
      "garage-gym-ventilation-guide": "a garage gym with an open garage door and box fan, showing air circulation in a workout space",
      "garage-gym-lighting-guide": "bright LED shop lights illuminating a dark garage gym from above, dramatic shadows on equipment",
      "garage-gym-safety": "a power rack with pin-pipe safeties set at the correct height, barbell racked with safety measures visible",
      "garage-gym-mistakes-to-avoid": "a cluttered, poorly organized garage gym with equipment scattered haphazardly as a cautionary example",
      "home-gym-vs-commercial-gym": "split scene — left half shows a dark moody home garage gym, right half shows a bright commercial gym floor",
      "home-gym-programming-guide": "a training notebook and pen on a weight bench, with a barbell and rack visible in the background",
      "home-gym-on-a-budget-complete-guide": "budget-friendly gym equipment — used barbell, cast iron plates, basic squat stands — with price tags visible",
      "barbell-only-exercises": "an Olympic barbell loaded with plates on the floor, positioned for deadlifts, with chalk marks on the bar",
      "buying-used-gym-equipment": "used gym equipment — slightly worn barbell, scuffed plates, and a used bench — arranged in a garage",
      "home-gym-small-spaces": "compact gym equipment — foldable rack, adjustable dumbbells, resistance bands — in a tight corner space",
      "home-gym-accessories-essentials": "gym accessories collection — lifting belt, chalk, wrist wraps, bands, collars — laid out on a bench",
      "strength-vs-hypertrophy-programming": "a heavy barbell with thick plates for strength next to lighter dumbbells for hypertrophy, contrasting approaches",
      "home-gym-deload-recovery-guide": "foam rollers, lacrosse balls, and light resistance bands arranged on a gym mat for recovery work",
      "home-gym-over-40": "mature-looking gym equipment in a well-lit garage gym — adjustable bench, moderate weights, resistance bands",
      "home-gym-warm-up-guide": "resistance bands, foam roller, and a light kettlebell arranged on a rubber mat for warm-up preparation",
      "home-gym-nutrition-basics": "a protein shaker bottle and meal prep container sitting on a weight bench next to a barbell",
      "home-gym-back-pain": "a trap bar and foam roller on a rubber mat, rehabilitation-friendly equipment setup",
      "home-gym-for-runners": "a treadmill or rower alongside kettlebells and resistance bands, runner's cross-training setup",
      "home-gym-for-boxing": "a heavy bag hanging from the ceiling, boxing gloves on the floor, jump rope nearby",
      "home-gym-for-cyclists": "a spin bike next to a squat rack, cyclist cross-training equipment",
      "home-gym-for-women": "a well-organized home gym with pink/purple accents, kettlebells, resistance bands, and an adjustable bench",
      "home-gym-for-mma": "a heavy bag, kettlebells, gymnastic rings, and a jump rope — MMA training equipment",
      "home-gym-postpartum": "light dumbbells, resistance bands, and a yoga mat in a home gym setting for postpartum fitness",
      "home-gym-for-travel": "portable fitness equipment — resistance bands, suspension trainer, jump rope — in a travel bag",
      "home-gym-rehab-recovery": "rehabilitation equipment — light bands, foam roller, balance board — in a clean gym space",
      "crossfit-home-gym-setup": "a CrossFit-style garage gym with pull-up rig, bumper plates, rower, kettlebells, and wall balls",
      "powerlifting-home-gym-setup": "a heavy-duty power rack with competition bench, stiff bar, and 500+ lbs of iron plates",
      "bodybuilding-home-gym-setup": "a bodybuilding garage gym with cable station, adjustable dumbbells, incline bench, and mirror",
    };

    const subject = guideSubjects[slug] || `gym equipment and tools relevant to ${title.toLowerCase()}`;
    return `Wide establishing shot of ${subject}. ${base}`;
  }

  if (type === "best-gear") {
    if (slug.includes("-vs-") || slug.includes("comparison")) {
      const items = title.replace(/^Best /i, "").replace(/ Compared$/i, "");
      return `Professional product photography of multiple ${items.toLowerCase()} arranged side by side for comparison on a dark gym floor. ${base}`;
    }
    if (slug.startsWith("best-")) {
      const gear = title.replace(/^Best /i, "").replace(/ \(.*\)$/i, "");
      return `Professional product photography of premium ${gear.toLowerCase()} arranged artfully on a dark gym floor or rack. Multiple items showing variety and options. ${base}`;
    }
    if (slug.startsWith("is-")) {
      const product = title.replace(/^Is the /i, "").replace(/ Worth It\??$/i, "");
      return `Professional product photography of ${product} prominently displayed in a dark garage gym, hero shot composition. ${base}`;
    }
    return `Professional product photography of ${title.toLowerCase().replace(/[^a-z0-9 ]/g, "")} gym equipment. ${base}`;
  }

  if (type === "builds") {
    const buildSubjects = {
      "apartment-gym-under-300": "a minimal apartment gym setup in a small space — adjustable dumbbells, resistance bands, and a yoga mat",
      "home-gym-under-500": "a starter home gym with a basic squat stand, barbell, iron plates, and a flat bench",
      "home-gym-under-750": "a solid home gym with a power rack, barbell, 300 lbs of plates, and an adjustable bench",
      "home-gym-under-2000": "a well-equipped garage gym with full power cage, Olympic barbell, bumper plates, bench, and dumbbells",
      "home-gym-under-3000": "a premium home gym with power rack, specialty bars, cable attachment, full plate set, and cardio machine",
      "home-gym-under-4000": "a nearly complete garage gym with competition rack, multiple barbells, full plate tree, bench, and rower",
      "dream-gym-under-5000": "a dream garage gym fully loaded — power rack, multiple bars, full plate collection, cable station, rower, and accessories",
      "beginner-home-gym-build": "a beginner-friendly home gym with simple squat stands, barbell, plates, and a bench — clean and approachable",
      "powerlifter-home-gym-build": "a powerlifting garage gym — heavy-duty rack, stiff deadlift bar, competition plates, flat bench, chalk bucket",
      "bodybuilder-home-gym-build": "a bodybuilder's garage gym — cable machine, adjustable dumbbells, incline bench, dip belt, mirrors on the wall",
      "crossfit-home-gym-build": "a CrossFit garage gym — pull-up rig, bumper plates, rower, kettlebells, plyo box, rings hanging from ceiling",
      "mma-fighter-home-gym-build": "an MMA fighter's garage gym — heavy bag, speed bag, kettlebells, battle ropes, gymnastic rings",
      "womens-home-gym-build": "a women's home gym — colorful kettlebells, resistance bands, adjustable bench, and a clean organized space",
      "senior-home-gym-build": "a senior-friendly home gym — light dumbbells, resistance bands, sturdy handles, non-slip mat, well-lit space",
      "olympic-weightlifting-home-gym-build": "an Olympic lifting platform with bumper plates, weightlifting bar, and squat rack in a garage gym",
      "calisthenics-home-gym-build": "a calisthenics garage gym — pull-up bar, parallel bars, gymnastic rings, dip station, parallettes",
    };

    const subject = buildSubjects[slug] || `a complete home gym build setup with various equipment for ${title.toLowerCase()}`;
    return `Wide-angle establishing shot of ${subject}. ${base}`;
  }

  return `Professional photography of gym equipment for ${title.toLowerCase()}. ${base}`;
}

function loadProgress() {
  if (fs.existsSync(progressFile)) {
    return JSON.parse(fs.readFileSync(progressFile, "utf8"));
  }
  return { completed: [], failed: [] };
}

function saveProgress(progress) {
  fs.writeFileSync(progressFile, JSON.stringify(progress, null, 2));
}

async function processArticle(article, index, total, progress) {
  const { coverFile } = article;
  const rawPath = path.join(coversDir, coverFile + ".png");
  const webpPath = path.join(coversDir, coverFile + ".webp");

  if (progress.completed.includes(coverFile)) {
    console.log(`[${index}/${total}] SKIP (done): ${coverFile}`);
    return true;
  }

  const prompt = buildPrompt(article);
  console.log(`[${index}/${total}] ${coverFile}`);
  console.log(`  Prompt: ${prompt.slice(0, 100)}...`);

  try {
    const taskId = await generateImage(prompt);
    process.stdout.write(`  Task ${taskId} — waiting`);
    const imageUrl = await pollForResult(taskId);
    console.log(`\n  Downloading...`);
    await downloadImage(imageUrl, rawPath);

    const rawMeta = await sharp(rawPath).metadata();
    await sharp(rawPath)
      .resize(3840, 2560, { kernel: sharp.kernel.lanczos3, fit: "fill" })
      .sharpen({ sigma: 0.8, m1: 0.5, m2: 0.5 })
      .webp({ quality: 90 })
      .toFile(webpPath);

    const finalSize = fs.statSync(webpPath).size;
    fs.unlinkSync(rawPath);

    console.log(`  DONE: ${rawMeta.width}x${rawMeta.height} -> 3840x2560 (${(finalSize / 1024).toFixed(0)} KB)`);

    progress.completed.push(coverFile);
    saveProgress(progress);
    return true;
  } catch (err) {
    console.error(`\n  ERROR: ${err.message}`);
    progress.failed.push({ coverFile, error: err.message });
    saveProgress(progress);
    return false;
  }
}

async function main() {
  const articles = JSON.parse(fs.readFileSync("scripts/articles-list.json", "utf8"));

  // Deduplicate by coverFile (some articles may share cover images)
  const seen = new Set();
  const unique = [];
  for (const a of articles) {
    if (!seen.has(a.coverFile)) {
      seen.add(a.coverFile);
      unique.push(a);
    }
  }

  console.log(`\n=== Generating ${unique.length} unique 4K cover images ===\n`);
  console.log(`Model: 4o Image API via Kie.ai`);
  console.log(`Output: 3840x2560 WebP @ quality 90`);
  console.log(`Destination: ${coversDir}\n`);

  const progress = loadProgress();
  console.log(`Previously completed: ${progress.completed.length}`);
  console.log(`Remaining: ${unique.length - progress.completed.length}\n`);

  let successCount = 0;
  let failCount = 0;

  // Process in batches of 3 (submit 3, then wait for all)
  const BATCH_SIZE = 3;
  const remaining = unique.filter(a => !progress.completed.includes(a.coverFile));

  for (let i = 0; i < remaining.length; i += BATCH_SIZE) {
    const batch = remaining.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(
      batch.map((article, j) =>
        processArticle(article, i + j + 1 + progress.completed.length, unique.length, progress)
      )
    );

    results.forEach(ok => ok ? successCount++ : failCount++);

    // Small delay between batches
    if (i + BATCH_SIZE < remaining.length) {
      console.log(`\n  --- Batch done. Waiting 2s before next batch ---\n`);
      await sleep(2000);
    }
  }

  console.log(`\n=== COMPLETE ===`);
  console.log(`Success: ${successCount}`);
  console.log(`Failed: ${failCount}`);
  console.log(`Total completed: ${progress.completed.length}/${unique.length}`);

  if (progress.failed.length > 0) {
    console.log(`\nFailed images:`);
    progress.failed.forEach(f => console.log(`  - ${f.coverFile}: ${f.error}`));
  }
}

main().catch(console.error);
