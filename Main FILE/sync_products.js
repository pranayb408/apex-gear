const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Paths
const productsTsPath = path.join(__dirname, '..', 'frontend', 'src', 'data', 'products.ts');
const pythonScriptPath = path.join(__dirname, 'rewrite_shop_pages.py');

console.log('Reading products.ts...');
if (!fs.existsSync(productsTsPath)) {
  console.error(`Error: Products data file not found at ${productsTsPath}`);
  process.exit(1);
}

let content = fs.readFileSync(productsTsPath, 'utf8');

// Strip TypeScript interfaces and types to leave pure executable JavaScript
content = content.replace(/export\s+interface\s+\w+\s*\{[\s\S]*?\}/g, '');
content = content.replace(/export\s+const\s+products:\s+Product\[\]\s*=\s*/, 'const products = ');

// Evaluate the stripped JavaScript to load the products array
let products = [];
try {
  const evalCode = content + '\nmodule.exports = products;';
  const tempPath = path.join(__dirname, 'temp_products.js');
  fs.writeFileSync(tempPath, evalCode, 'utf8');

  // Require and cache-bust the temp file
  products = require(tempPath);
  fs.unlinkSync(tempPath);
  delete require.cache[require.resolve(tempPath)];
} catch (err) {
  console.error('Failed to parse products.ts:', err);
  process.exit(1);
}

console.log(`Parsed ${products.length} products successfully.`);

const shoes = [];
const watches = [];
const clothes = [];
const specs = [];

products.forEach(p => {
  const item = {
    name: p.name,
    price: p.origPrice || p.price,
    offer: p.price,
    badge: p.badge || '',
    img: p.imgs && p.imgs.length > 0 ? p.imgs[0] : ''
  };

  if (p.category === 'shoes') {
    shoes.push(item);
  } else if (p.category === 'watches') {
    watches.push(item); // Maps to watch_defaults
  } else if (p.category === 'clothes') {
    clothes.push(item); // Maps to cloth_defaults
  } else if (p.category === 'specs') {
    specs.push(item); // Maps to specs_defaults
  }
});

console.log(`Mapped counts:
  - Shoes: ${shoes.length}
  - Watches: ${watches.length}
  - Clothes: ${clothes.length}
  - Specs: ${specs.length}`);

// Read and update rewrite_shop_pages.py
if (!fs.existsSync(pythonScriptPath)) {
  console.error(`Error: rewrite_shop_pages.py not found at ${pythonScriptPath}`);
  process.exit(1);
}

let pyContent = fs.readFileSync(pythonScriptPath, 'utf8');

// Replace lists
pyContent = pyContent.replace(/shoes_defaults\s*=\s*\[[\s\S]*?\]/, `shoes_defaults = ${JSON.stringify(shoes, null, 2)}`);
pyContent = pyContent.replace(/cloth_defaults\s*=\s*\[[\s\S]*?\]/, `cloth_defaults = ${JSON.stringify(clothes, null, 2)}`);
pyContent = pyContent.replace(/specs_defaults\s*=\s*\[[\s\S]*?\]/, `specs_defaults = ${JSON.stringify(specs, null, 2)}`);
pyContent = pyContent.replace(/watch_defaults\s*=\s*\[[\s\S]*?\]/, `watch_defaults = ${JSON.stringify(watches, null, 2)}`);

fs.writeFileSync(pythonScriptPath, pyContent, 'utf8');
console.log('Successfully updated rewrite_shop_pages.py with synced product definitions.');

// Run Python script to rebuild static pages
console.log('Running rewrite_shop_pages.py to rebuild static pages...');
try {
  execSync('python rewrite_shop_pages.py', { stdio: 'inherit' });
  console.log('Static shop pages regenerated.');
} catch (err) {
  console.error('Failed to run rewrite_shop_pages.py:', err);
  process.exit(1);
}

// Copy static site files to nextjs public folder for deployment parity
console.log('Copying static assets to Next.js public directory...');
const filesToCopy = [
  'shoes.html',
  'cloth.html',
  'specs.html',
  'watch.html',
  'index.html',
  'style.css',
  'main.js',
  'seller-dashboard.html',
  'seller-login.html',
  'seller-register.html',
  'login.html',
  'register.html',
  'admin.html',
  'clothes.png',
  'shoes.png',
  'specs.png',
  'watch.png',
  'story_video.mp4',
  'videoframe_1589.png'
];

const publicDir = path.join(__dirname, '..', 'frontend', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

let copiedCount = 0;
filesToCopy.forEach(file => {
  const src = path.join(__dirname, file);
  const dest = path.join(publicDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    copiedCount++;
  } else {
    console.warn(`Warning: Source file ${file} not found.`);
  }
});

console.log(`Copied ${copiedCount} files to frontend/public/ successfully.`);
console.log('Product catalog synchronization complete!');
