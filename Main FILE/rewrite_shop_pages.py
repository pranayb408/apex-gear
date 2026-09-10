import re
import os
import json

def rewrite_page(file_path, cat, base_id, default_products):
    print(f"Rewriting {file_path}...")
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Empty the shop grid
    grid_pattern = re.compile(r'(<div class="shop-grid" id="shopGrid">).*?(</div><!-- end shop-grid -->)', re.DOTALL)
    if not grid_pattern.search(content):
        print(f"ERROR: shopGrid pattern not found in {file_path}")
        return
    content = grid_pattern.sub(r'\1\n      <!-- Products are dynamically injected here -->\n      \2', content)

    # 2. Replace static click wiring
    static_click_pattern = """    /* Wire up product card clicks */
    document.querySelectorAll('#shopGrid .prod-card').forEach(card=>{
      card.style.cursor = 'pointer';
      card.addEventListener('click', e=>{
        if (e.target.classList.contains('pc-quick-add')) return; // handled separately
        openProductModal(card);
      });
    });"""
    content = content.replace(static_click_pattern, "    /* Static card clicks removed (handled dynamically during injection) */")

    # 3. Replace category tabs filter with dynamic querying
    old_tabs_filter = """    /* ── Category tabs filter ── */
    const catTabs = document.querySelectorAll('.cat-tab');
    const prodCards = [...document.querySelectorAll('#shopGrid .prod-card')];
    catTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        catTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const cat = tab.dataset.cat;
        let count = 0;
        prodCards.forEach(card => {
          const show = cat === 'all' || card.dataset.cat === cat;
          card.style.display = show ? '' : 'none';
          if (show) count++;
        });
        const rc = document.getElementById('resultsCount');
        if (rc) rc.textContent = count + ' product' + (count !== 1 ? 's' : '');
      });
    });"""

    new_tabs_filter = """    /* ── Category tabs filter ── */
    const catTabs = document.querySelectorAll('.cat-tab');
    catTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        catTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const cat = tab.dataset.cat;
        let count = 0;
        const currentCards = document.querySelectorAll('#shopGrid .prod-card');
        currentCards.forEach(card => {
          const show = cat === 'all' || card.dataset.cat === cat;
          card.style.display = show ? '' : 'none';
          if (show) count++;
        });
        const rc = document.getElementById('resultsCount');
        if (rc) rc.textContent = count + ' product' + (count !== 1 ? 's' : '');
      });
    });"""

    content = content.replace(old_tabs_filter, new_tabs_filter)

    # 4. Replace injectAdminProducts function
    patterns_to_try = [
        re.compile(r'/\* ── ADMIN PRODUCT SYNC & DYNAMIC INJECTION ── \*/.*?(?=<!-- PRODUCT DETAIL MODAL ELEMENTS -->)', re.DOTALL),
        re.compile(r'/\* ── ADMIN PRODUCT SYNC ──.*?(?=<!-- PRODUCT DETAIL MODAL ELEMENTS -->)', re.DOTALL),
        re.compile(r'/\* -- ADMIN PRODUCT SYNC -- \*/.*?(?=<!-- PRODUCT DETAIL MODAL ELEMENTS -->)', re.DOTALL)
    ]
    inject_func_pattern = None
    for pat in patterns_to_try:
        if pat.search(content):
            inject_func_pattern = pat
            break
    
    if not inject_func_pattern:
        print(f"ERROR: injectAdminProducts function block not found in {file_path}")
        return

    # Define the new sync code as a plain string, then replace placeholders
    template_sync_code = """/* ── ADMIN PRODUCT SYNC & DYNAMIC INJECTION ── */
    const DEFAULT_PRODUCTS = {default_products};

    function determineSubCategory(name, cat) {
      name = name.toLowerCase();
      if (cat === 'shoes') {
        if (name.includes('boot') || name.includes('high top')) return 'boot';
        if (name.includes('bike') || name.includes('dima') || name.includes('clipless')) return 'bike';
        if (name.includes('vegan') || name.includes('canvas') || name.includes('bromley')) return 'vegan';
        return 'sneaker';
      } else if (cat === 'cloth') {
        if (name.includes('pants') || name.includes('jeans') || name.includes('shorts') || name.includes('trousers')) return 'bottoms';
        if (name.includes('jacket') || name.includes('windbreaker') || name.includes('bomber') || name.includes('fleece') || name.includes('outerwear')) return 'outerwear';
        if (name.includes('beanie') || name.includes('cap') || name.includes('socks') || name.includes('belt') || name.includes('accessories')) return 'accessories';
        return 'tops';
      } else if (cat === 'specs') {
        if (name.includes('optical') || name.includes('frame') || name.includes('reading')) return 'optical';
        if (name.includes('sport') || name.includes('shield') || name.includes('cycling') || name.includes('ski') || name.includes('goggles')) return 'sports';
        if (name.includes('kids') || name.includes('child')) return 'kids';
        return 'sunglasses';
      } else if (cat === 'watch') {
        if (name.includes('g-steel') || name.includes('gsteel')) return 'gsteel';
        if (name.includes('edifice') || name.includes('solar')) return 'edifice';
        if (name.includes('classic') || name.includes('vintage') || name.includes('a-168') || name.includes('baby-g')) return 'classic';
        return 'gshock';
      }
      return 'all';
    }

    function addToCartFromAdmin(e, btn) {
      e.stopPropagation();
      const card = btn.closest('.prod-card');
      if (!card) return;
      addToCart(card.dataset.name, card.dataset.price, card.dataset.img);
    }

    function escHtmlSh(s) {
      return String(s).replace(/[&<>"']/g, c =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }

    function formatMRP(val) {
      return 'Rs. ' + Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' INR';
    }

    (function initAndInject() {
      const cat = '{cat}';
      const baseId = {base_id};
      let localProducts = [];
      try {
        localProducts = JSON.parse(localStorage.getItem('apexProducts_' + cat)) || [];
      } catch(e) {}

      if (localProducts.length === 0) {
        // Seed category defaults
        const allSeeded = DEFAULT_PRODUCTS.map((p, idx) => ({
          id: baseId + idx,
          name: p.name,
          desc: 'Apex Gear ' + (cat === 'cloth' ? 'Clothing' : cat.charAt(0).toUpperCase() + cat.slice(1)) + ' — premium quality, built for performance.',
          category: cat,
          price: p.price,
          offer: p.offer,
          badge: p.badge,
          img: p.img,
          inStock: true,
          isStore: true,
          addedAt: '2026-01-01T00:00:00.000Z'
        }));

        localStorage.setItem('apexProducts_' + cat, JSON.stringify(allSeeded));
        localProducts = allSeeded;

        // Sync back to master list 'apexAdminProducts'
        let masterProducts = [];
        try {
          masterProducts = JSON.parse(localStorage.getItem('apexAdminProducts')) || [];
        } catch(e) {}

        masterProducts = masterProducts.filter(p => !(p.category === cat && p.isStore));
        masterProducts = masterProducts.concat(allSeeded);
        localStorage.setItem('apexAdminProducts', JSON.stringify(masterProducts));
      }

      const grid = document.getElementById('shopGrid');
      if (!grid) return;
      grid.innerHTML = ''; // clear

      localProducts.forEach(p => {
        if (!p.inStock) return;

        const subCat = p.subCategory || determineSubCategory(p.name, cat);
        const card = document.createElement('article');
        card.className = 'prod-card';
        card.dataset.cat = subCat;
        card.dataset.name = p.name;
        card.dataset.price = formatMRP(p.offer || p.price);
        card.dataset.img = p.img || '';
        card.dataset.adminId = p.id;

        let badgeHtml = '';
        if (p.badge) {
          const badgeCls = p.badge === 'SALE' ? ' sale' : (p.badge === 'NEW' ? ' new-badge' : '');
          badgeHtml = `<span class="pc-badge${badgeCls}">${p.badge}</span>`;
        }

        const imgHtml = p.img
          ? `<img src="${p.img}" alt="${escHtmlSh(p.name)}" loading="lazy"/>`
          : `<div style="width:80%;height:80%;display:flex;align-items:center;justify-content:center;font-family:'Montserrat',sans-serif;font-weight:900;font-size:13px;color:#ccc;text-align:center;">${escHtmlSh(p.name)}</div>`;

        card.innerHTML = `
          <div class="pc-img-wrap">
            ${imgHtml}
            ${badgeHtml}
            <div class="pc-overlay">
              <button class="pc-quick-add" onclick="addToCartFromAdmin(event, this)">+ QUICK ADD</button>
            </div>
          </div>
          <div class="pc-info">
            <div class="pc-name">${escHtmlSh(p.name)}</div>
            <div class="pc-rating">
              <span class="stars">★★★★★</span>
              <span class="rev-count">(${Math.floor(Math.random() * 200) + 51})</span>
            </div>
            <div class="pc-price-row">
              ${p.offer && p.offer < p.price ? `<span class="pc-orig">${formatMRP(p.price)}</span>` : ''}
              <span class="pc-price">${formatMRP(p.offer || p.price)}</span>
            </div>
          </div>
        `;

        grid.appendChild(card);
        card.style.cursor = 'pointer';
        card.addEventListener('click', e => {
          if (e.target.classList.contains('pc-quick-add')) return;
          if (typeof openProductModal === 'function') openProductModal(card);
        });
      });
      
      // Update results count label
      const rc = document.getElementById('resultsCount');
      if (rc) {
        const count = localProducts.filter(p => p.inStock).length;
        rc.textContent = count + ' product' + (count !== 1 ? 's' : '');
      }
    })();

  </script>

  """
    
    new_sync_code = template_sync_code.replace("{default_products}", json.dumps(default_products)).replace("{cat}", cat).replace("{base_id}", str(base_id))
    match = inject_func_pattern.search(content)
    if match:
        content = content[:match.start()] + new_sync_code + content[match.end():]
    else:
        print(f"ERROR: inject_func_pattern not matched in {file_path}")
        return

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Success: {file_path} rewritten.")

# Default product arrays
shoes_defaults = [
  {
    "name": "Nike Air IQ3408 — Sport Blue",
    "price": 12999,
    "offer": 12999,
    "badge": "NEW",
    "img": "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/5/3/5324c8eNike-IQ3408-286_1.jpg?rnd=20200526195200&tr=w-1536"
  },
  {
    "name": "Storm 415 Traction Boot",
    "price": 17200,
    "offer": 17200,
    "badge": "WATERPROOF",
    "img": "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/5/3/5324c8eNike-HQ2592-601_1.jpg?rnd=20200526195200&tr=w-1080"
  },
  {
    "name": "Sylvan Sneaker — Ranger Green",
    "price": 15600,
    "offer": 15600,
    "badge": "",
    "img": "https://images-static.nykaa.com/uploads/7019e8e5-2115-4e1c-8a07-17c1fc1fcffd.png?tr=cm-pad_resize,w-900"
  },
  {
    "name": "Foster High Top — Blacktop",
    "price": 17100,
    "offer": 17100,
    "badge": "",
    "img": "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/5/3/5324c8eNike-IQ3408-286_1.jpg?rnd=20200526195200&tr=w-1536"
  },
  {
    "name": "Naito Sneaker — Black",
    "price": 12600,
    "offer": 10200,
    "badge": "SALE",
    "img": "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/5/3/5324c8eNike-HQ2592-601_1.jpg?rnd=20200526195200&tr=w-1080"
  },
  {
    "name": "Dima 3.0 — Ranger Green",
    "price": 17600,
    "offer": 17600,
    "badge": "BIKE",
    "img": "https://images-static.nykaa.com/uploads/7019e8e5-2115-4e1c-8a07-17c1fc1fcffd.png?tr=cm-pad_resize,w-900"
  },
  {
    "name": "Boyer Slip-On — Black",
    "price": 15600,
    "offer": 15600,
    "badge": "",
    "img": "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/5/3/5324c8eNike-IQ3408-286_1.jpg?rnd=20200526195200&tr=w-1536"
  },
  {
    "name": "415 Boot Stacked — White",
    "price": 12600,
    "offer": 12600,
    "badge": "",
    "img": "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/5/3/5324c8eNike-HQ2592-601_1.jpg?rnd=20200526195200&tr=w-1080"
  },
  {
    "name": "Vegan Canvas Low — Ecru",
    "price": 9800,
    "offer": 9800,
    "badge": "VEGAN",
    "img": "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/5/3/5324c8eNike-IQ3408-286_1.jpg?rnd=20200526195200&tr=w-1536"
  },
  {
    "name": "Urban Bike Clipless — Ranger",
    "price": 21400,
    "offer": 21400,
    "badge": "BIKE",
    "img": "https://images-static.nykaa.com/uploads/7019e8e5-2115-4e1c-8a07-17c1fc1fcffd.png?tr=cm-pad_resize,w-900"
  },
  {
    "name": "Leather Lace-Up Boot — Brown",
    "price": 19800,
    "offer": 19800,
    "badge": "PREMIUM",
    "img": "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/5/3/5324c8eNike-IQ3408-286_1.jpg?rnd=20200526195200&tr=w-1536"
  },
  {
    "name": "Bromley Pro Vegan — White",
    "price": 14600,
    "offer": 14600,
    "badge": "",
    "img": "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/5/3/5324c8eNike-HQ2592-601_1.jpg?rnd=20200526195200&tr=w-1080"
  }
]

cloth_defaults = [
  {
    "name": "Classic Graphic Tee",
    "price": 1299,
    "offer": 1299,
    "badge": "NEW",
    "img": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80"
  },
  {
    "name": "Slim Fit Denim",
    "price": 2499,
    "offer": 2499,
    "badge": "",
    "img": "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=600&q=80"
  },
  {
    "name": "Urban Hooded Jacket",
    "price": 4999,
    "offer": 4999,
    "badge": "HOT",
    "img": "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80"
  },
  {
    "name": "Cotton Beanie",
    "price": 899,
    "offer": 899,
    "badge": "",
    "img": "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&q=80"
  },
  {
    "name": "Oversized Vintage Hoodie",
    "price": 3499,
    "offer": 3499,
    "badge": "",
    "img": "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80"
  },
  {
    "name": "Waterproof Windbreaker",
    "price": 6500,
    "offer": 5200,
    "badge": "SALE",
    "img": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80"
  },
  {
    "name": "Cargo Track Pants",
    "price": 2199,
    "offer": 2199,
    "badge": "",
    "img": "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80"
  },
  {
    "name": "Premium Basic Polo",
    "price": 1499,
    "offer": 1499,
    "badge": "",
    "img": "https://images.unsplash.com/photo-1589902860314-e910697dea18?w=600&q=80"
  }
]

specs_defaults = [
  {
    "name": "Aviator Classic",
    "price": 5499,
    "offer": 5499,
    "badge": "HOT",
    "img": "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80"
  },
  {
    "name": "Blue Light Blockers",
    "price": 2999,
    "offer": 2999,
    "badge": "",
    "img": "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&q=80"
  },
  {
    "name": "Cycling Wraparound",
    "price": 4200,
    "offer": 4200,
    "badge": "NEW",
    "img": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80"
  },
  {
    "name": "Durable Flex Frames",
    "price": 1899,
    "offer": 1899,
    "badge": "",
    "img": "https://images.unsplash.com/photo-1483095348487-53dbf97d8d5b?w=600&q=80"
  },
  {
    "name": "Retro Square Shades",
    "price": 4999,
    "offer": 3499,
    "badge": "SALE",
    "img": "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&q=80"
  },
  {
    "name": "Titanium Half-Rim",
    "price": 6500,
    "offer": 6500,
    "badge": "",
    "img": "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&q=80"
  },
  {
    "name": "Polarized Wayfarer",
    "price": 4999,
    "offer": 4999,
    "badge": "",
    "img": "https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&q=80"
  },
  {
    "name": "Polarized Ski Goggles",
    "price": 7200,
    "offer": 7200,
    "badge": "NEW",
    "img": "https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=600&q=80"
  }
]

watch_defaults = [
  {
    "name": "G-Shock Mudmaster",
    "price": 24995,
    "offer": 24995,
    "badge": "NEW",
    "img": "https://images.unsplash.com/photo-1612817158483-12d260ebdf70?w=600&q=80"
  },
  {
    "name": "G-Steel GST-B400",
    "price": 32000,
    "offer": 32000,
    "badge": "",
    "img": "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600&q=80"
  },
  {
    "name": "Edifice Chronograph",
    "price": 18500,
    "offer": 14500,
    "badge": "SALE",
    "img": "https://images.unsplash.com/photo-1585123334904-845d60e97b29?w=600&q=80"
  },
  {
    "name": "Vintage Digital Gold",
    "price": 4295,
    "offer": 4295,
    "badge": "",
    "img": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80"
  },
  {
    "name": "G-Shock GA-2100 (CasiOak)",
    "price": 9995,
    "offer": 9995,
    "badge": "HOT",
    "img": "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80"
  },
  {
    "name": "Edifice Sapphire Solar",
    "price": 19995,
    "offer": 19995,
    "badge": "",
    "img": "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=600&q=80"
  },
  {
    "name": "G-Steel Carbon Core",
    "price": 28500,
    "offer": 28500,
    "badge": "NEW",
    "img": "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80"
  },
  {
    "name": "Silver Analog Classic",
    "price": 3495,
    "offer": 3495,
    "badge": "",
    "img": "https://images.unsplash.com/photo-1591034284664-16e8a6b8a9a1?w=600&q=80"
  }
]

rewrite_page("shoes.html", "shoes", 1000, shoes_defaults)
rewrite_page("cloth.html", "cloth", 1024, cloth_defaults)
rewrite_page("specs.html", "specs", 1012, specs_defaults)
rewrite_page("watch.html", "watch", 1036, watch_defaults)
