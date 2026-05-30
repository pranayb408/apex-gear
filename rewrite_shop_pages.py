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
  { 'name':'Nike Air IQ3408 — Sport Blue',   'price':12999, 'offer':12999, 'badge':'NEW',  'img':'shoes.png' },
  { 'name':'Storm 415 Traction Boot',         'price':17200, 'offer':17200, 'badge':'',     'img':'shoes.png' },
  { 'name':'Sylvan Sneaker — Ranger Green',   'price':15600, 'offer':15600, 'badge':'',     'img':'shoes.png' },
  { 'name':'Foster High Top — Blacktop',      'price':17100, 'offer':17100, 'badge':'',     'img':'shoes.png' },
  { 'name':'Naito Sneaker — Black',           'price':12600, 'offer':10200, 'badge':'SALE', 'img':'shoes.png' },
  { 'name':'Dima 3.0 — Ranger Green',         'price':17600, 'offer':17600, 'badge':'',     'img':'shoes.png' },
  { 'name':'Boyer Slip-On — Black',           'price':15600, 'offer':15600, 'badge':'',     'img':'shoes.png' },
  { 'name':'415 Boot Stacked — White',        'price':12600, 'offer':12600, 'badge':'',     'img':'shoes.png' },
  { 'name':'Vegan Canvas Low — Ecru',         'price':9800,  'offer':9800,  'badge':'NEW',  'img':'shoes.png' },
  { 'name':'Urban Bike Clipless — Ranger',    'price':21400, 'offer':21400, 'badge':'',     'img':'shoes.png' },
  { 'name':'Leather Lace-Up Boot — Brown',    'price':19800, 'offer':19800, 'badge':'',     'img':'shoes.png' },
  { 'name':'Bromley Pro Vegan — White',       'price':14600, 'offer':14600, 'badge':'',     'img':'shoes.png' }
]

cloth_defaults = [
  { 'name':'Apex Urban Hoodie — Black',          'price':4299, 'offer':4299, 'badge':'NEW',  'img':'clothes.png' },
  { 'name':'Cargo Trekker Pants — Olive',        'price':5499, 'offer':5499, 'badge':'',     'img':'clothes.png' },
  { 'name':'Apex Sport Tee — White',             'price':1999, 'offer':1799, 'badge':'SALE', 'img':'clothes.png' },
  { 'name':'Denim Urban Jacket — Blue Raw',      'price':7999, 'offer':7999, 'badge':'',     'img':'clothes.png' },
  { 'name':'Apex Slim Jeans — Black',            'price':4999, 'offer':4999, 'badge':'',     'img':'clothes.png' },
  { 'name':'Thermal Base Layer — Grey',          'price':3299, 'offer':3299, 'badge':'NEW',  'img':'clothes.png' },
  { 'name':'Bomber Jacket — Midnight Blue',      'price':8999, 'offer':7999, 'badge':'SALE', 'img':'clothes.png' },
  { 'name':'Apex Polo Shirt — Navy',             'price':2499, 'offer':2499, 'badge':'',     'img':'clothes.png' },
  { 'name':'Mesh Shorts — Ranger Green',         'price':1799, 'offer':1799, 'badge':'',     'img':'clothes.png' },
  { 'name':'Fleece Pullover — Charcoal',         'price':3999, 'offer':3999, 'badge':'NEW',  'img':'clothes.png' },
  { 'name':'Track Pants — Black',                'price':2799, 'offer':2799, 'badge':'',     'img':'clothes.png' },
  { 'name':'Knit Beanie — Olive',                'price':999,  'offer':999,  'badge':'',     'img':'clothes.png' }
]

specs_defaults = [
  { 'name':'Apex Aviator Sunglasses — Black',      'price':4999,  'offer':4999,  'badge':'NEW',  'img':'specs.png' },
  { 'name':'Retro Round Optical Frame — Tortoise',  'price':3599,  'offer':3599,  'badge':'',     'img':'specs.png' },
  { 'name':'Sport Shield Glasses — Mirror Blue',    'price':5499,  'offer':5499,  'badge':'',     'img':'specs.png' },
  { 'name':'Apex Classic Wayfarer — Brown',         'price':3999,  'offer':3599,  'badge':'SALE', 'img':'specs.png' },
  { 'name':'Cat Eye Frame — Rose Gold',             'price':4299,  'offer':4299,  'badge':'',     'img':'specs.png' },
  { 'name':'Polarized Wrap Sunglasses — Black',     'price':5999,  'offer':5999,  'badge':'',     'img':'specs.png' },
  { 'name':'Apex Square Frame — Matte Black',       'price':3299,  'offer':3299,  'badge':'NEW',  'img':'specs.png' },
  { 'name':'Half Rim Reading Glasses — Grey',       'price':2599,  'offer':2599,  'badge':'',     'img':'specs.png' },
  { 'name':'Slim Titanium Frame — Silver',          'price':7999,  'offer':6999,  'badge':'SALE', 'img':'specs.png' },
  { 'name':'Oversized Shield — Gunmetal',           'price':6299,  'offer':6299,  'badge':'',     'img':'specs.png' },
  { 'name':'Sporty Clip-On Frames — Blue',          'price':2999,  'offer':2999,  'badge':'',     'img':'specs.png' },
  { 'name':'Apex Kids Shield — Orange',             'price':1999,  'offer':1999,  'badge':'NEW',  'img':'specs.png' }
]

watch_defaults = [
  { 'name':'Casio G-Steel GMW-BZ5000D',          'price':18999, 'offer':18999, 'badge':'NEW',  'img':'watch.png' },
  { 'name':'Casio G-Shock GA-2100',               'price':9999,  'offer':9999,  'badge':'',     'img':'watch.png' },
  { 'name':'Casio Edifice ECB-900',               'price':13499, 'offer':12999, 'badge':'SALE', 'img':'watch.png' },
  { 'name':'G-Shock DW-6900NB — Neon Blue',       'price':7499,  'offer':7499,  'badge':'',     'img':'watch.png' },
  { 'name':'G-Steel Carbon Core — Black',         'price':21999, 'offer':21999, 'badge':'NEW',  'img':'watch.png' },
  { 'name':'Casio Solar Edifice — Gunmetal',      'price':15999, 'offer':15999, 'badge':'',     'img':'watch.png' },
  { 'name':'G-Shock Mudmaster — Olive',           'price':19499, 'offer':17999, 'badge':'SALE', 'img':'watch.png' },
  { 'name':'Classic A-168WA — Silver',            'price':3199,  'offer':3199,  'badge':'',     'img':'watch.png' },
  { 'name':'G-Shock Frogman — Black',             'price':29999, 'offer':29999, 'badge':'NEW',  'img':'watch.png' },
  { 'name':'Edifice Bluetooth ECB-20',            'price':11999, 'offer':11999, 'badge':'',     'img':'watch.png' },
  { 'name':'G-Shock Rangeman — Forest Green',     'price':23999, 'offer':22499, 'badge':'SALE', 'img':'watch.png' },
  { 'name':'Casio Baby-G BA-130 — Rose Gold',     'price':6499,  'offer':6499,  'badge':'NEW',  'img':'watch.png' }
]

rewrite_page("shoes.html", "shoes", 1000, shoes_defaults)
rewrite_page("cloth.html", "cloth", 1024, cloth_defaults)
rewrite_page("specs.html", "specs", 1012, specs_defaults)
rewrite_page("watch.html", "watch", 1036, watch_defaults)
