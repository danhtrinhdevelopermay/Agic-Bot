const { execSync } = require('child_process');

console.log('Starting production build...');

// Set production environment
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