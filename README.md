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

## Environments

- **Production**: `main` → tonylewismanzi.com
- **Redesign (testing)**: `redesign` → Vercel preview deployment for this branch

Builds that are not production (`VERCEL_ENV !== "production"`) are marked `noindex`, so previews never compete with the live site in search results.

## Pages

- `/` home
- `/case-study` project case study
- `/resume` resume

Copy and images live in `src/content.ts`; placeholders are marked as such until real content replaces them.
