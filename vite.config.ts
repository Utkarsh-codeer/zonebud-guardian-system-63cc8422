import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/zonebud-guardian-system-63cc8422/", // ✅ required for GitHub Pages
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      filename: "sw.js", // ✅ generates sw.js at root
      strategies: "generateSW", // ✅ pre-cache static assets
      includeAssets: [
        "icon-192.png",
        "icon-512.png",
        "favicon.ico",
        "apple-touch-icon.png",
        "robots.txt"
      ],
      manifest: {
        name: "Zonebud Guardian System",
        short_name: "Zonebud",
        description: "Zonebud Guardian System PWA",
        start_url: "/zonebud-guardian-system-63cc8422/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#f86e6e",
        icons: [
          {
            src: "/zonebud-guardian-system-63cc8422/icon-192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/zonebud-guardian-system-63cc8422/icon-512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
});
