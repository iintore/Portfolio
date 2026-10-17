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

export default defineConfig({
  plugins: [react(), robotsPerEnvironment()],
  server: { port: 5180 },
});
