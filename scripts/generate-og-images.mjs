// Generate 1200x630 Open Graph social cards.
// One default card for the site, plus per-content-type variants.
// All produced via sharp from an SVG template — no external API.

import fs from "fs";
import path from "path";
import sharp from "sharp";

const publicDir = path.join(process.cwd(), "public");
const outDir = path.join(publicDir, "og");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Template builder. Returns an SVG string for a 1200x630 OG card.
// The text is hand-positioned for max impact at social-share preview sizes.
function buildOgSvg({
  eyebrow,
  headline,
  tagline,
  accent = "#ea580c",
}) {
  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0a0a"/>
      <stop offset="100%" stop-color="#18181b"/>
    </linearGradient>
    <linearGradient id="orange" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fb923c"/>
      <stop offset="50%" stop-color="${accent}"/>
      <stop offset="100%" stop-color="#9a3412"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse">
      <path d="M 64 0 L 0 0 0 64" fill="none" stroke="${accent}" stroke-opacity="0.08" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <ellipse cx="200" cy="150" rx="500" ry="350" fill="url(#glow)"/>
  <ellipse cx="1000" cy="500" rx="400" ry="280" fill="url(#glow)" opacity="0.6"/>

  <!-- Top accent bar -->
  <rect x="0" y="0" width="1200" height="6" fill="${accent}"/>
  <!-- Bottom accent bar -->
  <rect x="0" y="624" width="1200" height="6" fill="${accent}"/>

  <!-- Logo barbell mark (large, top-left) -->
  <g transform="translate(80, 80)">
    <rect width="120" height="120" fill="#0a0a0a" stroke="${accent}" stroke-width="2"/>
    <g transform="translate(8, 8) scale(1.625)">
      <rect x="6" y="20" width="4" height="24" fill="${accent}"/>
      <rect x="10" y="24" width="3" height="16" fill="${accent}"/>
      <rect x="13" y="29" width="38" height="6" fill="${accent}"/>
      <rect x="51" y="24" width="3" height="16" fill="${accent}"/>
      <rect x="54" y="20" width="4" height="24" fill="${accent}"/>
    </g>
  </g>

  <!-- Wordmark next to logo -->
  <text x="220" y="160" font-family="Helvetica, Arial, sans-serif" font-weight="900" font-size="36" fill="#ffffff" font-style="italic" letter-spacing="-1">GARAGEGYM</text>
  <text x="220" y="200" font-family="Helvetica, Arial, sans-serif" font-weight="900" font-size="36" fill="${accent}" font-style="italic" letter-spacing="-1">BUILDERS</text>

  <!-- Eyebrow -->
  <text x="80" y="320" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="20" fill="${accent}" letter-spacing="6">${escapeXml(eyebrow.toUpperCase())}</text>

  <!-- Big headline (auto-wraps via tspan if too long) -->
  ${renderHeadline(headline)}

  <!-- Tagline -->
  ${tagline ? `<text x="80" y="540" font-family="Helvetica, Arial, sans-serif" font-weight="500" font-size="26" fill="#a1a1aa">${escapeXml(tagline)}</text>` : ""}

  <!-- Bottom URL -->
  <text x="80" y="590" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="18" fill="#52525b" letter-spacing="3">GARAGEGYMBUILDERS.COM</text>
</svg>`;
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Naive headline wrapping: max ~22 chars per line, max 2 lines, 88px font.
function renderHeadline(text) {
  const words = text.split(" ");
  const lines = [];
  let current = "";
  for (const w of words) {
    if ((current + " " + w).trim().length > 22) {
      lines.push(current.trim());
      current = w;
    } else {
      current = (current + " " + w).trim();
    }
    if (lines.length >= 1 && (current.length > 22 || words.indexOf(w) === words.length - 1)) {
      // already prepared
    }
  }
  if (current) lines.push(current.trim());
  const trimmed = lines.slice(0, 2);
  if (lines.length > 2) {
    trimmed[1] = trimmed[1].slice(0, 20) + "...";
  }
  let y = 400;
  return trimmed
    .map((line, i) => {
      return `<text x="80" y="${y + i * 86}" font-family="Helvetica, Arial, sans-serif" font-weight="900" font-size="84" fill="#ffffff" font-style="italic" letter-spacing="-3">${escapeXml(line.toUpperCase())}</text>`;
    })
    .join("\n  ");
}

const variants = [
  {
    name: "default.png",
    eyebrow: "Home Gym Reviews",
    headline: "Build Your Iron Paradise",
    tagline: "Expert reviews. Real testing. No fluff.",
  },
  {
    name: "review.png",
    eyebrow: "In-Depth Review",
    headline: "Tested by Real Lifters",
    tagline: "Hands-on reviews of home gym equipment.",
  },
  {
    name: "guide.png",
    eyebrow: "Complete Guide",
    headline: "Everything You Need to Know",
    tagline: "Expert guides for every home gym question.",
  },
  {
    name: "build.png",
    eyebrow: "Build Guide",
    headline: "Complete Setups at Every Budget",
    tagline: "$500 to $5000 home gym builds.",
  },
  {
    name: "best-gear.png",
    eyebrow: "Best Gear",
    headline: "Tested Top Picks",
    tagline: "The best home gym equipment, ranked.",
  },
];

async function main() {
  console.log("Generating OG images...");
  for (const v of variants) {
    const svg = buildOgSvg(v);
    const out = path.join(outDir, v.name);
    await sharp(Buffer.from(svg))
      .png({ quality: 90, compressionLevel: 9 })
      .toFile(out);
    console.log(`  /og/${v.name}`);
  }
  // Also write the default to the public root for the canonical OG image
  const defaultSvg = buildOgSvg(variants[0]);
  await sharp(Buffer.from(defaultSvg))
    .png({ quality: 90, compressionLevel: 9 })
    .toFile(path.join(publicDir, "og-default.png"));
  console.log("  /og-default.png (canonical)");
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
