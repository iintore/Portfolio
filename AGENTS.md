# Prototype Instructions

Run the local server yourself and open the preview in the in-app browser. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## Design Decisions
- **Project Cards Layout**: Changed project cards from portrait/squarish to a clean landscape rectangular aspect ratio (`3:2` or `1.5/1` aspect-ratio on `.project-image`). Removed the card's internal padding and double border-shadow framing ("MacOS generator thumbnail" frame style) so that the thumbnail image spans edge-to-edge. Implemented a subtle `img` scale-up zoom hover transition instead of container scaling to keep the edge-to-edge boundary intact.
- **Scroll Reveal & Staggered Animations**: Added scroll-driven reveals using an `IntersectionObserver` React hook (`useScrollReveal`). Handled progressive enhancement by querying `.reveal-on-scroll` elements and adding `.in-view` when they enter the viewport. Staggered elements like project cards, process cards, experience rows, and services dynamically using the `--stagger-delay` CSS custom property.
- **Experience List Interaction**: Designed a premium hover state on `.experience-row` that slides text rightward (`padding-left: 28px`) and scales in a vertical accent bar on the left.
- **FAQ Accordion**: Upgraded the FAQ layout from a static max-height transition to a modern CSS grid fraction transition (`grid-template-rows: 0fr` to `1fr`), resolving content cropping and improving toggle responsiveness.
- **Parallax Image Bleed**: Changed `.project-image img` to have a vertical bleed height (`calc(100% + 40px)`) and relative positioning (`top: -20px`) to prevent background gaps during dynamic scroll translations.


- **Asset Optimisation**: The stack is Vite + React (not Next.js), so `scripts/optimize-assets.mjs` plays the role of `next/image`: it runs before `dev`/`build`, writes content-hashed WebP sizes (and H.264 MP4 + poster for GIF/MP4) to `public/assets/_opt`, and records them in `src/generated/asset-manifest.json`. Render site images with `<Img sizes=...>` (srcset, lazy, blur-up, intrinsic size) and loops with `<LazyVideo>`, never a raw `<img>`/`<video>`. `_opt` files are cached immutable on Vercel. Commit `_opt` and the manifest so deploys don't re-encode.
- **Process Stacking Cards**: Process steps sit at the normal 20px gap (no extra scroll spacing; the user found large gaps too long) and are sticky (`top: 110px + index * 8px`), so each card slides straight over the previous one like the reference recording. Covered cards scale down slightly and fade toward white via `--stack-scale`/`--stack-dim` set by `useStackedCards`.
- **Personal Tools Section**: Sits directly under My Projects as a compact row list (reference: design-system directory list), not image cards, because many apps will be listed. Each row: 40px round logo, name + muted tagline, small monospace one-line description, link labels on the right, and an arrow. Add apps to the `tools` array in `App.jsx` with the logo saved as `public/assets/tool-<name>-logo.svg`.
