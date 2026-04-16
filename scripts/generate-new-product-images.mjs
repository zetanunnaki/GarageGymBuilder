import fs from "fs";
import path from "path";
import https from "https";
import http from "http";
import sharp from "sharp";

const API_KEY = "a34ec7e113fd3f211e45fc9c44ecaabb";
const API_URL = "https://api.kie.ai/api/v1/flux/kontext/generate";
const STATUS_URL = "https://api.kie.ai/api/v1/flux/kontext/record-info";
const productsDir = "C:/Users/Issam/GarageGymBuilder/public/images/products";

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
    prompt, aspectRatio: "1:1", outputFormat: "jpeg",
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

const S = "Product centered on a pure black background (#0a0a0a). Studio lighting with warm orange rim light from behind. Clean isolated product shot, no floor visible, no gym background, no people, no text, no logos. Square 1:1. Photorealistic, high-end e-commerce product photography.";

const items = [
  { name: "balancefrom-puzzle-mat", prompt: `Interlocking black EVA foam exercise puzzle mat tiles, 6 tiles arranged showing the interlocking edges. ${S}` },
  { name: "yes4all-dumbbell-rack", prompt: `A 5-tier A-frame dumbbell rack holding pairs of hex dumbbells in graduated sizes. Black steel frame. ${S}` },
  { name: "valor-fitness-cable-station", prompt: `A wall-mounted cable pulley machine with weight stack, lat bar attachment hanging from the cable. Black steel frame. ${S}` },
  { name: "titan-safety-squat-bar", prompt: `A safety squat bar with cambered handles and thick padded yoke. Black bar with chrome sleeves. ${S}` },
  { name: "cap-ez-curl-bar", prompt: `A chrome Olympic EZ curl bar with W-shaped camber in the grip area. No plates loaded. Shiny chrome finish. ${S}` },
  { name: "yes4all-landmine", prompt: `A T-bar row landmine barbell attachment, small steel pivot joint that mounts to the floor. Black steel. ${S}` },
  { name: "sunny-spin-bike", prompt: `A black and silver indoor cycling spin bike with heavy flywheel, adjustable seat, and handlebars. ${S}` },
  { name: "xterra-treadmill", prompt: `A compact folding treadmill in the unfolded running position. Black frame with LCD console display. ${S}` },
  { name: "sportsroyals-power-tower", prompt: `A tall black power tower station with pull-up bar at top, dip handles, padded back rest, and push-up handles at base. ${S}` },
  { name: "prosourcefit-dip-stand", prompt: `A pair of freestanding dip bar stands with angled legs and foam grip handles. Black steel frame. ${S}` },
  { name: "triggerpoint-grid", prompt: `A short foam roller with a distinctive grid-pattern texture surface. Orange and black coloring. ${S}` },
  { name: "theragun-mini", prompt: `A small handheld percussive massage gun, compact triangular shape, matte black finish. ${S}` },
  { name: "ironmind-gripper", prompt: `A metal hand gripper with aluminum handles and a thick steel coil spring. Silver handles. ${S}` },
  { name: "fat-gripz", prompt: `A pair of thick blue rubber bar grip attachments, cylindrical shape with a slit to attach to barbells. ${S}` },
  { name: "liquid-grip-chalk", prompt: `A white bottle of liquid chalk with black label. 8oz squeeze bottle. ${S}` },
  { name: "gymboss-timer", prompt: `A small digital interval timer device, rectangular with a clip on back, showing numbers on the LED screen. Black casing. ${S}` },
  { name: "gaiam-yoga-mat", prompt: `A thick rolled-up yoga exercise mat with a carry strap, purple/teal color. Partially unrolled showing the surface. ${S}` },
  { name: "spri-medicine-ball", prompt: `A textured rubber medicine ball, dark gray/black with grip-friendly surface texture. 12 pound size. ${S}` },
  { name: "titan-plate-tree", prompt: `A vertical Olympic weight plate storage tree with 6 pegs holding various sized plates and 2 barbell holders on top. Black steel. ${S}` },
  { name: "harbinger-gloves", prompt: `A pair of black weightlifting gloves with leather palms, mesh backs, and integrated wrist wraps. ${S}` },
  { name: "schwinn-upright-bike", prompt: `A black upright exercise bike with dual LCD screens, padded seat, and pedals. Schwinn-style frame. ${S}` },
  { name: "stamina-compact-strider", prompt: `A compact under-desk elliptical strider machine with two foot pedals and a small LCD display. Silver and black. ${S}` },
  { name: "body-solid-leg-press", prompt: `A vertical leg press machine with angled sled, back pad, and weight plate loading posts. Black steel frame. ${S}` },
  { name: "xmark-preacher-curl", prompt: `A seated preacher curl bench with angled arm pad and barbell rack. Black padded, steel frame. ${S}` },
  { name: "synergee-barbell-collars", prompt: `A pair of aluminum quick-release barbell collars, metallic silver with lever lock mechanism. ${S}` },
  { name: "chirp-wheel", prompt: `Three back stretching wheels in different sizes (large, medium, small), circular with foam padding around the rim. Teal colored. ${S}` },
  { name: "titan-wall-pulley", prompt: `A tall wall-mounted cable pulley system with high and low pulley positions, steel frame, cable and handles. ${S}` },
  { name: "marcy-smith-machine", prompt: `A large all-in-one smith machine cage system with cable crossover, smith bar, and bench. Black steel frame. ${S}` },
  { name: "relife-power-tower", prompt: `A black power tower with pull-up bar, dip handles, padded back support, and push-up stations at the base. ${S}` },
  { name: "hypervolt-go2", prompt: `A compact handheld massage gun, sleek black design with a round head attachment. Small and portable. ${S}` },
  { name: "optp-foam-roller", prompt: `A long white/off-white foam roller, 36 inches, smooth standard density, cylindrical shape. ${S}` },
  { name: "trx-bandit-handles", prompt: `A pair of resistance band handles with webbing loops and foam grips, black and yellow TRX colors. ${S}` },
  { name: "gym-wall-mirror", prompt: `A large rectangular frameless wall mirror, 48x24 inches, with polished edges. Clear reflective surface. ${S}` },
  { name: "stamina-power-tower", prompt: `A power tower dip station with pull-up bar, vertical knee raise pads, and dip handles. Gray and black steel frame. ${S}` },
  { name: "fringe-sport-bumper-plates", prompt: `A stack of color-coded rubber bumper plates — red 45lb, blue 35lb, yellow 25lb, green 10lb. Olympic size with steel center inserts. ${S}` },
];

async function main() {
  console.log(`Generating ${items.length} product images via Kie.ai...\n`);
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const jpgPath = path.join(productsDir, item.name + ".jpg");
    const webpPath = path.join(productsDir, item.name + ".webp");
    if (fs.existsSync(webpPath)) {
      console.log(`[${i+1}/${items.length}] SKIP: ${item.name}.webp`);
      continue;
    }
    console.log(`[${i+1}/${items.length}] ${item.name}`);
    try {
      const taskId = await generateImage(item.prompt);
      process.stdout.write(`  ${taskId} `);
      const url = await pollForResult(taskId);
      console.log("\n  Downloading...");
      await downloadImage(url, jpgPath);
      const inSize = fs.statSync(jpgPath).size;
      await sharp(jpgPath).webp({ quality: 80 }).toFile(webpPath);
      const outSize = fs.statSync(webpPath).size;
      fs.unlinkSync(jpgPath);
      console.log(`  DONE ${item.name}.webp (${(outSize/1024).toFixed(0)}KB)`);
      if (i < items.length - 1) await sleep(2000);
    } catch (e) { console.error(`  ERROR: ${e.message}`); }
  }
  console.log("\nAll done!");
}
main();
