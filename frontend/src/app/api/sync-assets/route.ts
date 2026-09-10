import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const brainDir = 'C:\\Users\\Lenovo\\.gemini\\antigravity-ide\\brain\\a633f789-83bc-4ae0-9b14-aafe7d0280dc\\.user_uploaded';
const rootDir = path.resolve(process.cwd(), '..');
const publicDir = path.join(process.cwd(), 'public');
const mainFileDir = path.join(rootDir, 'Main FILE');

const targets = [
  publicDir,
  mainFileDir,
  rootDir
];

const filesToCopy = [
  { src: 'media_1788980570979.jpg', dest: 'baggy-jeans.jpg' },
  { src: 'media_1788980611491.png', dest: 'cotton-linen-shirt.png' },
  { src: 'media_1788980673830.png', dest: 'gshock-pokemon.png' },
  { src: 'media_1788980705433.png', dest: 'gravitymaster-gwr.png' },
  { src: 'media_1788984117986.png', dest: 'clothing-models.png' }
];

const NIKE_SHOES = [
  {
    id: 1000,
    name: "Air Jordan 1 Low",
    category: "sneaker",
    subCat: "sneaker",
    price: 8995,
    offer: 8995,
    badge: "HOT",
    badgeClass: "pdm-badge--hot",
    img: "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/4/2/42d1084Nike-FD2596-601_1.jpg?rnd=20200526195200&tr=w-720",
    rating: "4.9",
    reviews: 428,
    desc: "Inspired by the original that debuted in 1985, the Air Jordan 1 Low offers a clean, classic look that's familiar yet always fresh. With an iconic design that pairs perfectly with any fit, these kicks ensure you'll always be on point.",
    features: [
      "Encapsulated Air-Sole unit provides lightweight cushioning",
      "Genuine leather upper offers durability and a premium look",
      "Solid rubber outsole enhances traction on a variety of surfaces",
      "Perforated toe for breathability"
    ],
    sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
    unavail: ["UK 11"],
    colors: [{ c: "#a11d33", n: "Gym Red / White" }, { c: "#111", n: "Black" }, { c: "#fff", n: "White", border: true }],
    imgs: [
      "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/4/2/42d1084Nike-FD2596-601_1.jpg?rnd=20200526195200&tr=w-720",
      "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/4/2/42d1084Nike-FD2596-601_2.jpg?rnd=20200526195200&tr=w-720",
      "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/4/2/42d1084Nike-FD2596-601_3.jpg?rnd=20200526195200&tr=w-720"
    ]
  },
  {
    id: 1001,
    name: "Air Jordan 1 Low SE",
    category: "sneaker",
    subCat: "sneaker",
    price: 11495,
    offer: 11495,
    badge: "NEW",
    badgeClass: "pdm-badge--new",
    img: "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/7/1/71f6d8eNike-IO2047-001_1.jpg?rnd=20200526195200&tr=w-1536",
    rating: "4.8",
    reviews: 295,
    desc: "New colors and fresh textures give you an updated AJ1 without losing that iconic silhouette and familiar feel. Made from premium materials and pumped with comfortable Air cushioning, subtle details deliver an everyday staple sneaker.",
    features: [
      "Premium leather and suede construction",
      "Encapsulated Nike Air-Sole unit in the heel",
      "Embroidered Wings logo on the heel",
      "Stitched-down Swoosh logo"
    ],
    sizes: ["UK 7", "UK 8", "UK 8.5", "UK 9", "UK 10", "UK 11"],
    unavail: ["UK 8.5"],
    colors: [{ c: "#232323", n: "Off-Noir / Industrial Blue" }, { c: "#d9d2c9", n: "Sail / Grey" }, { c: "#111", n: "Black" }],
    imgs: [
      "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/7/1/71f6d8eNike-IO2047-001_1.jpg?rnd=20200526195200&tr=w-1536",
      "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/7/1/71f6d8eNike-IO2047-001_2.jpg?rnd=20200526195200&tr=w-1536",
      "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/7/1/71f6d8eNike-IO2047-001_3.jpg?rnd=20200526195200&tr=w-1536"
    ]
  },
  {
    id: 1002,
    name: "Nike Vomero 18",
    category: "sneaker",
    subCat: "sneaker",
    price: 12495,
    offer: 10636,
    badge: "SALE",
    badgeClass: "pdm-badge--sale",
    img: "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/a/d/ad22b92Nike-HM6803-111_1.jpg?rnd=20200526195200&tr=w-1536",
    rating: "4.9",
    reviews: 382,
    desc: "Step into luxury with the Nike Vomero 18 Men's Road Running Shoes. Engineered with maximum stack height, ultra-responsive ZoomX foam stacked atop ReactX foam for smooth, cushioned strides kilometer after kilometer.",
    features: [
      "Dual-density midsole combining ZoomX and ReactX foam",
      "Engineered mesh upper for breathable containment",
      "High-abrasion rubber outsole with waffle lugs for durable traction",
      "Padded collar and plush tongue for maximum step-in comfort"
    ],
    sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
    unavail: [],
    colors: [{ c: "#fff", n: "White / Electric Green", border: true }, { c: "#111", n: "Black / Anthracite" }],
    imgs: [
      "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/a/d/ad22b92Nike-HM6803-111_1.jpg?rnd=20200526195200&tr=w-1536",
      "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/a/d/ad22b92Nike-HM6803-111_2.jpg?rnd=20200526195200&tr=w-1536"
    ]
  },
  {
    id: 1003,
    name: "Nike Vomero 18 (Women's)",
    category: "sneaker",
    subCat: "sneaker",
    price: 13295,
    offer: 13295,
    badge: "NEW",
    badgeClass: "pdm-badge--new",
    img: "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/a/d/ad22b92Nike-HM6804-004_1.jpg?rnd=20200526195200&tr=w-1536",
    rating: "4.9",
    reviews: 214,
    desc: "The Nike Vomero 18 Women's Road Running Shoes delivers our softest, most energized run yet. Redesigned geometry and premier cushioning give you ultra-plush comfort from your morning miles to marathon training.",
    features: [
      "Maximal cushioning tailored for smooth transitions",
      "ZoomX foam cushioning delivers highest energy return",
      "Lightweight engineered mesh upper hugs the foot securely",
      "Durable rubber outsole with multi-directional grip"
    ],
    sizes: ["UK 4", "UK 5", "UK 6", "UK 7", "UK 8"],
    unavail: ["UK 4"],
    colors: [{ c: "#7a8b99", n: "Dusty Blue / Platinum" }, { c: "#f4c2c2", n: "Pale Ivory / Pink" }],
    imgs: [
      "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/a/d/ad22b92Nike-HM6804-004_1.jpg?rnd=20200526195200&tr=w-1536",
      "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/a/d/ad22b92Nike-HM6804-004_2.jpg?rnd=20200526195200&tr=w-1536"
    ]
  },
  {
    id: 1004,
    name: "Nike Air Force 1 '07 Essential",
    category: "sneaker",
    subCat: "sneaker",
    price: 8495,
    offer: 8495,
    badge: "HOT",
    badgeClass: "pdm-badge--hot",
    img: "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/a/d/ad22b92Nike-CZ0270-102_1.jpg?rnd=20200526195200&tr=w-720",
    rating: "4.8",
    reviews: 512,
    desc: "The radiance lives on in the Nike Air Force 1 '07 Essential. Crossing hardwood comfort with off-court flair, this hoops original pairs crisp leather with iridescent metallic detailing for effortless style.",
    features: [
      "Stitched leather overlays on the upper add heritage style, durability and support",
      "Originally designed for performance hoops, Nike Air cushioning adds lightweight, all-day comfort",
      "Low-cut silhouette adds a clean, streamlined look",
      "Padded collar feels soft and comfortable"
    ],
    sizes: ["UK 3", "UK 4", "UK 5", "UK 6", "UK 7"],
    unavail: [],
    colors: [{ c: "#fff", n: "White / Metallic Gold", border: true }, { c: "#000", n: "Black / Gold" }],
    imgs: [
      "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/a/d/ad22b92Nike-CZ0270-102_1.jpg?rnd=20200526195200&tr=w-720",
      "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/a/d/ad22b92Nike-CZ0270-102_2.jpg?rnd=20200526195200&tr=w-720"
    ]
  },
  {
    id: 1005,
    name: "Nike Air Force 1 Older Kids (Black/White)",
    category: "sneaker",
    subCat: "sneaker",
    price: 7295,
    offer: 7295,
    badge: "SALE",
    badgeClass: "pdm-badge--sale",
    img: "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/a/d/ad22b92Nike-IR0595-001_1.jpg?rnd=20200526195200&tr=w-1536",
    rating: "4.7",
    reviews: 198,
    desc: "Classic style for the next generation. The Nike Air Force 1 brings basketball heritage to kids with durable real and synthetic leather, plus the legendary Air-Sole cushioning that made it famous.",
    features: [
      "Real and synthetic leather are durable and easy to clean",
      "Hidden Air-Sole unit delivers classic lightweight cushioning",
      "Rubber sole with iconic pivot circle tread for durable grip",
      "Padded ankle collar for snug support"
    ],
    sizes: ["UK 3", "UK 4", "UK 4.5", "UK 5", "UK 5.5", "UK 6"],
    unavail: ["UK 4.5"],
    colors: [{ c: "#222", n: "Black / White" }, { c: "#fff", n: "Triple White", border: true }],
    imgs: [
      "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/a/d/ad22b92Nike-IR0595-001_1.jpg?rnd=20200526195200&tr=w-1536",
      "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/a/d/ad22b92Nike-IR0595-001_2.jpg?rnd=20200526195200&tr=w-1536"
    ]
  },
  {
    id: 1006,
    name: "Nike Air Force 1 Older Kids (Grey/Gum)",
    category: "sneaker",
    subCat: "sneaker",
    price: 7295,
    offer: 7295,
    badge: "NEW",
    badgeClass: "pdm-badge--new",
    img: "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/a/d/ad22b92Nike-IR0595-002_1.jpg?rnd=20200526195200&tr=w-1536",
    rating: "4.8",
    reviews: 164,
    desc: "An icon of playground style, the Nike Air Force 1 delivers retro basketball vibes with modern comfort. Built with tough materials and all-day Air cushioning designed for active youth.",
    features: [
      "Premium leather and suede overlays",
      "Non-marking gum rubber outsole for traction",
      "Padded low-cut collar looks sleek and feels comfortable",
      "Cupsole construction for heritage AF1 look"
    ],
    sizes: ["UK 3", "UK 4", "UK 4.5", "UK 5", "UK 5.5", "UK 6"],
    unavail: [],
    colors: [{ c: "#7d7d7d", n: "Smoke Grey / Gum" }, { c: "#fff", n: "Summit White", border: true }],
    imgs: [
      "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/a/d/ad22b92Nike-IR0595-002_1.jpg?rnd=20200526195200&tr=w-1536",
      "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/a/d/ad22b92Nike-IR0595-002_2.jpg?rnd=20200526195200&tr=w-1536"
    ]
  },
  {
    id: 1007,
    name: "Nike Air Force 1 '07 LX",
    category: "sneaker",
    subCat: "sneaker",
    price: 10795,
    offer: 10795,
    badge: "HOT",
    badgeClass: "pdm-badge--hot",
    img: "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/a/d/ad22b92Nike-FV3654-111_1.jpg?rnd=20200526195200&tr=w-1536",
    rating: "4.9",
    reviews: 341,
    desc: "The Nike Air Force 1 '07 LX elevates the timeless b-ball silhouette with refined craft, premium distressed leather textures, and subtle luxury details for a statement look.",
    features: [
      "Luxe tumbled leather upper with premium edge finishing",
      "Encapsulated Nike Air unit for legendary shock absorption",
      "Perforations on toe box for cool comfort",
      "Pivot-ring rubber outsole for heritage traction"
    ],
    sizes: ["UK 3", "UK 4", "UK 5", "UK 6", "UK 7", "UK 7.5"],
    unavail: ["UK 7.5"],
    colors: [{ c: "#faf6f0", n: "Coconut Milk / Sail", border: true }, { c: "#222", n: "Vintage Black" }],
    imgs: [
      "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/a/d/ad22b92Nike-FV3654-111_1.jpg?rnd=20200526195200&tr=w-1536",
      "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/a/d/ad22b92Nike-FV3654-111_2.jpg?rnd=20200526195200&tr=w-1536"
    ]
  }
];

function formatMRP(n: number) {
  return 'Rs. ' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' INR';
}

function updateMegaMenus(html: string): string {
  // Update Watch Mega Menu
  const watchImgUrl = "https://gshock.casio.com/content/dam/casio/product-info/locales/in/en/timepiece/product/watch/G/GB/gbm/gbm-2100a-2b/assets/GBM-2100A-2B.png.transform/main-visual-sp/image.png";
  
  html = html.replace(
    /(<div class="mega-menu" id="megaWatches">[\s\S]*?<div class="mega-featured-img">[\s\S]*?<img [^>]*src=")[^"]*("[\s\S]*?<span class="img-overlay-text">)[^<]*(<\/span>)/,
    `$1${watchImgUrl}$2CASIO G-SHOCK$3`
  );

  // Update Clothing Mega Menu
  html = html.replace(
    /(<div class="mega-menu" id="megaClothing">[\s\S]*?<div class="mega-featured-img">[\s\S]*?<img [^>]*src=")[^"]*("[\s\S]*?<span class="img-overlay-text">)[^<]*(<\/span>)/,
    `$1clothing-models.png$2URBAN WEAR$3`
  );

  // Update Specs Mega Menu
  const oakleyMegaImg = "https://configure-imagecomposer.fluidretail.net/recipe/49325181/image/Front.png";
  html = html.replace(
    /(<div class="mega-menu" id="megaSpecs">[\s\S]*?<div class="mega-featured-img">[\s\S]*?<img [^>]*src=")[^"]*("[\s\S]*?<span class="img-overlay-text">)[^<]*(<\/span>)/,
    `$1${oakleyMegaImg}$2OAKLEY SUNGLASSES$3`
  );

  return html;
}

function updateShoesPage(rawHtml: string): string {
  let html = updateMegaMenus(rawHtml);

  // Build static shop cards for the 8 shoes
  const cardsHtml = NIKE_SHOES.map(s => {
    const badgeHtml = s.badge ? `<span class="pc-badge ${s.badge === 'SALE' ? 'sale' : (s.badge === 'NEW' ? 'new-badge' : '')}">${s.badge}</span>` : '';
    const origHtml = s.offer && s.offer < s.price ? `<span class="pc-orig">${formatMRP(s.price)}</span>` : '';
    return `        <article class="prod-card" data-cat="${s.subCat}" data-name="${s.name}" data-price="${formatMRP(s.offer || s.price)}" data-img="${s.img}" data-admin-id="${s.id}">
          <div class="pc-img-wrap">
            <img src="${s.img}" alt="${s.name}" loading="lazy" />
            ${badgeHtml}
            <div class="pc-overlay">
              <button class="pc-quick-add" onclick="addToCartFromAdmin(event, this)">+ QUICK ADD</button>
            </div>
          </div>
          <div class="pc-info">
            <div class="pc-name">${s.name}</div>
            <div class="pc-rating"><span class="stars">★★★★★</span><span class="rev-count">(${s.reviews})</span></div>
            <div class="pc-price-row">
              ${origHtml}
              <span class="pc-price">${formatMRP(s.offer || s.price)}</span>
            </div>
          </div>
        </article>`;
  }).join('\n\n');

  // Replace #shopGrid content
  html = html.replace(
    /<div class="shop-grid" id="shopGrid">[\s\S]*?<\/div><!-- end shop-grid -->/,
    `<div class="shop-grid" id="shopGrid">\n${cardsHtml}\n      </div><!-- end shop-grid -->`
  );

  // Build PRODUCT_DATA object string
  const prodDataObj: Record<string, any> = {};
  NIKE_SHOES.forEach(s => {
    prodDataObj[s.name] = {
      badge: s.badge,
      badgeClass: s.badgeClass,
      desc: s.desc,
      features: s.features,
      sizes: s.sizes,
      unavail: s.unavail,
      rating: s.rating,
      reviews: s.reviews,
      imgs: s.imgs,
      colors: s.colors
    };
  });
  const prodDataStr = `const PRODUCT_DATA = ${JSON.stringify(prodDataObj, null, 2)};`;

  // Replace PRODUCT_DATA
  html = html.replace(/const PRODUCT_DATA = \{[\s\S]*?\n\s*\};/, prodDataStr);

  // Build DEFAULT_PRODUCTS array string
  const defaultProds = NIKE_SHOES.map(s => ({
    name: s.name,
    price: s.price,
    offer: s.offer,
    badge: s.badge,
    img: s.img,
    reviews: s.reviews
  }));
  const defaultProdsStr = `const DEFAULT_PRODUCTS = ${JSON.stringify(defaultProds, null, 2)};`;
  html = html.replace(/const DEFAULT_PRODUCTS = \[[\s\S]*?\n\s*\];/, defaultProdsStr);

  // Update DATA_VERSION
  html = html.replace(/const DATA_VERSION = ['"][^'"]*['"];/, `const DATA_VERSION = 'v5_nike_exclusive';`);

  return html;
}

function updateSpecsPage(rawHtml: string): string {
  let html = updateMegaMenus(rawHtml);
  html = html.replace(/const DATA_VERSION = ['"][^'"]*['"];/, `const DATA_VERSION = 'v2_oakley';`);
  return html;
}

export async function GET() {
  const copied: string[] = [];

  // Copy images from brainDir
  for (const item of filesToCopy) {
    const srcPath = path.join(brainDir, item.src);
    if (fs.existsSync(srcPath)) {
      for (const targetDir of targets) {
        try {
          if (fs.existsSync(targetDir)) {
            fs.copyFileSync(srcPath, path.join(targetDir, item.dest));
            copied.push(`${item.src} -> ${path.join(targetDir, item.dest)}`);
          }
        } catch (err: any) {
          copied.push(`Error copying ${item.src}: ${err.message}`);
        }
      }
    }
  }

  // Update shoes.html
  const rootShoesPath = path.join(rootDir, 'shoes.html');
  if (fs.existsSync(rootShoesPath)) {
    const rawShoes = fs.readFileSync(rootShoesPath, 'utf8');
    const updatedShoes = updateShoesPage(rawShoes);
    fs.writeFileSync(rootShoesPath, updatedShoes, 'utf8');
    fs.writeFileSync(path.join(publicDir, 'shoes.html'), updatedShoes, 'utf8');
    fs.writeFileSync(path.join(mainFileDir, 'shoes.html'), updatedShoes, 'utf8');
    copied.push("Updated shoes.html across root, public, and Main FILE");
  }

  // Update specs.html
  const rootSpecsPath = path.join(rootDir, 'specs.html');
  if (fs.existsSync(rootSpecsPath)) {
    const rawSpecs = fs.readFileSync(rootSpecsPath, 'utf8');
    const updatedSpecs = updateSpecsPage(rawSpecs);
    fs.writeFileSync(rootSpecsPath, updatedSpecs, 'utf8');
    fs.writeFileSync(path.join(publicDir, 'specs.html'), updatedSpecs, 'utf8');
    fs.writeFileSync(path.join(mainFileDir, 'specs.html'), updatedSpecs, 'utf8');
    copied.push("Updated specs.html across root, public, and Main FILE");
  }

  // Update mega menus in all other HTML files
  const otherHtmls = ['index.html', 'watch.html', 'cloth.html', 'sale.html', 'login.html', 'register.html'];
  for (const name of otherHtmls) {
    const rootPath = path.join(rootDir, name);
    if (fs.existsSync(rootPath)) {
      const raw = fs.readFileSync(rootPath, 'utf8');
      const updated = updateMegaMenus(raw);
      fs.writeFileSync(rootPath, updated, 'utf8');
      try { fs.writeFileSync(path.join(publicDir, name), updated, 'utf8'); } catch (e) {}
      try { fs.writeFileSync(path.join(mainFileDir, name), updated, 'utf8'); } catch (e) {}
      copied.push(`Updated mega menus for ${name}`);
    }
  }

  return NextResponse.json({ success: true, copied });
}
