// Social share image (Open Graph / Twitter card), 1200 × 630 → public/og.jpg
// Built from the site's own pieces: sky gradient, a procedural cloud, the hero
// photo and the name/title. Re-run after changing any of them: npm run social
import sharp from "sharp";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const W = 1200, H = 630;
const at = (p) => `${ROOT}${p}`;
const manifest = JSON.parse(readFileSync(at("src/generated/media.json"), "utf8"));
const hero = manifest["hero-figure"].sources.webp.at(-1)[0];

const sky = await sharp(at("public/decor/sky-hero.webp")).resize(W, H, { fit: "cover" }).toBuffer();
const cloud = await sharp(at("public/decor/cloud-a.webp")).resize({ width: 980 }).toBuffer();
const figure = await sharp(at(`public${hero}`)).resize({ height: 560 }).toBuffer();
const fig = await sharp(figure).metadata();
// fade the figure's base into the page colour, as on the site
const fade = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0.72" stop-color="rgb(249,253,255)" stop-opacity="0"/>
    <stop offset="1" stop-color="rgb(249,253,255)" stop-opacity="1"/>
  </linearGradient></defs>
  <rect width="100%" height="100%" fill="url(#g)"/></svg>`);
const FONT = "Helvetica Neue, Helvetica, Arial, sans-serif";
const text = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <text x="72" y="248" font-family="${FONT}" font-size="92" font-weight="700" letter-spacing="-4" fill="#ffffff">Tony Lewis</text>
  <text x="76" y="316" font-family="${FONT}" font-size="40" font-weight="500" letter-spacing="-1" fill="rgba(255,255,255,0.92)">Product Designer</text>
  <text x="76" y="560" font-family="${FONT}" font-size="22" font-weight="600" letter-spacing="1.5" fill="rgb(20,20,20)">KIGALI, RWANDA · TONYLEWISMANZI.COM</text>
</svg>`);

await sharp(sky)
  .composite([
    { input: cloud, left: -120, top: 30, blend: "over" },
    { input: figure, left: W - fig.width + 40, top: H - fig.height - 10 },
    { input: fade, left: 0, top: 0 },
    { input: text, left: 0, top: 0 },
  ])
  .jpeg({ quality: 84, mozjpeg: true })
  .toFile(at("public/og.jpg"));
console.log("wrote public/og.jpg");
