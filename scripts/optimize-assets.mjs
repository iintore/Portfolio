// Build-time asset pipeline (the Vite equivalent of next/image).
// For every image in public/assets it writes content-hashed, resized WebP
// variants to public/assets/_opt and records them in src/generated/asset-manifest.json.
// GIFs and MP4s are re-encoded to small H.264 MP4s with a WebP poster.
// Outputs are content-addressed, so already-optimised files are skipped.
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const assetsDir = path.join(root, "public", "assets");
const outDir = path.join(assetsDir, "_opt");
const manifestPath = path.join(root, "src", "generated", "asset-manifest.json");

const WIDTHS = [96, 192, 384, 640, 960, 1280, 1920, 2560];
const QUALITY = 76;
const VIDEO_MAX_HEIGHT = 1100;

const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".webp"]);
const VIDEO_EXT = new Set([".gif", ".mp4", ".mov", ".webm"]);

let sharp;
let ffmpegPath;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.warn("[assets] sharp is unavailable, skipping image optimisation");
}
try {
  ffmpegPath = (await import("ffmpeg-static")).default;
  await fs.access(ffmpegPath);
} catch {
  ffmpegPath = null;
  console.warn("[assets] ffmpeg is unavailable, skipping video optimisation");
}

const exists = (file) => fs.access(file).then(() => true, () => false);

async function hashFile(file) {
  const data = await fs.readFile(file);
  return crypto.createHash("sha1").update(data).digest("hex").slice(0, 10);
}

async function optimiseImage(file, base, hash, previous) {
  const image = sharp(file);
  const { width, height, hasAlpha } = await image.metadata();
  const widths = WIDTHS.filter((w) => w < width);
  widths.push(Math.min(width, WIDTHS.at(-1)));

  const srcset = [];
  for (const w of widths) {
    const name = `${base}.${hash}-${w}.webp`;
    const target = path.join(outDir, name);
    if (!(await exists(target))) {
      await sharp(file).resize({ width: w }).webp({ quality: QUALITY, effort: 5 }).toFile(target);
    }
    srcset.push([w, `/assets/_opt/${name}`]);
  }

  let blur = previous?.hash === hash ? previous.blur : undefined;
  if (blur === undefined && !hasAlpha) {
    const tiny = await sharp(file).resize({ width: 16 }).webp({ quality: 40 }).toBuffer();
    blur = `data:image/webp;base64,${tiny.toString("base64")}`;
  }

  return { hash, width, height, srcset, ...(blur ? { blur } : {}) };
}

async function optimiseVideo(file, base, hash) {
  const mp4 = `${base}.${hash}.mp4`;
  const poster = `${base}.${hash}-poster.webp`;
  const mp4Path = path.join(outDir, mp4);
  const posterPath = path.join(outDir, poster);

  if (!ffmpegPath && !((await exists(mp4Path)) && (await exists(posterPath)))) {
    throw new Error("ffmpeg is needed to encode this video");
  }
  if (!(await exists(mp4Path))) {
    await run(ffmpegPath, [
      "-y", "-i", file,
      "-an",
      "-vf", `scale=-2:'min(${VIDEO_MAX_HEIGHT},ih)':flags=lanczos,format=yuv420p`,
      "-c:v", "libx264", "-preset", "slow", "-crf", "27",
      "-movflags", "+faststart",
      mp4Path,
    ]);
  }
  if (!(await exists(posterPath))) {
    const frame = path.join(outDir, `${base}.${hash}-frame.png`);
    await run(ffmpegPath, ["-y", "-i", mp4Path, "-frames:v", "1", frame]);
    await sharp(frame).webp({ quality: 70 }).toFile(posterPath);
    await fs.rm(frame);
  }

  const { width, height } = await sharp(posterPath).metadata();
  return { hash, width, height, video: `/assets/_opt/${mp4}`, poster: `/assets/_opt/${poster}` };
}

async function main() {
  if (!sharp) return;
  await fs.mkdir(outDir, { recursive: true });
  await fs.mkdir(path.dirname(manifestPath), { recursive: true });

  const previous = JSON.parse(await fs.readFile(manifestPath, "utf8").catch(() => "{}"));
  const manifest = {};
  const entries = (await fs.readdir(assetsDir, { withFileTypes: true }))
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort();

  for (const name of entries) {
    const ext = path.extname(name).toLowerCase();
    const isVideo = VIDEO_EXT.has(ext);
    if (!IMAGE_EXT.has(ext) && !isVideo) continue;

    const file = path.join(assetsDir, name);
    const base = path.basename(name, path.extname(name));
    const key = `/assets/${name}`;
    try {
      const hash = await hashFile(file);
      manifest[key] = isVideo
        ? await optimiseVideo(file, base, hash)
        : await optimiseImage(file, base, hash, previous[key]);
    } catch (error) {
      console.warn(`[assets] could not optimise ${name}: ${error.message}`);
    }
  }

  // Remove variants whose source was deleted or changed.
  const keep = new Set(
    Object.values(manifest).flatMap((m) => [
      ...(m.srcset || []).map(([, url]) => path.basename(url)),
      ...(m.video ? [path.basename(m.video), path.basename(m.poster)] : []),
    ]),
  );
  for (const name of await fs.readdir(outDir)) {
    if (!keep.has(name)) await fs.rm(path.join(outDir, name));
  }

  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`[assets] ${Object.keys(manifest).length} assets optimised`);
}

await main();
