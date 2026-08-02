/* =========================================================
   SIGN LANGUAGE TRANSLATOR GLOVE
   Gallery + lightbox. No libraries, plain JavaScript.

   To change which photos appear, edit the PHOTOS list below.
   Each entry needs: file (no extension), alt (description for
   screen readers), cap (caption under the photo).
   ========================================================= */

const V = '2';   // bump this number if a replaced image doesn't refresh

const PHOTOS = [
  {
    file: 'glove-01',
    alt:  'The glove worn on a raised hand, with the clear electronics enclosure strapped to the forearm and its red power light on.',
    cap:  'The complete system as worn — sensors on the hand, electronics on the forearm.'
  },
  {
    file: 'glove-03',
    alt:  'Close view of the back of the glove showing the flex sensors running along each finger and the wiring gathered at the cuff.',
    cap:  'One flex sensor per finger, wiring gathered at the wrist.'
  },
  {
    file: 'glove-05',
    alt:  'The glove and enclosure seen at an angle, with the internal boards and wiring visible through the clear case.',
    cap:  'Everything is visible through the case: Nano, Bluetooth, boost converter, battery.'
  }
];

/* ---------- build the gallery ---------- */
const gallery = document.getElementById('gallery');

if (gallery) {
  PHOTOS.forEach((p, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'shot';
    b.setAttribute('aria-label', 'Open photo ' + (i + 1) + ': ' + p.cap);
    b.innerHTML =
      '<picture>' +
        '<source srcset="' + p.file + '.webp?v=' + V + '" type="image/webp">' +
        '<img src="' + p.file + '.jpg?v=' + V + '" loading="lazy" alt="' + p.alt + '">' +
      '</picture>';
    b.addEventListener('click', () => openLB(i));
    gallery.appendChild(b);
  });
}

/* ---------- lightbox ---------- */
const lb      = document.getElementById('lightbox');
const lbImg   = document.getElementById('lbImg');
const lbCap   = document.getElementById('lbCap');
const lbClose = document.getElementById('lbClose');
const lbPrev  = document.getElementById('lbPrev');
const lbNext  = document.getElementById('lbNext');

let lbIndex = 0;
let lastFocus = null;

function paintLB() {
  const p = PHOTOS[lbIndex];
  lbImg.src = p.file + '.jpg?v=' + V;
  lbImg.alt = p.alt;
  lbCap.textContent = p.cap;
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

function step(n) {
  lbIndex = (lbIndex + n + PHOTOS.length) % PHOTOS.length;
  paintLB();
}

if (lb) {
  lbClose.addEventListener('click', closeLB);
  lbPrev.addEventListener('click', () => step(-1));
  lbNext.addEventListener('click', () => step(1));
  lb.addEventListener('click', e => { if (e.target === lb) closeLB(); });

  document.addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape')     closeLB();
    if (e.key === 'ArrowLeft')  step(-1);
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'Tab') {
      const focusable = [lbClose, lbPrev, lbNext];
      const idx = focusable.indexOf(document.activeElement);
      e.preventDefault();
      const next = e.shiftKey ? idx - 1 : idx + 1;
      focusable[(next + focusable.length) % focusable.length].focus();
    }
  });
}
