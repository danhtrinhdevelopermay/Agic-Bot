const { execSync } = require('child_process');
const fs = require('fs');

console.log('Starting production build...');
process.env.NODE_ENV = 'production';

try {
  // Create dist directories
  if (!fs.existsSync('dist')) fs.mkdirSync('dist');
  if (!fs.existsSync('dist/public')) fs.mkdirSync('dist/public');

  // Use the existing vite config but ensure production mode
  console.log('Building client with existing vite config...');
  execSync('npx vite build', { 
    stdio: 'inherit',
    cwd: process.cwd(),
    env: { ...process.env, NODE_ENV: 'production' }
  });

  console.log('Building server...');
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { 
    stdio: 'inherit' 
  });

  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}