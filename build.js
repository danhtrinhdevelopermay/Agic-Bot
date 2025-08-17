const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting production build...');

// Temporary disable problematic plugins by setting production flag
process.env.NODE_ENV = 'production';

try {
  // Build client
  console.log('Building client...');
  execSync('npx vite build', { 
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