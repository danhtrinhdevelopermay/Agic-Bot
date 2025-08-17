const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting production build...');

// Set production environment
process.env.NODE_ENV = 'production';

try {
  // Create dist directories
  if (!fs.existsSync('dist')) fs.mkdirSync('dist');
  if (!fs.existsSync('dist/public')) fs.mkdirSync('dist/public');

  // Create a simple vite config that Render can find
  const simpleViteConfig = `
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "client", "src"),
      "@shared": path.resolve(process.cwd(), "shared"),
      "@assets": path.resolve(process.cwd(), "attached_assets"),
    },
  },
  root: path.resolve(process.cwd(), "client"),
  build: {
    outDir: path.resolve(process.cwd(), "dist/public"),
    emptyOutDir: true,
  },
});
`;

  // Write simple config
  fs.writeFileSync('./render-vite.config.js', simpleViteConfig);

  // Build client with simple config
  console.log('Building client...');
  execSync('npx vite build --config render-vite.config.js', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });

  // Clean up
  fs.unlinkSync('./render-vite.config.js');

  // Build server
  console.log('Building server...');
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { 
    stdio: 'inherit' 
  });

  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  if (fs.existsSync('./render-vite.config.js')) {
    fs.unlinkSync('./render-vite.config.js');
  }
  process.exit(1);
}