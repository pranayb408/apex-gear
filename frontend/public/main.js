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
  if (!cart.length) { showToast('Your cart is empty!'); return; }
  openCheckoutModal();
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
    cur = Math.min(Math.max(0, cur), max);
    const cw = (cards[0]?.offsetWidth || 0) + 16;
    track.style.transform = `translateX(${-cur * cw}px)`;
    if (prev) { prev.disabled = cur === 0; prev.style.opacity = cur === 0 ? '.25' : '1'; }
    if (next) { next.disabled = cur >= max; next.style.opacity = cur >= max ? '.25' : '1'; }
    if (prog) prog.style.width = ((cur + v) / cards.length * 100).toFixed(1) + '%';
  }

  next?.addEventListener('click', () => { cur++; update(); });
  prev?.addEventListener('click', () => { cur--; update(); });
  window.addEventListener('resize', update, { passive: true });

  // Mobile touch swipe gestures
  let startX = 0;
  let currentX = 0;
  let isSwiping = false;

  track.addEventListener('touchstart', e => {
    if (!e.touches || !e.touches[0]) return;
    startX = e.touches[0].clientX;
    currentX = startX;
    isSwiping = true;
  }, { passive: true });

  track.addEventListener('touchmove', e => {
    if (!isSwiping || !e.touches || !e.touches[0]) return;
    currentX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', () => {
    if (!isSwiping) return;
    isSwiping = false;
    const diff = startX - currentX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        cur++;
        update();
      } else {
        cur--;
        update();
      }
    }
  }, { passive: true });

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
}, { threshold: 0.01, rootMargin: '80px 0px 80px 0px' });

srTargets.forEach(el => {
  sio.observe(el);
  if (el.getBoundingClientRect().top < window.innerHeight + 100) {
    el.classList.add('vis');
  }
});

function loadCart() {
  cart = JSON.parse(localStorage.getItem('ag_cart') || '[]');
}

/* ─── Account Dropdown ────────────────────────────────────── */
const acctBtn = document.getElementById('acctBtn');
const acctDropMenu = document.getElementById('acctDropMenu');

if (acctBtn && acctDropMenu) {
  acctBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = acctDropMenu.style.display === 'block';
    acctDropMenu.style.display = isOpen ? 'none' : 'block';
    acctBtn.setAttribute('aria-expanded', String(!isOpen));
  });
  document.addEventListener('click', () => {
    acctDropMenu.style.display = 'none';
    acctBtn.setAttribute('aria-expanded', 'false');
  });
  acctDropMenu.addEventListener('click', (e) => e.stopPropagation());
}

/* ─── Checkout Modal ──────────────────────────────────────── */
function openCheckoutModal() {
  const modal   = document.getElementById('checkoutModal');
  const overlay = document.getElementById('checkoutOverlay');
  if (!modal) return;
  const summary = document.getElementById('coOrderSummary');
  if (summary) {
    summary.innerHTML = `
      <p style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#888;margin-bottom:10px;">Order Summary</p>
      <ul style="list-style:none;display:flex;flex-direction:column;gap:6px;">
        ${cart.map(i => `<li style="display:flex;justify-content:space-between;font-size:13px;"><span>${i.name} &times; ${i.qty}</span><strong>${i.price}</strong></li>`).join('')}
      </ul>
      <div style="margin-top:10px;padding-top:10px;border-top:1px solid #e5e5e5;display:flex;justify-content:space-between;font-size:14px;font-weight:800;">
        <span>Total</span><span>${fmtINR(cartTotal())}</span>
      </div>`;
  }
  modal.style.display   = 'block';
  overlay.style.display = 'block';
  document.body.style.overflow = 'hidden';
  closeCart();
}

function closeCheckoutModal(e) {
  if (e && e.target !== document.getElementById('checkoutOverlay')) return;
  document.getElementById('checkoutModal').style.display   = 'none';
  document.getElementById('checkoutOverlay').style.display = 'none';
  document.body.style.overflow = '';
}

function placeOrder() {
  const name    = (document.getElementById('coName')?.value  || '').trim();
  const phone   = (document.getElementById('coPhone')?.value || '').trim();
  const addr    = (document.getElementById('coAddr')?.value  || '').trim();
  const city    = (document.getElementById('coCity')?.value  || '').trim();
  const pin     = (document.getElementById('coPIN')?.value   || '').trim();
  const payment = document.getElementById('coPayment')?.value || 'cod';
  const coMsg   = document.getElementById('coMsg');

  const showErr = (msg) => {
    coMsg.style.cssText = 'display:block;padding:11px 14px;border-radius:8px;font-size:13px;margin-bottom:16px;background:#fef2f2;color:#b91c1c;border:1px solid #fecaca;';
    coMsg.textContent = msg;
  };

  if (!name || !phone || !addr || !city || !pin) { showErr('⚠ Please fill in all required fields.'); return; }
  if (!/^[6-9]\d{9}$/.test(phone)) { showErr('⚠ Enter a valid 10-digit Indian mobile number.'); return; }
  if (!/^\d{6}$/.test(pin))         { showErr('⚠ Enter a valid 6-digit PIN code.'); return; }

  const order = {
    orderId:   'AG-' + Date.now(),
    placedAt:  new Date().toISOString(),
    customer:  { name, phone, address: addr, city, pin },
    payment,
    items:     cart.map(i => ({ name: i.name, price: i.price, qty: i.qty, img: i.img })),
    total:     fmtINR(cartTotal()),
    status:    'CONFIRMED'
  };

  const orders = JSON.parse(localStorage.getItem('apexOrders') || '[]');
  orders.unshift(order);
  localStorage.setItem('apexOrders', JSON.stringify(orders));

  cart = []; saveCart(); renderCart();

  const btn = document.getElementById('coPlaceBtn');
  btn.disabled = true;
  btn.textContent = '✓ Order Placed!';
  btn.style.background = '#1a6b3c';
  coMsg.style.cssText = 'display:block;padding:11px 14px;border-radius:8px;font-size:13px;margin-bottom:16px;background:#f0fdf4;color:#166534;border:1px solid #bbf7d0;';
  coMsg.innerHTML = `✓ Order <strong>${order.orderId}</strong> confirmed! Estimated delivery: <strong>3–5 business days</strong>.`;

  setTimeout(() => {
    document.getElementById('checkoutModal').style.display   = 'none';
    document.getElementById('checkoutOverlay').style.display = 'none';
    document.body.style.overflow = '';
    btn.disabled = false; btn.textContent = 'Place Order →'; btn.style.background = '#000';
    coMsg.style.display = 'none';
    ['coName','coPhone','coAddr','coCity','coPIN'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    showToast('✓ Order placed! Check seller dashboard for status.');
  }, 3000);
}

/* ─── Video & Audio Management ────────────────────────────── */
function initResponsiveVideos() {
  // 1. Hero Video (background showcase)
  const heroVid = document.getElementById('heroVid');
  if (heroVid) {
    heroVid.muted = true;
    const showHeroVid = () => heroVid.classList.add('loaded');
    heroVid.addEventListener('canplay', showHeroVid);
    heroVid.addEventListener('playing', showHeroVid);
    if (heroVid.readyState >= 2) showHeroVid();
    heroVid.play().catch(() => {});
  }

  // 2. Move Banner Video (Oakley Meta AI Glasses / Virat Kohli)
  const mbVid = document.getElementById('mbVid');
  const mbSoundBtn = document.getElementById('mbSoundBtn');
  if (mbVid) {
    mbVid.muted = true;
    const playVideo = () => {
      const p = mbVid.play();
      if (p !== undefined) {
        p.catch(() => {
          // Autoplay was blocked by mobile browser policy; play on first interaction
          const onUserGesture = () => {
            mbVid.play().catch(() => {});
            document.removeEventListener('touchstart', onUserGesture);
            document.removeEventListener('click', onUserGesture);
          };
          document.addEventListener('touchstart', onUserGesture, { passive: true, once: true });
          document.addEventListener('click', onUserGesture, { passive: true, once: true });
        });
      }
    };
    playVideo();

    if (mbSoundBtn) {
      const icMuted = mbSoundBtn.querySelector('.mb-ic-muted');
      const icUnmuted = mbSoundBtn.querySelector('.mb-ic-unmuted');
      const soundLabel = mbSoundBtn.querySelector('.mb-sound-label');

      mbSoundBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (mbVid.muted) {
          mbVid.muted = false;
          if (icMuted) icMuted.style.display = 'none';
          if (icUnmuted) icUnmuted.style.display = 'block';
          if (soundLabel) soundLabel.textContent = 'MUTE';
          showToast('Audio unmuted');
        } else {
          mbVid.muted = true;
          if (icMuted) icMuted.style.display = 'block';
          if (icUnmuted) icUnmuted.style.display = 'none';
          if (soundLabel) soundLabel.textContent = 'UNMUTE';
          showToast('Audio muted');
        }
      });
    }
  }
}

/* ─── Init ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  renderCart();
  initQuickAdd();
  initShopLogic();
  initResponsiveVideos();
});
