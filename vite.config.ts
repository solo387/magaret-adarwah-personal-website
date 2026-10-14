import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { powerApps } from "@microsoft/power-apps-vite/plugin"

const localApiTarget = `http://127.0.0.1:${process.env.SITE_SCAN_PORT ?? "4174"}`

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), powerApps()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      "/api": localApiTarget,
    },
  },
  preview: {
    port: 4173,
    strictPort: true,
    proxy: {
      "/api": localApiTarget,
    },
  },
});
