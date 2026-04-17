import fs from "fs";
import path from "path";
import https from "https";
import http from "http";
import sharp from "sharp";
import matter from "gray-matter";

const API_KEY = "a34ec7e113fd3f211e45fc9c44ecaabb";
const API_URL = "https://api.kie.ai/api/v1/flux/kontext/generate";
const STATUS_URL = "https://api.kie.ai/api/v1/flux/kontext/record-info";
const coversDir = "public/images/covers";
const reviewDir = "src/content/reviews";

function fetchJson(u, o = {}) { return new Promise((r, j) => { const m = u.startsWith("https") ? https : http; const q = m.request(u, o, res => { let d = ""; res.on("data", c => d += c); res.on("end", () => { try { r({ s: res.statusCode, b: JSON.parse(d) }); } catch { r({ s: res.statusCode, b: d }); } }); }); q.on("error", j); if (o.body) q.write(o.body); q.end(); }); }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
async function gen(p) { const b = JSON.stringify({ prompt: p, aspectRatio: "16:9", outputFormat: "jpeg", model: "flux-kontext-max", safetyTolerance: 2, enableTranslation: false, promptUpsampling: true }); const r = await fetchJson(API_URL, { method: "POST", headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" }, body: b }); if (r.b.code !== 200) throw new Error(JSON.stringify(r.b)); return r.b.data.taskId; }
async function poll(t) { for (let i = 0; i < 90; i++) { await sleep(5000); const r = await fetchJson(`${STATUS_URL}?taskId=${t}`, { method: "GET", headers: { Authorization: `Bearer ${API_KEY}` } }); const d = r.b.data; if (!d) continue; if (d.successFlag === 1 && d.response?.resultImageUrl) return d.response.resultImageUrl; if (d.successFlag >= 2) throw new Error(d.errorMessage || "F"); process.stdout.write("."); } throw new Error("T"); }
async function dl(u, f) { return new Promise((r, j) => { const m = u.startsWith("https") ? https : http; m.get(u, res => { if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) return dl(res.headers.location, f).then(r).catch(j); const s = fs.createWriteStream(f); res.pipe(s); s.on("finish", () => { s.close(); r(); }); }).on("error", j); }); }

const categoryPrompts = {
  "Flooring": "Close-up of black rubber gym floor mats being installed in a dark garage gym with orange work light. Realistic photograph, cinematic 16:9, no people, no text.",
  "Barbells": "An Olympic barbell with knurling detail resting on a power rack in a dark garage gym with dramatic orange side lighting. Realistic photograph, cinematic 16:9, no people, no text.",
  "Recovery": "Recovery tools on a dark gym floor — foam roller and massage gun with dramatic warm orange side lighting. Realistic photograph, cinematic 16:9, no people, no text.",
  "Accessories": "Close-up of gym accessories — lifting belt, chalk, and barbell collars on a dark surface with orange accent lighting. Realistic photograph, cinematic 16:9, no people, no text.",
  "Calisthenics": "A power tower dip station in a dark garage gym with orange accent lighting from behind. Realistic photograph, cinematic 16:9, no people, no text.",
  "Cardio": "Indoor exercise bike or cardio machine in a dark home gym with dramatic orange rim lighting. Realistic photograph, cinematic 16:9, no people, no text.",
  "Benches": "An adjustable weight bench in a dark garage gym with warm orange side lighting on the steel frame. Realistic photograph, cinematic 16:9, no people, no text.",
  "Power Racks": "A heavy steel power cage rack in a dark garage gym with dramatic orange accent lighting. Realistic photograph, cinematic 16:9, no people, no text.",
  "Free Weights": "Cast iron kettlebells and weight plates on a dark rubber gym floor with orange accent lighting. Realistic photograph, cinematic 16:9, no people, no text.",
  "Storage": "Organized gym equipment storage — plate tree and dumbbell rack in a dark garage gym with orange accent light. Realistic photograph, cinematic 16:9, no people, no text.",
  "Conditioning": "A battle rope and resistance bands on dark rubber gym floor with dramatic orange side lighting. Realistic photograph, cinematic 16:9, no people, no text.",
  "Plates": "Colorful rubber bumper plates stacked on a storage tree in a dark garage gym with orange accent lighting. Realistic photograph, cinematic 16:9, no people, no text.",
  "Cable Machines": "A cable pulley machine with weight stack in a dark garage gym with orange rim lighting. Realistic photograph, cinematic 16:9, no people, no text.",
};

// Find reviews missing covers
const missing = [];
fs.readdirSync(reviewDir).filter(f => f.endsWith(".mdx")).forEach(f => {
  const { data } = matter(fs.readFileSync(path.join(reviewDir, f), "utf8"));
  if (data.featuredImage && !fs.existsSync("public" + data.featuredImage)) {
    missing.push({ slug: f.replace(".mdx", ""), category: data.category || "Accessories" });
  }
});

async function main() {
  console.log(`Generating ${missing.length} review covers...\n`);
  for (let i = 0; i < missing.length; i++) {
    const item = missing[i];
    const webp = path.join(coversDir, item.slug + ".webp");
    const jpg = path.join(coversDir, item.slug + ".jpg");
    if (fs.existsSync(webp)) { console.log(`[${i + 1}] SKIP ${item.slug}`); continue; }
    const prompt = categoryPrompts[item.category] || categoryPrompts["Accessories"];
    console.log(`[${i + 1}/${missing.length}] ${item.slug} (${item.category})`);
    try {
      const t = await gen(prompt);
      process.stdout.write(`  ${t} `);
      const u = await poll(t);
      console.log(" DL");
      await dl(u, jpg);
      await sharp(jpg).webp({ quality: 80 }).toFile(webp);
      fs.unlinkSync(jpg);
      console.log(`  DONE ${item.slug}.webp`);
      if (i < missing.length - 1) await sleep(1500);
    } catch (e) { console.error(`  ERR: ${e.message}`); }
  }
  console.log("\nAll done!");
}
main();
