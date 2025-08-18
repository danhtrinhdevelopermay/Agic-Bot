const { execSync } = require('child_process');
const fs = require('fs');

console.log('Starting production build...');

try {
  // Ensure all dependencies including devDependencies are installed
  console.log('Installing all dependencies including dev dependencies...');
  execSync('npm install --include=dev', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });

  // Create dist directories
  if (!fs.existsSync('dist')) fs.mkdirSync('dist');
  if (!fs.existsSync('dist/public')) fs.mkdirSync('dist/public');

  // Build client - set NODE_ENV for build only
  console.log('Building client...');
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