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

  // Build client using root vite config with emptyOutDir
  console.log('Building client...');
  execSync('npx vite build --emptyOutDir', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });

  // Build server
  console.log('Building server...');
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { 
    stdio: 'inherit' 
  });

  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}