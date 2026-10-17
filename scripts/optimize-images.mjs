// Image pipeline: drop originals into media/ and run `npm run media`.
//
// For every original it writes, into public/media/:
//   <name>-<hash>-<width>.avif / .webp at a ladder of widths (never
//   upscaled), and records them in src/generated/media.json together with the
//   intrinsic size and, for opaque images, a tiny blurred preview.
// Render them with <Media name="..." sizes="..." /> (src/components/Media.tsx),
// which serves AVIF → WebP via <picture>, lazy-loads below the fold and
// reserves the image's space so the layout never jumps.
//
// File names carry the original's content hash, so they can be cached forever
// (a changed image gets new URLs). Outputs are committed, so deploys never
// re-encode; unchanged originals are skipped, so re-running is cheap.
import sharp from "sharp";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { extname, join, parse } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SRC = join(ROOT, "media");
const OUT = join(ROOT, "public", "media");
const MANIFEST = join(ROOT, "src", "generated", "media.json");
const WIDTHS = [480, 768, 1080, 1440, 1920, 2560];
const QUALITY = { avif: 52, webp: 78 };
const EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".tif", ".tiff", ".gif"]);

mkdirSync(SRC, { recursive: true });
mkdirSync(OUT, { recursive: true });
mkdirSync(join(ROOT, "src", "generated"), { recursive: true });

const previous = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : {};
const manifest = {};
const files = readdirSync(SRC).filter((f) => EXTS.has(extname(f).toLowerCase())).sort();

for (const file of files) {
  const name = parse(file).name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const buf = readFileSync(join(SRC, file));
  const hash = createHash("sha1").update(buf).digest("hex").slice(0, 10);
  const prev = previous[name];
  if (prev && prev.hash === hash && prev.sources.webp.every(([url]) => existsSync(join(ROOT, "public", url)))) {
    manifest[name] = prev;
    console.log("unchanged", name);
    continue;
  }
  const img = sharp(buf, { animated: false }).rotate(); // honour EXIF orientation
  const meta = await img.metadata();
  const width = meta.autoOrient?.width ?? meta.width;
  const height = meta.autoOrient?.height ?? meta.height;
  const alpha = Boolean(meta.hasAlpha);
  const ladder = [...WIDTHS.filter((w) => w < width), Math.min(width, WIDTHS[WIDTHS.length - 1])];
  const sources = { avif: [], webp: [] };
  for (const w of ladder) {
    const resized = img.clone().resize({ width: w, withoutEnlargement: true });
    for (const fmt of ["avif", "webp"]) {
      const out = `/media/${name}-${hash}-${w}.${fmt}`;
      const opts = fmt === "avif" ? { quality: QUALITY.avif, effort: 6 } : { quality: QUALITY.webp, alphaQuality: 90, effort: 6, smartSubsample: true };
      await resized.clone()[fmt](opts).toFile(join(ROOT, "public", out));
      sources[fmt].push([out, w]);
    }
  }
  // tiny preview for opaque images (shown blurred while the real image loads)
  let blur = null;
  if (!alpha) {
    const tiny = await img.clone().resize({ width: 16 }).webp({ quality: 50 }).toBuffer();
    blur = `data:image/webp;base64,${tiny.toString("base64")}`;
  }
  // the previous version of this image is no longer referenced (same-hash
  // re-encodes reuse their URLs, so keep anything still in the new set)
  if (prev) {
    const keep = new Set([...sources.avif, ...sources.webp].map(([url]) => url));
    for (const fmt of ["avif", "webp"]) for (const [url] of prev.sources[fmt]) if (!keep.has(url)) rmSync(join(ROOT, "public", url), { force: true });
  }
  manifest[name] = { hash, width, height, alpha, sources, blur };
  console.log("encoded", name, `${width}x${height}`, ladder.join("/"));
}

// drop outputs of originals that no longer exist
for (const [name, entry] of Object.entries(previous)) {
  if (manifest[name]) continue;
  for (const fmt of ["avif", "webp"]) for (const [url] of entry.sources[fmt]) rmSync(join(ROOT, "public", url), { force: true });
  console.log("removed", name);
}

writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`media.json: ${Object.keys(manifest).length} image(s)`);
