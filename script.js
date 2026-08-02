/* =========================================================
   SIGN LANGUAGE TRANSLATOR GLOVE
   Lightbox only. The photos themselves live in index.html,
   so they display even if this file fails to load.
   ========================================================= */

const CAPTIONS = [
  'The complete system as worn — sensors on the hand, electronics on the forearm.',
  'One flex sensor per finger, wiring gathered at the wrist.',
  'Everything is visible through the case: Nano, Bluetooth, boost converter, battery.'
];

const shots   = Array.from(document.querySelectorAll('.shot'));
const lb      = document.getElementById('lightbox');
const lbImg   = document.getElementById('lbImg');
const lbCap   = document.getElementById('lbCap');
const lbClose = document.getElementById('lbClose');
const lbPrev  = document.getElementById('lbPrev');
const lbNext  = document.getElementById('lbNext');

let lbIndex = 0;
let lastFocus = null;

function paintLB() {
  const img = shots[lbIndex].querySelector('img');
  lbImg.src = img.getAttribute('src');
  lbImg.alt = img.getAttribute('alt');
  lbCap.textContent = CAPTIONS[lbIndex] || '';
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
  lbIndex = (lbIndex + n + shots.length) % shots.length;
  paintLB();
}

if (lb && shots.length) {
  shots.forEach((btn, i) => btn.addEventListener('click', () => openLB(i)));

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
