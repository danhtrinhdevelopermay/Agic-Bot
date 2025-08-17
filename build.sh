#!/bin/bash
set -e

echo "Starting production build..."
export NODE_ENV=production

# Create dist directories
mkdir -p dist/public

# Build client with minimal config
echo "Building client..."
cat > vite-simple.config.js << 'EOF'
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
      "@": "./src",
      "@shared": "../shared",
      "@assets": "../attached_assets",
    },
  },
});
EOF

npx vite build --config vite-simple.config.js

# Clean up
rm vite-simple.config.js

# Build server
echo "Building server..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

echo "Build completed successfully!"