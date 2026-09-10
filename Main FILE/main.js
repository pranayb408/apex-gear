/* ================================================================
  APEX GEAR — main.js  (Centralized Logic)
  Handles Cart, Search, Mobile Menu, Carousels, Filters, and Sort.
  ================================================================ */

'use strict';

const NEXT_JS_URL = window.location.port === '8080'
  ? 'http://localhost:3000'
  : '';

/* ─── Cart State ──────────────────────────────────────────── */
let cart = JSON.parse(localStorage.getItem('ag_cart') || '[]');

let ag_uid = localStorage.getItem('ag_uid');
if (!ag_uid) {
  ag_uid = 'guest_' + Date.now();
  localStorage.setItem('ag_uid', ag_uid);
}

const saveCart = () => {
  localStorage.setItem('ag_cart', JSON.stringify(cart));
};
const cartQty = () => cart.reduce((s, i) => s + i.qty, 0);
const cartTotal = () => cart.reduce((s, i) => s + i.qty * parseFloat((i.price || '0').replace(/[^0-9.]/g, '')), 0);
const fmtINR = n => 'Rs. ' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' INR';

function addToCart(name, price, img) {
  const ex = cart.find(i => i.name === name);
  ex ? ex.qty++ : cart.push({ name, price, img, qty: 1 });
  saveCart();
  renderCart();
  showToast(`${name} added to cart!`);
}

/* ─── Render Cart ─────────────────────────────────────────── */
function renderCart() {
  const badge = document.getElementById('cartBadge');
  const ceMsg = document.getElementById('ceMsg');
  const cartFt = document.getElementById('cartFt');
  const list = document.getElementById('cartList');
  const total = document.getElementById('cartTotalVal');

  if (badge) badge.textContent = cartQty();

  if (!cart.length) {
    if (ceMsg) ceMsg.style.display = 'flex';
    if (cartFt) cartFt.style.display = 'none';
    if (cartFt) cartFt.classList.remove('show');
    if (list) list.innerHTML = '';
    return;
  }

  if (ceMsg) ceMsg.style.display = 'none';
  if (cartFt) {
    cartFt.style.display = 'flex';
    cartFt.classList.add('show');
  }
  if (total) total.textContent = fmtINR(cartTotal());

  if (list) {
    list.innerHTML = cart.map((item, i) => `
      <li class="cart-item">
        <img class="ci-img" src="${item.img}" alt="${item.name}"/>
        <div class="ci-info">
          <p class="ci-name">${item.name}</p>
          <p class="ci-price">${item.price} × ${item.qty}</p>
          <button class="ci-rm" data-i="${i}">Remove</button>
        </div>
      </li>`).join('');

    list.querySelectorAll('.ci-rm').forEach(b => b.addEventListener('click', () => {
      cart.splice(+b.dataset.i, 1);
      saveCart(); renderCart();
    }));
  }
}

/* ─── Toast ───────────────────────────────────────────────── */
function showToast(msg) {
  const t = document.getElementById('toast') || document.getElementById('agToast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._tm);
  t._tm = setTimeout(() => t.classList.remove('show'), 3200);
}

/* ─── Cart Open/Close ─────────────────────────────────────── */
const cartDrawer = document.getElementById('cartDrawer') || document.querySelector('.cart-drawer');
const cartOverlay = document.getElementById('cartOverlay') || document.querySelector('.cart-overlay');

const openCart = () => {
  cartDrawer?.classList.add('open');
  cartOverlay?.classList.add('open');
  document.body.style.overflow = 'hidden';
};
const closeCart = () => {
  cartDrawer?.classList.remove('open');
  cartOverlay?.classList.remove('open');
  document.body.style.overflow = '';
};

document.getElementById('cartBtn')?.addEventListener('click', openCart);
document.getElementById('cartX')?.addEventListener('click', closeCart);
cartOverlay?.addEventListener('click', closeCart);
document.getElementById('ceShop')?.addEventListener('click', closeCart);
document.getElementById('checkoutBtn')?.addEventListener('click', () => {
  window.location.href = `${NEXT_JS_URL}/checkout?uid=${ag_uid}`;
});

/* ─── Quick Add buttons (event delegation — fires even inside overflow:hidden) */
function initQuickAdd() {
  // Attach directly to any existing buttons (redundant safety)
  document.querySelectorAll('.pc-quick-add').forEach(btn => {
    if (btn._qaInit) return;
    btn._qaInit = true;
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const card = btn.closest('.prod-card');
      if (!card) return;
      addToCart(card.dataset.name, card.dataset.price, card.dataset.img);
    });
  });
}

// Primary: document-level delegation so ALL quick-add buttons always work
document.addEventListener('click', e => {
  const btn = e.target.closest('.pc-quick-add');
  if (!btn) return;
  e.stopPropagation();
  const card = btn.closest('.prod-card');
  if (!card) return;
  addToCart(card.dataset.name, card.dataset.price, card.dataset.img);
});

/* ─── Navbar scroll ───────────────────────────────────────── */
const navbar = document.getElementById('navbar');
const sections = ['featured', 'shoes', 'watches', 'clothes', 'specs', 'inDemand', 'sale'];
const nmLinks = document.querySelectorAll('.nm-link');

window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
  
  // Active link logic
  let cur = '';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 140) cur = id;
  });
  nmLinks.forEach(a => {
    const href = (a.getAttribute('href') || '').replace('#', '');
    a.classList.toggle('active', href === cur && cur !== '');
  });
}, { passive: true });

/* ─── Search panel ────────────────────────────────────────── */
const searchPanel = document.getElementById('searchPanel');
const searchInput = document.getElementById('searchInput');

document.getElementById('searchBtn')?.addEventListener('click', () => {
  searchPanel?.classList.toggle('open');
  if (searchPanel?.classList.contains('open')) searchInput?.focus();
});
document.getElementById('searchClose')?.addEventListener('click', () => {
  searchPanel?.classList.remove('open');
});

/* ─── Mobile drawer ───────────────────────────────────────── */
const mobDrawer = document.getElementById('mobDrawer');
const mobOverlay = document.getElementById('mobOverlay');
const hamBtn = document.getElementById('hamBtn');
const mobX = document.getElementById('mobX');

const openMob = () => {
  mobDrawer?.classList.add('open');
  mobOverlay?.classList.add('open');
  hamBtn?.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
};
const closeMob = () => {
  mobDrawer?.classList.remove('open');
  mobOverlay?.classList.remove('open');
  hamBtn?.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
};

hamBtn?.addEventListener('click', openMob);
mobX?.addEventListener('click', closeMob);
mobOverlay?.addEventListener('click', closeMob);
mobDrawer?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMob));

/* ─── Hero product switcher ───────────────────────────────── */
const heroProds = document.querySelectorAll('.hero-prod');
const heroThumb = document.querySelectorAll('.htd');
const heroPlay = document.getElementById('heroPlay');
const hpPause = document.getElementById('hpPause');
const hpPlay = document.getElementById('hpPlay');
let heroCur = 0;
let heroTimer = null;
let heroPlaying = true;

const heroCopyData = [
  { ey: 'PERFORMANCE FOOTWEAR', title: '"MOVE BODY AND MIND"', link: 'shoes.html' },
  { ey: 'PRECISION ENGINEERING', title: '"ABSOLUTE TOUGHNESS"', link: 'watch.html' },
  { ey: 'URBAN STREETWEAR', title: '"WEAR YOUR IDENTITY"', link: 'cloth.html' },
  { ey: 'CONTEMPORARY ESSENTIALS', title: '"TIMELESS STYLE"', link: 'cloth.html' },
];

function gotoHero(idx) {
  if (!heroProds.length) return;
  heroProds[heroCur].classList.remove('active');
  heroThumb[heroCur]?.classList.remove('active');
  heroCur = idx % heroProds.length;
  heroProds[heroCur].classList.add('active');
  heroThumb[heroCur]?.classList.add('active');
  
  const ec = document.getElementById('hcEyebrow');
  const tt = document.getElementById('hcTitle');
  const cta = document.getElementById('heroCtaBtn');
  const hcInner = document.getElementById('heroCopyInner');
  
  if (heroCopyData[heroCur]) {
    if (ec) { ec.style.opacity = '0'; setTimeout(() => { ec.textContent = heroCopyData[heroCur].ey; ec.style.opacity = '1'; }, 200); }
    if (tt) { tt.style.opacity = '0'; setTimeout(() => { tt.textContent = heroCopyData[heroCur].title; tt.style.opacity = '1'; }, 220); }
    if (cta && heroCopyData[heroCur].link) { cta.setAttribute('href', heroCopyData[heroCur].link); }
  }
  
  if (hcInner) {
    hcInner.style.transition = 'text-align 0.4s ease';
    if (heroCur === 0) {
      hcInner.style.textAlign = 'left';
    } else {
      hcInner.style.textAlign = 'right';
    }
  }
}

function startHeroAuto() {
  if (!heroProds.length) return;
  heroTimer = setInterval(() => gotoHero((heroCur + 1) % heroProds.length), 4000);
  heroPlaying = true;
  if (hpPause) hpPause.style.display = '';
  if (hpPlay) hpPlay.style.display = 'none';
}
function stopHeroAuto() {
  clearInterval(heroTimer);
  heroPlaying = false;
  if (hpPause) hpPause.style.display = 'none';
  if (hpPlay) hpPlay.style.display = '';
}

heroThumb.forEach(btn => {
  btn.addEventListener('click', () => { stopHeroAuto(); gotoHero(+btn.dataset.idx); });
});

heroPlay?.addEventListener('click', () => {
  heroPlaying ? stopHeroAuto() : startHeroAuto();
});

if (heroProds.length) {
  const hcInner = document.getElementById('heroCopyInner');
  if (hcInner) hcInner.style.textAlign = 'left';
  startHeroAuto();
}

/* ─── Floating particles ──────────────────────────────────── */
(function spawnPts() {
  const c = document.getElementById('heroPts');
  if (!c) return;
  for (let i = 0; i < 32; i++) {
    const p = document.createElement('div');
    p.className = 'hp';
    const sz = Math.random() > 0.6 ? 3 : 2;
    Object.assign(p.style, {
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      width: sz + 'px', height: sz + 'px',
      '--d': (4 + Math.random() * 6) + 's',
      '--dl': (Math.random() * 8) + 's',
      '--dx': ((Math.random() - .5) * 80) + 'px',
    });
    c.appendChild(p);
  }
})();

/* ─── Product Carousel Factory ────────────────────────────── */
function initCarousel(trackId, prevId, nextId, progId) {
  const track = document.getElementById(trackId);
  const prev = document.getElementById(prevId);
  const next = document.getElementById(nextId);
  const prog = document.getElementById(progId);
  if (!track) return;

  const cards = [...track.querySelectorAll('.prod-card')];
  let cur = 0;

  function vis() {
    const w = window.innerWidth;
    return w <= 700 ? 1 : w <= 1000 ? 2 : w <= 1200 ? 3 : 4;
  }

  function update() {
    const v = vis();
    const max = Math.max(0, cards.length - v);
    cur = Math.min(cur, max);
    const cw = (cards[0]?.offsetWidth || 0) + 16;
    track.style.transform = `translateX(${-cur * cw}px)`;
    if (prev) { prev.disabled = cur === 0; prev.style.opacity = cur === 0 ? '.25' : '1'; }
    if (next) { next.disabled = cur >= max; next.style.opacity = cur >= max ? '.25' : '1'; }
    if (prog) prog.style.width = ((cur + v) / cards.length * 100).toFixed(1) + '%';
  }

  next?.addEventListener('click', () => { cur++; update(); });
  prev?.addEventListener('click', () => { cur--; update(); });
  window.addEventListener('resize', update, { passive: true });
  update();
}

initCarousel('track1', 'prev1', 'next1', 'prog1');
initCarousel('track2', 'prev2', 'next2', 'prog2');
initCarousel('track3', 'prev3', 'next3', 'prog3');

/* ─── Reviews slider ──────────────────────────────────────── */
(function initReviews() {
  const slides = document.querySelectorAll('.rev-slide');
  const dots = document.getElementById('revDots');
  const prev = document.getElementById('revPrev');
  const next = document.getElementById('revNext');
  if (!slides.length) return;
  let cur = 0;

  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'rev-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', `Review ${i + 1}`);
    d.addEventListener('click', () => goto(i));
    dots?.appendChild(d);
  });

  function goto(n) {
    if (!slides.length) return;
    slides[cur].classList.remove('active');
    dots?.querySelectorAll('.rev-dot')[cur]?.classList.remove('active');
    cur = (n + slides.length) % slides.length;
    slides[cur].classList.add('active');
    dots?.querySelectorAll('.rev-dot')[cur]?.classList.add('active');
  }

  prev?.addEventListener('click', () => goto(cur - 1));
  next?.addEventListener('click', () => goto(cur + 1));
  setInterval(() => goto(cur + 1), 5500);
})();

/* ─── Shop Filters & Tabs ─────────────────────────────────── */
function initShopLogic() {
  const catTabs = document.querySelectorAll('.cat-tab');
  const allCards = [...document.querySelectorAll('#shopGrid .prod-card')];
  const grid = document.getElementById('shopGrid');
  const sortSel = document.getElementById('sortSel');

  catTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      catTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.dataset.cat;
      let n = 0;
      allCards.forEach(c => {
        const s = cat === 'all' || c.dataset.cat === cat;
        c.style.display = s ? '' : 'none';
        if (s) n++;
      });
      const rc = document.getElementById('resultsCount');
      if (rc) rc.textContent = n + ' product' + (n !== 1 ? 's' : '');
    });
  });

  sortSel?.addEventListener('change', function() {
    const arr = [...document.querySelectorAll('#shopGrid .prod-card')];
    const gp = c => parseFloat((c.dataset.price || '0').replace(/[^0-9.]/g, ''));
    const gr = c => parseInt((c.querySelector('.rev-count')?.textContent || '0').replace(/\D/g, ''));
    
    if (this.value === 'price-asc') arr.sort((a, b) => gp(a) - gp(b));
    else if (this.value === 'price-desc') arr.sort((a, b) => gp(b) - gp(a));
    else if (this.value === 'rating') arr.sort((a, b) => gr(b) - gr(a));
    
    arr.forEach(c => grid.appendChild(c));
  });

  // Swatches
  document.querySelectorAll('.pc-swatches').forEach(wrap => {
    wrap.querySelectorAll('.swatch').forEach(sw => {
      sw.addEventListener('click', () => {
        wrap.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
        sw.classList.add('active');
      });
    });
  });
  
  // Load more
  document.getElementById('loadMoreBtn')?.addEventListener('click', () => showToast('All products shown!'));
}

/* ─── Scroll Reveal ───────────────────────────────────────── */
const srTargets = document.querySelectorAll(
  '.ep-panel, .prod-card, .rev-headline, .rev-carousel, ' +
  '.lp-card, .ss-inner, .nl-wrap, .sf-col, .ps-header'
);

srTargets.forEach((el, i) => {
  el.classList.add('sr');
  if (i % 3 === 1) el.classList.add('sr-d1');
  if (i % 3 === 2) el.classList.add('sr-d2');
});

const sio = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); sio.unobserve(e.target); } });
}, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });

srTargets.forEach(el => sio.observe(el));

function loadCart() {
  cart = JSON.parse(localStorage.getItem('ag_cart') || '[]');
}

/* ─── Init ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  renderCart();
  initQuickAdd();
  initShopLogic();

  // Intercept account and login links to route to Next.js Dashboard
  document.querySelectorAll('a[href="login.html"], a[href="seller-login.html"], a[href*="login"]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = `${NEXT_JS_URL}/dashboard`;
    });
  });
});
