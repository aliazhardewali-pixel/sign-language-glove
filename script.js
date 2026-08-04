/* =========================================================
   SIGN LANGUAGE TRANSLATOR GLOVE
   Slider controls. The photos are in index.html, so they
   display even if this file never loads.
   ========================================================= */

const slides = document.getElementById('slides');
const prev   = document.getElementById('sPrev');
const next   = document.getElementById('sNext');
const dotBox = document.getElementById('dots');

if (slides) {
  const items = Array.from(slides.querySelectorAll('.slide'));

  /* dots */
  items.forEach((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'dot';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', 'Photo ' + (i + 1));
    b.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
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
    dots.forEach((d, n) => d.setAttribute('aria-selected', n === i ? 'true' : 'false'));
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
