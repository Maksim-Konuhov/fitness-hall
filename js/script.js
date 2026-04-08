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
