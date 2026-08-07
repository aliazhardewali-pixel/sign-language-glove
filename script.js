/* =========================================================
   SIGN LANGUAGE TRANSLATOR GLOVE
   Slider controls + lightbox. The photos are in index.html,
   so they display even if this file never loads.
   ========================================================= */

const slides = document.getElementById('slides');
const prev   = document.getElementById('sPrev');
const next   = document.getElementById('sNext');
const dotBox = document.getElementById('dots');

if (slides && prev && next && dotBox) {
  const items = Array.from(slides.querySelectorAll('.slide'));

  /* dots */
  items.forEach((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'dot';
    b.setAttribute('aria-label', 'Photo ' + (i + 1));
    if (i === 0) b.setAttribute('aria-current', 'true');
    b.addEventListener('click', () => go(i));
    dotBox.appendChild(b);
  });
  const dots = Array.from(dotBox.children);

  function current() {
    const mid = slides.scrollLeft + slides.clientWidth / 2;
    let best = 0, bestD = Infinity;
    items.forEach((el, i) => {
      const c = el.offsetLeft + el.offsetWidth / 2;
      const dist = Math.abs(c - mid);
      if (dist < bestD) { bestD = dist; best = i; }
    });
    return best;
  }

  function go(i) {
    const el = items[Math.max(0, Math.min(items.length - 1, i))];
    slides.scrollTo({
      left: el.offsetLeft - (slides.clientWidth - el.offsetWidth) / 2,
      behavior: 'smooth'
    });
  }

  function sync() {
    const i = current();
    dots.forEach((d, n) => {
      if (n === i) d.setAttribute('aria-current', 'true');
      else         d.removeAttribute('aria-current');
    });
    prev.style.visibility = i === 0 ? 'hidden' : 'visible';
    next.style.visibility = i === items.length - 1 ? 'hidden' : 'visible';
  }

  prev.addEventListener('click', () => go(current() - 1));
  next.addEventListener('click', () => go(current() + 1));

  slides.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); go(current() - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(current() + 1); }
  });

  let t;
  slides.addEventListener('scroll', () => { clearTimeout(t); t = setTimeout(sync, 90); });
  window.addEventListener('resize', sync);
  sync();
}

/* ---------- lightbox: click any slide photo to see it full size ---------- */
const lb      = document.getElementById('lightbox');
const lbImg   = document.getElementById('lbImg');
const lbCap   = document.getElementById('lbCap');
const lbClose = document.getElementById('lbClose');
const lbPrev  = document.getElementById('lbPrev');
const lbNext  = document.getElementById('lbNext');
const shots   = Array.from(document.querySelectorAll('.slide img'));

let lbIndex = 0;
let lastFocus = null;

function paintLB() {
  const img = shots[lbIndex];
  lbImg.src = img.getAttribute('src');
  lbImg.alt = img.getAttribute('alt') || '';
  const cap = img.closest('.slide').querySelector('figcaption');
  lbCap.textContent = cap ? cap.textContent : '';
}

function openLB(i) {
  lbIndex = i;
  lastFocus = document.activeElement;
  paintLB();
  lb.hidden = false;
  document.body.style.overflow = 'hidden';
  lbClose.focus();
}

function closeLB() {
  lb.hidden = true;
  document.body.style.overflow = '';
  if (lastFocus) lastFocus.focus();
}

function lbStep(n) {
  lbIndex = (lbIndex + n + shots.length) % shots.length;
  paintLB();
}

if (lb && shots.length) {
  shots.forEach((img, i) => {
    img.addEventListener('click', () => openLB(i));
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');
    img.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLB(i); }
    });
  });

  lbClose.addEventListener('click', closeLB);
  lbPrev.addEventListener('click', () => lbStep(-1));
  lbNext.addEventListener('click', () => lbStep(1));
  lb.addEventListener('click', e => { if (e.target === lb) closeLB(); });

  document.addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape')     closeLB();
    if (e.key === 'ArrowLeft')  lbStep(-1);
    if (e.key === 'ArrowRight') lbStep(1);
    if (e.key === 'Tab') {
      const f = [lbClose, lbPrev, lbNext];
      const idx = f.indexOf(document.activeElement);
      e.preventDefault();
      const nxt = e.shiftKey ? idx - 1 : idx + 1;
      f[(nxt + f.length) % f.length].focus();
    }
  });
}
