/* =====================================================
   FITNESS HALL — Main Scripts
   ===================================================== */

// ─── NAV SCROLL EFFECT ────────────────────────────────
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
  header.style.background = window.scrollY > 60
    ? 'rgba(10,10,10,.97)'
    : 'rgba(10,10,10,.9)';
});

// ─── BURGER MENU ─────────────────────────────────────
const burger = document.querySelector('.burger');
const navUl  = document.querySelector('nav ul');

if (burger && navUl) {
  burger.addEventListener('click', () => {
    navUl.classList.toggle('open');
    const isOpen = navUl.classList.contains('open');
    burger.setAttribute('aria-expanded', isOpen);
    burger.querySelectorAll('span')[0].style.transform = isOpen ? 'rotate(45deg) translate(5px,5px)' : '';
    burger.querySelectorAll('span')[1].style.opacity   = isOpen ? '0' : '1';
    burger.querySelectorAll('span')[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px,-5px)' : '';
  });

  navUl.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navUl.classList.remove('open');
      burger.querySelectorAll('span')[0].style.transform = '';
      burger.querySelectorAll('span')[1].style.opacity   = '1';
      burger.querySelectorAll('span')[2].style.transform = '';
    });
  });
}

// ─── SMOOTH ACTIVE LINK ───────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav ul li a');

const observerNav = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { rootMargin: '-40% 0px -55%' });

sections.forEach(s => observerNav.observe(s));

// ─── FADE-UP SCROLL ANIMATION ─────────────────────────
const fadeEls = document.querySelectorAll('.fade-up');

const observerFade = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observerFade.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => observerFade.observe(el));

// ─── COUNTER ANIMATION ───────────────────────────────
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = Math.floor(start) + (el.dataset.suffix || '');
  }, 16);
}

const counterEls = document.querySelectorAll('.hero-stat .num[data-target]');
let countersStarted = false;

const observerCounter = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !countersStarted) {
    countersStarted = true;
    counterEls.forEach(el => {
      animateCounter(el, parseInt(el.dataset.target, 10));
    });
  }
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) observerCounter.observe(heroStats);

// ─── MODAL ───────────────────────────────────────────
const modalOverlay = document.querySelector('.modal-overlay');
const modalClose   = document.querySelector('.modal-close');
const openModalBtns = document.querySelectorAll('[data-modal]');

function openModal() {
  modalOverlay?.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay?.classList.remove('active');
  document.body.style.overflow = '';
}

openModalBtns.forEach(btn => btn.addEventListener('click', e => {
  e.preventDefault();
  openModal();
}));

modalClose?.addEventListener('click', closeModal);

modalOverlay?.addEventListener('click', e => {
  if (e.target === modalOverlay) closeModal();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// ─── FORM SUBMIT ─────────────────────────────────────
const forms = document.querySelectorAll('.contact-form, .modal-form');

forms.forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type=submit]');
    const original = btn.textContent;
    btn.textContent = '✓ ОТПРАВЛЕНО';
    btn.style.background = '#39ff14';
    btn.style.borderColor = '#39ff14';
    btn.style.color = '#000';
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
      btn.style.borderColor = '';
      btn.style.color = '';
      form.reset();
      closeModal();
    }, 2500);
  });
});

// ─── REVIEWS SLIDER ──────────────────────────────────
(function () {
  const wrap    = document.querySelector('.reviews-slider-wrap');
  const track   = document.querySelector('.reviews-track');
  const btnPrev = document.querySelector('.rev-prev');
  const btnNext = document.querySelector('.rev-next');
  if (!track || !btnPrev || !btnNext || !wrap) return;

  const cards = Array.from(track.querySelectorAll('.review-card'));
  let current  = 0;
  const GAP    = 24;

  function getPerView() {
    const w = window.innerWidth;
    if (w < 600)  return 1;
    if (w < 900)  return 2;
    if (w < 1100) return 3;
    return 4;
  }

  function update() {
    const perView = getPerView();
    // Card width = wrapper width divided by visible cards, minus gaps between them
    const wrapW = wrap.offsetWidth;
    const cardW = Math.floor((wrapW - (perView - 1) * GAP) / perView);

    cards.forEach(c => {
      c.style.width    = cardW + 'px';
      c.style.minWidth = cardW + 'px';
    });

    const maxIdx = Math.max(0, cards.length - perView);
    current = Math.min(current, maxIdx);
    track.style.transform = `translateX(-${current * (cardW + GAP)}px)`;

    btnPrev.disabled = current === 0;
    btnNext.disabled = current >= maxIdx;
  }

  btnPrev.addEventListener('click', () => { current = Math.max(0, current - 1); update(); });
  btnNext.addEventListener('click', () => { current++; update(); });
  window.addEventListener('resize', update);
  // Wait for layout, then init
  requestAnimationFrame(update);
})();

// ─── REVIEW CARD "ЧИТАТЬ" ─────────────────────────────
document.querySelectorAll('.review-card-read').forEach(btn => {
  btn.addEventListener('click', () => {
    const text    = btn.previousElementSibling;
    const expand  = text.classList.toggle('expanded');
    btn.textContent = expand ? 'Свернуть' : 'Читать';
  });
});

// ─── GALLERY LIGHTBOX (simple) ────────────────────────
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    if (!img) return;
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed;inset:0;background:rgba(0,0,0,.92);
      z-index:3000;display:flex;align-items:center;justify-content:center;cursor:zoom-out;
    `;
    const imgEl = document.createElement('img');
    imgEl.src = img.src;
    imgEl.style.cssText = 'max-width:92vw;max-height:88vh;border-radius:4px;';
    overlay.appendChild(imgEl);
    document.body.appendChild(overlay);
    overlay.addEventListener('click', () => overlay.remove());
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', esc); }
    });
  });
});
