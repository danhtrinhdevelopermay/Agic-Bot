#!/usr/bin/env node
const { execSync } = require('child_process');

console.log('Building client...');
execSync('npx vite build', { stdio: 'inherit' });

console.log('Building server...');
execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });

console.log('Build complete!');