const themeToggle = document.getElementById('themeToggle');
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('nav');
const root = document.documentElement;
const scrollRestoreKey = 'cssPortfolioScrollPos';

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

function restoreScrollPosition() {
  const navigationEntries = performance.getEntriesByType?.('navigation');
  const isReload = navigationEntries?.[0]?.type === 'reload' || performance.navigation?.type === 1;
  if (!isReload) return;

  const savedY = sessionStorage.getItem(scrollRestoreKey);
  if (savedY !== null) {
    window.scrollTo(0, Number(savedY));
  }
}

function saveScrollPosition() {
  sessionStorage.setItem(scrollRestoreKey, String(window.scrollY));
}

window.addEventListener('beforeunload', saveScrollPosition);
window.addEventListener('pagehide', saveScrollPosition);
window.addEventListener('load', restoreScrollPosition);

function setTheme(theme) {
  root.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  themeToggle.setAttribute(
    'aria-label',
    theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
  );
  themeToggle.title = theme === 'dark' ? 'Light mode' : 'Dark mode';
}

themeToggle.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  setTheme(next);
});

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

setTheme(root.getAttribute('data-theme') || 'dark');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.transitionDelay = (i * 0.08) + 's';
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

/* Custom cursor — desktop only */
if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  const glow = document.querySelector('.cursor-glow');
  const hoverSelector =
    'a, button, .skill-card, .project-card, .exp-item, .edu-card, .contact-btn, .btn-primary, .btn-ghost, .theme-toggle';

  let mouseX = -100;
  let mouseY = -100;
  let dotX = -100;
  let dotY = -100;
  let ringX = -100;
  let ringY = -100;

  document.body.classList.add('custom-cursor');

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  document.addEventListener('mouseleave', () => document.body.classList.add('cursor-hidden'));
  document.addEventListener('mouseenter', () => document.body.classList.remove('cursor-hidden'));

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverSelector)) document.body.classList.add('cursor-hover');
  });
  document.addEventListener('mouseout', (e) => {
    const el = e.target.closest(hoverSelector);
    if (el && !el.contains(e.relatedTarget)) document.body.classList.remove('cursor-hover');
  });

  function tick() {
    dotX += (mouseX - dotX) * 0.4;
    dotY += (mouseY - dotY) * 0.4;
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    dot.style.left = dotX + 'px';
    dot.style.top = dotY + 'px';
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    glow.style.left = mouseX + 'px';
    glow.style.top = mouseY + 'px';
    requestAnimationFrame(tick);
  }
  tick();
}

/* Touch devices: toggle `.hover` class on touchstart so touch users see hover effects */
if ('ontouchstart' in window || matchMedia('(pointer: coarse)').matches) {
  const touchHoverSelector = 'a, button, .skill-card, .project-card, .exp-item, .edu-card, .contact-btn, .btn-primary, .btn-ghost, .theme-toggle, .project-link, .nav-links a, .footer-top, .contact-details a';
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  const glow = document.querySelector('.cursor-glow');
  let lastTouched = null;
  let touchX = -100;
  let touchY = -100;
  let dotX = -100;
  let dotY = -100;
  let ringX = -100;
  let ringY = -100;
  let isTouching = false;

  function addHover(el) {
    if (!el) return;
    el.classList.add('hover');
    document.body.classList.add('cursor-hover');
    lastTouched = el;
  }

  function removeHover(el) {
    if (!el) return;
    el.classList.remove('hover');
    if (lastTouched === el) lastTouched = null;
    document.body.classList.remove('cursor-hover');
  }

  function updateTouchCursor() {
    dotX += (touchX - dotX) * 0.4;
    dotY += (touchY - dotY) * 0.4;
    ringX += (touchX - ringX) * 0.18;
    ringY += (touchY - ringY) * 0.18;

    dot.style.left = dotX + 'px';
    dot.style.top = dotY + 'px';
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    glow.style.left = touchX + 'px';
    glow.style.top = touchY + 'px';

    requestAnimationFrame(updateTouchCursor);
  }

  function showTouchCursor() {
    document.body.classList.add('touch-cursor');
    document.body.classList.remove('cursor-hidden');
  }

  function hideTouchCursor() {
    document.body.classList.add('cursor-hidden');
    document.body.classList.remove('cursor-hover');
  }

  document.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    if (!touch) return;
    touchX = touch.clientX;
    touchY = touch.clientY;
    isTouching = true;
    showTouchCursor();

    const el = e.target.closest(touchHoverSelector);
    if (el && el !== lastTouched) {
      if (lastTouched) removeHover(lastTouched);
      addHover(el);
    }
  }, {passive: true});

  document.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    if (!touch) return;
    touchX = touch.clientX;
    touchY = touch.clientY;

    const el = e.target.closest(touchHoverSelector);
    if (el && el !== lastTouched) {
      if (lastTouched) removeHover(lastTouched);
      addHover(el);
    } else if (!el && lastTouched) {
      removeHover(lastTouched);
    }
  }, {passive: true});

  document.addEventListener('touchend', () => {
    isTouching = false;
    setTimeout(() => {
      if (!isTouching) {
        hideTouchCursor();
      }
    }, 200);
    if (lastTouched) {
      const toRemove = lastTouched;
      setTimeout(() => removeHover(toRemove), 250);
    }
  }, {passive: true});

  document.addEventListener('touchcancel', () => {
    isTouching = false;
    hideTouchCursor();
    if (lastTouched) removeHover(lastTouched);
  }, {passive: true});

  updateTouchCursor();
}
