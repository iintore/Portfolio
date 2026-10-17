// Generates every image the site needs:
//  - decor/: sky gradients (colour profile sampled from the reference capture)
//    and grain. No source pixels are copied. Clouds come from make-clouds.mjs.
//  - placeholders/: neutral stand-ins at the exact pixel size of each original
//    slot, so layout and cropping match. Replace them with your own files.
//
// usage: node scripts/make-assets.mjs [referenceImagesDir]
import sharp from "sharp";
import { mkdirSync, existsSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = fileURLToPath(new URL("../public/", import.meta.url));
const REF = process.argv[2];
mkdirSync(join(OUT, "decor"), { recursive: true });
mkdirSync(join(OUT, "placeholders"), { recursive: true });

// ── sky gradients ──────────────────────────────────────────────────────────
// average each horizontal band of the reference sky into one colour stop.
// The last band is pinned to the page background (rgb 249,253,255) and the
// bottom 15% eases into it, so the sky meets the banner below without a seam.
const PAGE_BG = [249, 253, 255];
async function skyStops(file, bands = 48) {
  const { data, info } = await sharp(file).resize(1, bands, { fit: "fill" }).raw().toBuffer({ resolveWithObject: true });
  const stops = [];
  for (let i = 0; i < bands; i++) {
    const o = i * info.channels;
    const t = i / (bands - 1);
    const k = Math.max(0, Math.min(1, (t - 0.85) / 0.15)) ** 2; // 0 above 85%, 1 at the bottom
    const c = [0, 1, 2].map((j) => Math.round(data[o + j] * (1 - k) + PAGE_BG[j] * k));
    stops.push(`<stop offset="${t.toFixed(4)}" stop-color="rgb(${c.join(",")})"/>`);
  }
  return stops.join("");
}
// fallback stops measured from the live hero (top deep blue → bottom near-white)
const FALLBACK = [
  [0, "rgb(38,134,226)"], [0.45, "rgb(74,160,236)"], [0.75, "rgb(150,200,245)"], [0.92, "rgb(225,240,252)"], [1, "rgb(249,253,255)"],
].map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("");

function findRef(prefix) {
  if (!REF || !existsSync(REF)) return null;
  const f = readdirSync(REF).find((n) => n.startsWith(prefix));
  return f ? join(REF, f) : null;
}

async function sky(name, w, h, refPrefix) {
  const ref = findRef(refPrefix);
  const stops = ref ? await skyStops(ref) : FALLBACK;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">${stops}</linearGradient>
    <radialGradient id="glow" cx="0.75" cy="0.2" r="0.7"><stop offset="0" stop-color="#fff" stop-opacity="0.18"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
    <rect width="100%" height="100%" fill="url(#g)"/><rect width="100%" height="100%" fill="url(#glow)"/></svg>`;
  await sharp(Buffer.from(svg)).webp({ quality: 88 }).toFile(join(OUT, "decor", name));
}

// ── grain: feTurbulence noise tile ─────────────────────────────────────────
// grain: the SVG noise filter itself (~0.4 KB) instead of a rasterised tile;
// feTurbulence is spec-defined, so browsers render the same grain
async function noise(name, size) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`;
  writeFileSync(join(OUT, "decor", name), svg);
}

// ── placeholders ───────────────────────────────────────────────────────────
function label(w, h, text, dark = false) {
  const fs = Math.max(10, Math.round(Math.min(w, h) / 14));
  const c = dark ? "rgba(255,255,255,0.75)" : "rgba(30,30,30,0.55)";
  return `<text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-family="Helvetica, Arial, sans-serif" font-size="${fs}" fill="${c}">${text}</text>
          <text x="50%" y="${50 + (fs / h) * 130}%" text-anchor="middle" dominant-baseline="middle" font-family="Helvetica, Arial, sans-serif" font-size="${Math.round(fs * 0.6)}" fill="${c}">${w}×${h}</text>`;
}
async function photo(name, w, h, text, hue = 210) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${hue},18%,86%)"/><stop offset="1" stop-color="hsl(${hue},14%,70%)"/></linearGradient></defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <circle cx="50%" cy="40%" r="${Math.min(w, h) * 0.16}" fill="rgba(255,255,255,0.45)"/>
    <rect x="${w * 0.28}" y="${h * 0.6}" width="${w * 0.44}" height="${h * 0.5}" rx="${w * 0.2}" fill="rgba(255,255,255,0.45)"/>
    ${label(w, h, text)}</svg>`;
  await sharp(Buffer.from(svg)).webp({ quality: 85 }).toFile(join(OUT, "placeholders", name));
}
// transparent cut-out (hero figure / device mockups) – a translucent card shape
async function cutout(name, w, h, box, text) {
  const [x, y, bw, bh, r] = box.map((v, i) => (i % 2 === 0 ? v * w : v * h));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="${Math.min(bw, bh) * 0.12}" fill="rgba(255,255,255,0.55)" stroke="rgba(255,255,255,0.9)" stroke-width="${Math.max(2, w / 400)}"/>
    <g transform="translate(${x + bw / 2 - w / 2}, ${y + bh / 2 - h / 2})">${label(w, h, text)}</g></svg>`;
  await sharp(Buffer.from(svg)).png().toFile(join(OUT, "placeholders", name));
}
async function logo(name, size, text, round = false) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <rect width="100%" height="100%" rx="${round ? size / 2 : size * 0.18}" fill="hsl(210,20%,90%)"/>
    <text x="50%" y="52%" text-anchor="middle" dominant-baseline="middle" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="${size * 0.32}" fill="rgba(30,30,30,0.55)">${text}</text></svg>`;
  await sharp(Buffer.from(svg)).png().toFile(join(OUT, "placeholders", name));
}

// phone screen stand-in: device frame with a blank screen
async function phone(name, w, h, text) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <rect x="4" y="4" width="${w - 8}" height="${h - 8}" rx="${w * 0.15}" fill="#1b1d22"/>
    <rect x="${w * 0.045}" y="${w * 0.045}" width="${w - w * 0.09}" height="${h - w * 0.09}" rx="${w * 0.12}" fill="#f4f6f9"/>
    <rect x="${w * 0.36}" y="${w * 0.07}" width="${w * 0.28}" height="${w * 0.07}" rx="${w * 0.035}" fill="#1b1d22"/>
    ${[0.22, 0.3, 0.38, 0.46, 0.54].map((y, i) => `<rect x="${w * 0.12}" y="${h * y}" width="${w * (i % 2 ? 0.55 : 0.76)}" height="${h * 0.035}" rx="${h * 0.012}" fill="#dfe4ea"/>`).join("")}
    <rect x="${w * 0.12}" y="${h * 0.82}" width="${w * 0.76}" height="${h * 0.06}" rx="${h * 0.03}" fill="rgb(2,129,224)" opacity="0.8"/>
    <g transform="translate(0, ${-h * 0.12})">${label(w, h, text)}</g></svg>`;
  await sharp(Buffer.from(svg)).png().toFile(join(OUT, "placeholders", name));
}

// generic one-page resume layout: name block, section rules and grey text bars
async function resumeSheet(name, w, h) {
  const bars = [];
  let y = 330;
  const section = (title, rows) => {
    bars.push(`<text x="120" y="${y}" font-family="Helvetica, Arial" font-weight="700" font-size="26" fill="#1e1e1e">${title}</text>`);
    bars.push(`<rect x="120" y="${y + 18}" width="${w - 240}" height="2" fill="#e6e6e6"/>`);
    y += 60;
    for (const r of rows) {
      bars.push(`<rect x="${r[0]}" y="${y}" width="${r[1]}" height="16" rx="8" fill="${r[2] || "#d9dde2"}"/>`);
      y += r[3] || 34;
    }
    y += 40;
  };
  section("SUMMARY", [[120, 1180], [120, 1240], [120, 860]]);
  for (let i = 0; i < 4; i++) section(i === 0 ? "EXPERIENCE" : "", [[120, 360, "#b9c0c8"], [120, 240, "#d3e4f5"], [150, 1150], [150, 1100], [150, 900, undefined, 50]]);
  section("EDUCATION", [[120, 420, "#b9c0c8"], [120, 300]]);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <rect width="100%" height="100%" fill="#fdfdfd"/>
    <text x="120" y="190" font-family="Helvetica, Arial" font-weight="700" font-size="64" fill="#111">Your Name</text>
    <text x="120" y="240" font-family="Helvetica, Arial" font-weight="700" font-size="24" fill="rgb(2,129,224)">ROLE TITLE</text>
    ${bars.join("")}</svg>`;
  await sharp(Buffer.from(svg)).png().toFile(join(OUT, "placeholders", name));
}

await Promise.all([
  sky("sky-hero.webp", 2048, 1320, "7034c51a"),
  sky("sky-card.webp", 2048, 1321, "f99fe451"),
  noise("noise.svg", 256),
  // hero figure cut-out, 2048×1153, figure sits right of centre
  cutout("hero-figure.png", 2048, 1153, [0.36, 0.08, 0.3, 0.9], "Hero cut-out (transparent PNG)"),
  photo("avatar.webp", 256, 256, "Avatar"),
  logo("company-badge.png", 400, "Co", true),
  // project mockups (transparent PNGs, device held in frame)
  cutout("project-1.png", 2048, 1365, [0.42, 0.06, 0.26, 0.9], "Project 1 mockup"),
  cutout("project-2.png", 2048, 1365, [0.4, 0.06, 0.3, 0.9], "Project 2 mockup"),
  // card 3's image is anchored 370px past the card's right edge, so only the
  // left ~65% of it is ever on screen: keep the device inside that area
  cutout("project-3.png", 2048, 1881, [0.3, 0.06, 0.22, 0.9], "Project 3"),
  photo("about.webp", 1690, 2048, "About photo"),
  logo("exp-1.png", 512, "A"),
  logo("exp-2.png", 512, "B"),
  logo("exp-3.png", 512, "C"),
  photo("person-1.webp", 512, 436, "Photo", 30),
  photo("person-2.webp", 400, 400, "Photo", 160),
  photo("person-3.webp", 512, 436, "Photo", 280),
  resumeSheet("resume-sheet.png", 1536, 2146),
  ...[1, 2, 3, 4, 5, 6].map((n) => phone(`screen-${n}.png`, 530, 1090, `Screen ${n}`)),
  photo("bento-wide.png", 2376, 1388, "Wide media (video or image)", 205),
  photo("bento-square.png", 1128, 1128, "Feature media", 215),
  photo("avatar-a.webp", 96, 96, "", 30),
]);
console.log("assets written to", OUT);
