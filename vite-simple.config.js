import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: "./client",
  build: {
    outDir: "../dist/public",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": "/opt/render/project/src/client/src",
      "@shared": "/opt/render/project/src/shared",
      "@assets": "/opt/render/project/src/attached_assets",
    },
  },
});
