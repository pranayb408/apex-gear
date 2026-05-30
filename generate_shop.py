import os
import random

# ═══════════════════════════════════════════════════════
#  APEX GEAR — generate_shop.py (Cleaned Version)
#  Generates: shoes.html, watch.html, cloth.html, sale.html
# ═══════════════════════════════════════════════════════

SHARED_NAV = """
    <ul class="nav-menu" id="navMenu" role="menubar">
      <li class="nm-item"><a href="shoes.html" class="nm-link {shoes_active}">SHOES</a></li>
      <li class="nm-item"><a href="watch.html" class="nm-link {watches_active}">WATCHES</a></li>
      <li class="nm-item"><a href="cloth.html" class="nm-link {clothing_active}">CLOTHING</a></li>
      <li class="nm-item"><a href="specs.html" class="nm-link {specs_active}">SPECS</a></li>
      <li class="nm-item"><a href="sale.html" class="nm-link {sale_active}" style="color:#E31837 !important;">SALE</a></li>
    </ul>
"""

SHARED_MOB_LINKS = """
  <ul class="mob-links">
    <li><a href="shoes.html">Shoes</a></li>
    <li><a href="watch.html">Watches</a></li>
    <li><a href="cloth.html">Clothing</a></li>
    <li><a href="specs.html">Specs</a></li>
    <li><a href="sale.html" style="color:#c00">Sale</a></li>
  </ul>
"""

def build_header(title, page_key):
    active = {k: "active" if k == page_key else "" for k in ["shoes", "watches", "clothing", "specs", "sale"]}
    nav = SHARED_NAV.format(
        shoes_active=active["shoes"],
        watches_active=active["watches"],
        clothing_active=active["clothing"],
        specs_active=active["specs"],
        sale_active=active["sale"]
    )
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>{title} — APEX GEAR</title>
  <link rel="stylesheet" href="style.css?v=3"/>
</head>
<body>
<div class="ann-bar">
  <div class="ann-track">
    <span>FREE SHIPPING ON ORDERS OVER ₹5000 &nbsp;·&nbsp; {title.upper()} COLLECTION &nbsp;·&nbsp; NEW DROPS</span>
  </div>
</div>
<header class="site-header">
  <nav class="navbar">
    <a href="index.html" class="nav-logo">
      <span class="logo-tri">▲</span><span class="logo-txt">APEX GEAR</span>
    </a>
    {nav}
    <div class="nav-icons">
      <button class="nav-ic" id="searchBtn"><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></button>
      <a href="login.html" class="nav-ic"><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></a>
      <button class="nav-ic cart-ic" id="cartBtn"><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg><span class="cart-badge" id="cartBadge">0</span></button>
      <button class="ham-btn" id="hamBtn"><span></span><span></span><span></span></button>
    </div>
  </nav>
  <div class="search-panel" id="searchPanel">
    <div class="search-inner">
      <input type="search" class="search-input" id="searchInput" placeholder="Search {title.lower()}..."/>
      <button class="search-close" id="searchClose">✕</button>
    </div>
  </div>
</header>
<aside class="mob-drawer" id="mobDrawer"><div class="mob-head">▲ APEX GEAR <button class="mob-x" id="mobX">✕</button></div>{SHARED_MOB_LINKS}</aside>
<div class="cart-overlay" id="cartOverlay"></div>
<div class="cart-drawer" id="cartDrawer">
  <div class="cd-head"><span class="cd-title">Your Cart</span><button class="cd-close" id="cartX">✕</button></div>
  <div class="cd-body"><div class="ce-msg" id="ceMsg"><p>Your cart is empty</p></div><ul class="cart-list" id="cartList"></ul></div>
  <div class="cd-foot" id="cartFt"><div class="cd-total-row"><span>Total</span><span id="cartTotalVal">₹0</span></div><button class="cd-checkout">CHECKOUT</button></div>
</div>
<div id="agToast" class="toast"></div>
"""

def build_product_card(item):
    name, price, img, badge = item['name'], item['price'], item['img'], item.get('badge','')
    badge_html = f'<span class="pc-badge">{badge}</span>' if badge else ''
    return f"""
      <article class="prod-card" data-name="{name}" data-price="{price}" data-img="{img}">
        <div class="pc-img-wrap"><img src="{img}" alt="{name}"/>{badge_html}<div class="pc-overlay"><button class="pc-quick-add">+ QUICK ADD</button></div></div>
        <div class="pc-info"><p class="pc-name">{name}</p><p class="pc-price">{price}</p></div>
      </article>"""

PRODUCTS = {
    "specs": {"title":"Specs","key":"specs","items":[{"name":"Barrage Backpack","price":"₹18,500","img":"shoes.png","badge":"NEW"}]},
    "watch": {"title":"Watches","key":"watches","items":[{"name":"G-Steel","price":"₹24,995","img":"watch.png"}]},
    "cloth": {"title":"Clothing","key":"clothing","items":[{"name":"Denim Jacket","price":"₹5,999","img":"cloth.png"}]},
    "sale": {"title":"Sale","key":"sale","items":[{"name":"Naito Sneaker","price":"₹10,200","img":"shoes.png","badge":"SALE"}]}
}

for k, d in PRODUCTS.items():
    with open(f"{k}.html", "w", encoding="utf-8") as f:
        html = build_header(d['title'], d['key'])
        html += '<div class="shop-top-bar"><div class="breadcrumbs"><a href="index.html">Home</a> / '+d['title']+'</div></div><main>'
        if k == 'sale':
            html += """
  <section class="sale-sec" id="sale" style="background:#f8f8f8; padding: 60px 40px; text-align:left; border:none;">
    <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom: 40px;">
      <div>
        <span class="ss-tag" style="background:#E31837;">LIMITED TIME</span>
        <h2 style="font-family:'Inter', sans-serif; font-weight:900; font-size:48px; color:#000;">SALE</h2>
      </div>
    </div>
    <div class="shop-grid">
      <article class="prod-card" data-name="Nike Air Max Retro" data-price="₹8,500">
        <div class="pc-img-wrap" style="background:#fff;">
          <img src="https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/5/3/5324c8eNike-HQ2592-601_1.jpg?rnd=20200526195200&tr=w-1080" alt="Nike Sale" loading="lazy" />
          <div class="pc-badge" style="display:block!important; background:#E31837;">-30%</div>
        </div>
        <div class="pc-info">
          <p class="pc-name">NIKE AIR MAX RETRO</p>
          <div class="pc-rating"><span class="stars">★★★★★</span> <span class="rev-count">(112)</span></div>
          <p class="pc-price"><s style="color:#888;">₹12,140</s> ₹8,500</p>
        </div>
      </article>

      <article class="prod-card" data-name="Casio Vintage Series" data-price="₹3,200">
        <div class="pc-img-wrap" style="background:#fff;">
          <img src="https://www.casio.com/content/casio/locales/in/en/products/watches/gshock/products/g-steel/2110d-series/_jcr_content/root/responsivegrid/container/container_395339144_/container/container_395339144_/container/container_1597587420/carousel/item_1725953510447.casiocoreimg.jpeg/1755498590940/gm-2110d-2b-square.jpeg" alt="Casio Sale" loading="lazy" />
          <div class="pc-badge" style="display:block!important; background:#E31837;">-40%</div>
        </div>
        <div class="pc-info">
          <p class="pc-name">CASIO G-STEEL LIMITED</p>
          <div class="pc-rating"><span class="stars">★★★★☆</span> <span class="rev-count">(84)</span></div>
          <p class="pc-price"><s style="color:#888;">₹5,335</s> ₹3,200</p>
        </div>
      </article>

      <article class="prod-card" data-name="Levi's Graphic Tee" data-price="₹1,199">
        <div class="pc-img-wrap" style="background:#fff;">
          <img src="https://levi.in/cdn/shop/files/005RC0060_01_Styleshot_360x.jpg?v=1774432503&width=400" alt="Levi's Sale" loading="lazy" />
          <div class="pc-badge" style="display:block!important; background:#E31837;">-50%</div>
        </div>
        <div class="pc-info">
          <p class="pc-name">LEVI'S TRUCKER JACKET</p>
          <div class="pc-rating"><span class="stars">★★★★★</span> <span class="rev-count">(215)</span></div>
          <p class="pc-price"><s style="color:#888;">₹2,398</s> ₹1,199</p>
        </div>
      </article>

      <article class="prod-card" data-name="Amazon Frame Specs" data-price="₹999">
        <div class="pc-img-wrap" style="background:#fff;">
          <img src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop" alt="Specs Sale" loading="lazy" />
          <div class="pc-badge" style="display:block!important; background:#E31837;">-25%</div>
        </div>
        <div class="pc-info">
          <p class="pc-name">RETRO TORTOISE FRAMES</p>
          <div class="pc-rating"><span class="stars">★★★★☆</span> <span class="rev-count">(56)</span></div>
          <p class="pc-price"><s style="color:#888;">₹1,332</s> ₹999</p>
        </div>
      </article>
    </div>
  </section>
"""
        html += '<div class="shop-grid" id="shopGrid">'
        for i in d['items']: html += build_product_card(i)

        html += '</div></main><script src="main.js"></script></body></html>'
        f.write(html)
    print(f"Generated {k}.html")
