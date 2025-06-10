
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/zonebud-guardian-system-63cc8422/",
  server: {
    port: 8080
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      filename: "sw.js",
      strategies: "generateSW",
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./,
            handler: 'CacheFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          }
        ]
      },
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
        description: "Zonebud Guardian System PWA - Secure and monitor your zones",
        start_url: "/zonebud-guardian-system-63cc8422/",
        scope: "/zonebud-guardian-system-63cc8422/",
        display: "standalone",
        orientation: "any",
        background_color: "#ffffff",
        theme_color: "#E87070",
        categories: ["utilities", "productivity", "security"],
        icons: [
          {
            src: "/zonebud-guardian-system-63cc8422/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable"
          },
          {
            src: "/zonebud-guardian-system-63cc8422/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
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
