import { readFileSync } from "node:fs";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

// Vercel sets VERCEL_ENV to "production" only for deploys of the production
// branch (main). Every other build (branch previews, staging, local) is kept
// out of search results so it never competes with tonylewismanzi.com.
function robotsPerEnvironment(): Plugin {
  const production = process.env.VERCEL_ENV === "production";
  return {
    name: "robots-per-environment",
    transformIndexHtml(html) {
      if (production) return html;
      return html.replace("</head>", '    <meta name="robots" content="noindex, nofollow" />\n  </head>');
    },
  };
}

// The hero photo is the largest thing painted on load, but React only creates
// its <img> after the app script runs. Preloading it from the HTML starts the
// download immediately, with the same AVIF srcset/sizes the <Media> uses.
function preloadHeroImage(): Plugin {
  return {
    name: "preload-hero-image",
    transformIndexHtml(html) {
      const manifest = JSON.parse(readFileSync(new URL("./src/generated/media.json", import.meta.url), "utf8"));
      const hero = manifest["hero-figure"];
      if (!hero) return html;
      const srcset = hero.sources.avif.map(([url, w]: [string, number]) => `${url} ${w}w`).join(", ");
      const tag = `<link rel="preload" as="image" type="image/avif" fetchpriority="high" imagesrcset="${srcset}" imagesizes="(min-width: 1200px) min(72vw, 1094px), 197vw" />`;
      return html.replace("</head>", `    ${tag}\n  </head>`);
    },
  };
}

export default defineConfig({
  plugins: [react(), robotsPerEnvironment(), preloadHeroImage()],
  server: { port: 5180 },
});
