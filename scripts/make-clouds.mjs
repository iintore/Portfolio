// Procedural clouds, rendered as transparent PNGs (no photos involved).
//
// Two kinds:
//  • "wisp"    long, soft, streaky clouds (hero + project cards)
//  • "cumulus" puffy clouds made of rounded billows (section edges)
//
// Like the reference artwork, each cloud is a single flat colour (white, or a
// very light blue-white) and all of its shading lives in the alpha channel:
// where a cloud is thin or in its own shadow, more sky shows through, which is
// what reads as the soft blue-grey underside.
//
// Pipeline per cloud:
//  1. shape envelope: soft blobs (cumulus) or a peaked ridge (wisp)
//  2. density: puffy cellular + Perlin noise, carved by the envelope
//     (coverage remap) and eroded at the edges by fine noise for feathering
//  3. light: march from each pixel toward the sun (upper left) through the
//     density; the transmittance scales alpha, so sun-facing billow tops are
//     dense white and the far sides / bottoms let the sky through
//
// usage: node scripts/make-clouds.mjs
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = fileURLToPath(new URL("../public/decor/", import.meta.url));
mkdirSync(OUT, { recursive: true });

// ── seeded noise ───────────────────────────────────────────────────────────
function makeNoise(seed) {
  let s = seed >>> 0;
  const rand = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  const perm = new Uint8Array(512);
  const p = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  const G = [[1, 1], [-1, 1], [1, -1], [-1, -1], [1.4142, 0], [-1.4142, 0], [0, 1.4142], [0, -1.4142]];
  const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
  const perlin = (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y);
    const X = xi & 255, Y = yi & 255;
    const xf = x - xi, yf = y - yi;
    const u = fade(xf), v = fade(yf);
    const g = (h, dx, dy) => { const q = G[h & 7]; return q[0] * dx + q[1] * dy; };
    const aa = g(perm[perm[X] + Y], xf, yf), ba = g(perm[perm[X + 1] + Y], xf - 1, yf);
    const ab = g(perm[perm[X] + Y + 1], xf, yf - 1), bb = g(perm[perm[X + 1] + Y + 1], xf - 1, yf - 1);
    const x1 = aa + u * (ba - aa), x2 = ab + u * (bb - ab);
    return (x1 + v * (x2 - x1)) * 0.75;
  };
  // fbm remapped to ~[0, 1]
  const fbm = (x, y, oct = 6, lac = 2.03, gain = 0.5) => {
    let a = 0, amp = 0.5, f = 1, n = 0;
    for (let i = 0; i < oct; i++) { a += amp * perlin(x * f + i * 17.1, y * f - i * 9.3); n += amp; amp *= gain; f *= lac; }
    return a / n * 0.5 + 0.5;
  };
  // cellular (Worley F1) distance, ~[0, 1]
  const worley = (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y);
    let md = 9;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const cx = xi + dx, cy = yi + dy;
        const h = perm[(perm[cx & 255] + (cy & 255)) & 511];
        const fx = perm[(h + 71) & 511] / 256, fy = perm[(h + 151) & 511] / 256;
        const ddx = cx + fx - x, ddy = cy + fy - y;
        const d = ddx * ddx + ddy * ddy;
        if (d < md) md = d;
      }
    }
    return Math.min(1, Math.sqrt(md));
  };
  // inverted cellular fbm: round "puffs", ~[0, 1]
  const puffs = (x, y) =>
    (1 - worley(x, y)) * 0.625 + (1 - worley(x * 2.1 + 3.3, y * 2.1 - 1.7)) * 0.25 + (1 - worley(x * 4.3 - 7.1, y * 4.3 + 5.9)) * 0.125;
  return { perlin, fbm, worley, puffs, rand };
}

const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const smooth = (a, b, x) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
// remap x from [a, b] to [0, 1], clamped
const remap = (x, a, b) => clamp01((x - a) / (b - a));

// ── shape envelopes ────────────────────────────────────────────────────────
// Both kinds are a soft union of ellipses ("billows"); only the layout differs.
// Each entry is [cx, cy, r] in pixels.
function cumulusBlobs(W, H, c, N) {
  const blobs = [];
  // main body: a row of large billows along a flat base
  for (let i = 0; i < c.body; i++) {
    const t = i / (c.body - 1);
    const x = c.x0 + (c.x1 - c.x0) * t + (N.rand() - 0.5) * 0.05;
    const r = c.rBody * (0.8 + N.rand() * 0.4) * (0.75 + 0.25 * Math.sin(Math.PI * t));
    blobs.push([x * W, c.base * H - r * H * 0.6, r * H]);
  }
  // towers bulging up from the body
  for (const [tx, ty, tr] of c.towers) blobs.push([tx * W, ty * H, tr * H]);
  // detached fragments: small irregular clusters
  for (const [fx, fy, fr] of c.frags) {
    for (let k = 0; k < 6; k++) {
      const ang = N.rand() * Math.PI * 2, dist = fr * (0.4 + N.rand() * 0.9);
      blobs.push([(fx + Math.cos(ang) * dist * 1.8 * H / W) * W, (fy + Math.sin(ang) * dist * 0.45) * H, fr * H * (0.35 + N.rand() * 0.35), c.fragWeight]);
    }
  }
  return blobs;
}

function wispBlobs(W, H, c, N) {
  const blobs = [];
  for (let i = 0; i < c.blobs; i++) {
    const t = i / (c.blobs - 1);
    const u = c.x0 + (c.x1 - c.x0) * t + (N.rand() - 0.5) * 0.03;
    let k = 0;
    for (const [px, pw, ph] of c.peaks) k = Math.max(k, ph * Math.exp(-Math.abs(u - px) / pw));
    const r = (c.rMin + (c.rMax - c.rMin) * k) * (0.8 + N.rand() * 0.4);
    blobs.push([u * W, (c.base - r * c.lift) * H, r * H]);
  }
  return blobs;
}

function blobShape(blobs, H, c) {
  return (x, y) => {
    let e = 0;
    for (const [bx, by, br, bw = 1] of blobs) {
      const dx = (x - bx) / (br * c.stretch), dy = (y - by) / br;
      const d2 = dx * dx + dy * dy;
      if (d2 >= c.falloff * c.falloff) continue;
      const g = bw * smooth(c.falloff, 0.15, Math.sqrt(d2));
      e = e + g - e * g; // soft union
    }
    // flatter, softer bottom
    return e * smooth(c.base * H + c.baseSoft * H, c.base * H - c.baseSoft * H, y);
  };
}

// ── tone ───────────────────────────────────────────────────────────────────
// A smooth, monotone curve that maps raw opacity so that the opacities of the
// visible pixels follow a target histogram (10 bins of 0.1, percentages), the
// tonal balance measured from the reference artwork. Equal inputs always map to
// equal outputs, so no structure is invented; it only sets contrast/levels.
const VISIBLE = 0.02;
function toneCurve(A, tone) {
  const BINS = 4096;
  const hist = new Float64Array(BINS);
  let total = 0;
  for (const v of A) if (v > VISIBLE) { hist[Math.min(BINS - 1, Math.floor(((v - VISIBLE) / (1 - VISIBLE)) * BINS))]++; total++; }
  // cdf of the raw values
  const cdf = new Float64Array(BINS);
  let run = 0;
  for (let k = 0; k < BINS; k++) { run += hist[k]; cdf[k] = run / total; }
  // inverse cdf of the target (piecewise linear across its bins)
  const sum = tone.reduce((x, y) => x + y, 0);
  const edges = [VISIBLE, ...tone.map((_, k) => (k + 1) / 10)];
  const tcdf = [0];
  for (const t of tone) tcdf.push(tcdf[tcdf.length - 1] + t / sum);
  const inv = (q) => {
    for (let k = 1; k < tcdf.length; k++) {
      if (q <= tcdf[k] && tcdf[k] > tcdf[k - 1]) return edges[k - 1] + ((q - tcdf[k - 1]) / (tcdf[k] - tcdf[k - 1])) * (edges[k] - edges[k - 1]);
    }
    let k = tcdf.length - 1;
    while (k > 0 && tcdf[k] === tcdf[k - 1]) k--;
    return edges[k];
  };
  const map = new Float32Array(BINS);
  for (let k = 0; k < BINS; k++) map[k] = inv(cdf[k]);
  return (v) => {
    if (v <= VISIBLE) return v; // the faintest fringe passes through unchanged
    const f = ((v - VISIBLE) / (1 - VISIBLE)) * BINS;
    const k = Math.min(BINS - 1, Math.floor(f));
    return map[k];
  };
}

// ── renderer ───────────────────────────────────────────────────────────────
async function render(name, W, H, kind, c) {
  const N = makeNoise(c.seed);
  const shape = blobShape(kind === "wisp" ? wispBlobs(W, H, c, N) : cumulusBlobs(W, H, c, N), H, c);
  const D = new Float32Array(W * H);
  const sx = c.sx ?? 1; // horizontal noise squash (wisps streak sideways)
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let px = (x / H) * c.scale * sx, py = (y / H) * c.scale;
      // domain warp for natural, swirling forms (also bends the outline)
      const wx = N.fbm(px * 0.5 + 5.2, py * 0.5 + 1.3, 4) - 0.5;
      const wy = N.fbm(px * 0.5 - 8.7, py * 0.5 + 2.8, 4) - 0.5;
      const e = shape(x + wx * c.shapeWarp * H, y + wy * c.shapeWarp * H);
      if (e <= 0.002) continue;
      px += wx * c.warp;
      py += wy * c.warp;
      const pf = N.fbm(px, py, 6);
      const pw = N.puffs(px * 0.9, py * 0.9);
      const base = pf * (1 - c.puff) + pw * c.puff;
      // coverage remap: the envelope decides how much of the noise survives
      const cov = e * c.coverage;
      let d = remap(base, 1 - cov, 1 - cov + c.range);
      // faint vapour around the billows (the soft low-alpha margin)
      d = Math.max(d, e * c.haze * pf);
      if (d <= 0) continue;
      // edge erosion with fine noise → feathery, broken margins
      const det = N.fbm(px * c.detail, py * c.detail, 4);
      d = remap(d, det * c.erode * (1 - d), 1);
      D[y * W + x] = d;
    }
  }
  // light march toward the sun
  const len = Math.hypot(c.sun[0], c.sun[1]);
  const ux = c.sun[0] / len, uy = c.sun[1] / len;
  const steps = 28, reach = c.reach * H, ds = reach / steps;
  const A = new Float32Array(W * H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      const d = D[i];
      if (d <= 0.001) continue;
      let acc = 0;
      for (let k = 1; k <= steps; k++) {
        const qx = Math.round(x + ux * ds * k), qy = Math.round(y + uy * ds * k);
        if (qx < 0 || qy < 0 || qx >= W || qy >= H) break;
        acc += D[qy * W + qx];
      }
      acc *= ds / H;
      // beer–lambert with a multiple-scattering floor so interiors never go flat grey
      const T = Math.max(Math.exp(-c.absorb * acc), c.msFloor * Math.exp(-c.absorb * 0.25 * acc));
      const thick = 1 - Math.exp(-d * c.density);
      A[i] = thick * (c.shadow + (1 - c.shadow) * T);
    }
  }
  const curve = toneCurve(A, c.tone);
  const px = Buffer.alloc(W * H * 4);
  for (let i = 0; i < W * H; i++) {
    const o = i * 4;
    px[o] = c.color[0];
    px[o + 1] = c.color[1];
    px[o + 2] = c.color[2];
    px[o + 3] = Math.round(255 * curve(A[i]));
  }
  let img = sharp(px, { raw: { width: W, height: H, channels: 4 } });
  if (c.soften > 0.3) img = img.blur(c.soften);
  await img.png({ compressionLevel: 9 }).toFile(join(OUT, name));
  console.log("wrote", name, `${W}x${H}`);
}

const SUN = [-0.5, -0.86];

// hero / card wisps (blue-white, like the reference)
const wisp = {
  color: [239, 243, 255], sun: SUN, scale: 4, sx: 0.5, warp: 1.2, shapeWarp: 0.14, puff: 0.45, coverage: 1, range: 0.75,
  haze: 0.3, detail: 5, erode: 0.6, density: 1.8, reach: 0.16, absorb: 7, msFloor: 0.45, shadow: 0.35,
  tone: [15, 13, 12, 10, 10, 11, 7, 9, 9, 5],
  blobs: 20, stretch: 1.8, falloff: 1.55, lift: 0.9, baseSoft: 0.14, soften: 2.4,
};
await render("cloud-a.png", 2048, 788, "wisp", {
  ...wisp, seed: 7, x0: 0.07, x1: 0.93, base: 0.76, rMin: 0.08, rMax: 0.48,
  peaks: [[0.36, 0.1, 1], [0.58, 0.14, 0.55], [0.82, 0.08, 0.3]],
});
await render("cloud-b.png", 2048, 1008, "wisp", {
  ...wisp, seed: 31, x0: 0.08, x1: 0.93, base: 0.8, rMin: 0.06, rMax: 0.4,
  tone: [20, 20, 18, 16, 15, 12, 0, 0, 0, 0],
  peaks: [[0.62, 0.1, 1], [0.42, 0.14, 0.6], [0.2, 0.1, 0.3]],
});

// section-edge cumulus (white)
const cumulus = {
  color: [255, 255, 255], sun: SUN, scale: 5.4, warp: 0.7, shapeWarp: 0.12, puff: 0.62, coverage: 1.0, range: 0.7,
  haze: 0.15, detail: 7, erode: 0.8, density: 1.8, reach: 0.18, absorb: 9, msFloor: 0.45, shadow: 0.3, fragWeight: 0.66,
  tone: [13, 9, 8, 11, 15, 13, 11, 9, 8, 3],
  body: 7, x0: 0.13, x1: 0.87, rBody: 0.26, stretch: 1.3, falloff: 1.6, base: 0.88, baseSoft: 0.1, soften: 0.45,
};
await render("cloud-left.png", 1024, 558, "cumulus", {
  ...cumulus, seed: 41,
  towers: [[0.27, 0.5, 0.2], [0.44, 0.45, 0.17], [0.66, 0.49, 0.19], [0.85, 0.56, 0.15], [0.12, 0.62, 0.14]],
  frags: [[0.6, 0.16, 0.13], [0.26, 0.24, 0.1]],
});
await render("cloud-right.png", 1024, 558, "cumulus", {
  ...cumulus, seed: 97,
  towers: [[0.24, 0.54, 0.19], [0.47, 0.48, 0.17], [0.66, 0.43, 0.2], [0.84, 0.52, 0.16]],
  frags: [[0.34, 0.18, 0.12], [0.82, 0.2, 0.08]],
});
