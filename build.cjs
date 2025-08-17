const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting production build...');

// Set production environment
process.env.NODE_ENV = 'production';

try {
  // Create a temporary minimal vite config for production
  const tempViteConfig = `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  root: './client',
  build: {
    outDir: '../dist/public',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': resolve('./client/src'),
      '@assets': resolve('./attached_assets'),
    }
  }
});
`;
  
  fs.writeFileSync('vite.config.render.js', tempViteConfig);
  
  // Build client with temporary config
  console.log('Building client...');
  execSync('npx vite build --config vite.config.render.js', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });

  // Clean up temp config
  fs.unlinkSync('vite.config.render.js');

  // Build server
  console.log('Building server...');
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { 
    stdio: 'inherit' 
  });

  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  if (fs.existsSync('vite.config.render.js')) {
    fs.unlinkSync('vite.config.render.js');
  }
  process.exit(1);
}