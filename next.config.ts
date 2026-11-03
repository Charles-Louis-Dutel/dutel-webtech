import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Export statique : le site est servi tel quel par Cloudflare Pages,
  // sans serveur Node.js.
  output: "export",
  images: {
    // Pas d'optimisation d'images à la volée en export statique.
    unoptimized: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
