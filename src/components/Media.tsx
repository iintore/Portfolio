import type { CSSProperties } from "react";
import manifest from "../generated/media.json";

// Responsive image from the media pipeline (scripts/optimize-images.mjs).
// Serves AVIF, then WebP, at the width the browser needs for `sizes`; keeps the
// intrinsic width/height so the space is reserved before the file arrives;
// lazy-loads unless `priority` (use priority only for above-the-fold images).
type Entry = {
  width: number;
  height: number;
  alpha: boolean;
  sources: { avif: [string, number][]; webp: [string, number][] };
  blur: string | null;
};
const MEDIA = manifest as unknown as Record<string, Entry>;

export function Media({
  name,
  sizes,
  alt = "",
  priority = false,
  className,
  style,
}: {
  name: string;
  sizes: string;
  alt?: string;
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const m = MEDIA[name];
  if (!m) {
    if (import.meta.env.DEV) console.warn(`<Media>: "${name}" is not in src/generated/media.json — run npm run media`);
    return null;
  }
  const set = (list: [string, number][]) => list.map(([url, w]) => `${url} ${w}w`).join(", ");
  const fallback = m.sources.webp[m.sources.webp.length - 1][0];
  const placeholder: CSSProperties = m.blur ? { backgroundImage: `url(${m.blur})`, backgroundSize: "cover", backgroundPosition: "center" } : {};
  return (
    <picture className="media">
      <source type="image/avif" srcSet={set(m.sources.avif)} sizes={sizes} />
      <source type="image/webp" srcSet={set(m.sources.webp)} sizes={sizes} />
      <img
        className={className}
        src={fallback}
        width={m.width}
        height={m.height}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        // React 18 only knows the lowercase HTML attribute
        {...({ fetchpriority: priority ? "high" : "auto" } as Record<string, string>)}
        style={{ ...placeholder, ...style }}
      />
    </picture>
  );
}
