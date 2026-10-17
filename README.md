# Tony Lewis — Portfolio (redesign)

Vite + React + TypeScript, animated with framer-motion and Lenis smooth scroll.

## Scripts

| command | what it does |
| --- | --- |
| `npm run dev` | local dev server |
| `npm run build` | type-check and production build to `dist/` |
| `npm run preview` | serve the production build locally |
| `npm run assets` | regenerate decor (sky gradients, grain, placeholders) and the procedural clouds |
| `npm run clouds` | regenerate only the procedural clouds |
| `npm run media` | optimise every original in `media/` (see below) |
| `npm run social` | rebuild the 1200 × 630 share image `public/og.jpg` |

## Images

Put originals (any size, JPG/PNG/WebP/AVIF/TIFF) in `media/` and run `npm run media`. Each one is encoded to AVIF and WebP at 480–2560px wide (never upscaled), with content-hashed file names in `public/media/` and an entry in `src/generated/media.json`. Render it with:

```tsx
<Media name="my-photo" sizes="(min-width: 1200px) 50vw, 100vw" alt="What the photo shows" />
```

`<Media>` serves AVIF → WebP at the size the screen needs, reserves the image's space (no layout jump), lazy-loads below the fold and shows a blurred preview for opaque images. Add `priority` only for images visible on first load. Commit the outputs; deploys never re-encode.

## Environments

- **Production**: `main` → tonylewismanzi.com
- **Redesign (testing)**: `redesign` → Vercel preview deployment for this branch

Builds that are not production (`VERCEL_ENV !== "production"`) are marked `noindex`, so previews never compete with the live site in search results. Branch previews are also behind Vercel sign-in.

## SEO

`index.html` carries the description, canonical URL, Open Graph / X card tags (with `public/og.jpg`) and Person structured data; `src/lib/pageMeta.ts` sets the per-page title, description and canonical URL. `public/robots.txt` and `public/sitemap.xml` point at tonylewismanzi.com.

## Pages

- `/` home
- `/case-study` project case study
- `/resume` resume

Copy and images live in `src/content.ts`; placeholders are marked as such until real content replaces them.
