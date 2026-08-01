/* =========================================================
   SIGN LANGUAGE TRANSLATOR GLOVE — interactions
     1. Sign data
     2. The decoder
     3. Gallery + lightbox
   No libraries. Plain JavaScript.
   ========================================================= */

/* ---------- 1. SIGN DATA ----------
   fingers = [thumb, index, middle, ring, pinky]
   1 = extended, 0 = curled.
   This is a simplified picture of the hand shape, not sensor output.
*/
const SIGNS = {
  word: [
    { en:'Hello',        ku:'Silav',      meaning:'Greeting',            fingers:[1,1,1,1,1] },
    { en:'Yes',          ku:'Bele',       meaning:'Affirmative',         fingers:[0,0,0,0,0] },
    { en:'No',           ku:'Nexer',      meaning:'Negative',            fingers:[1,1,1,0,0] },
    { en:'Stop',         ku:'Raweste',    meaning:'Request to stop',     fingers:[1,1,1,1,1] },
    { en:'Wait',         ku:'Cavere Be',  meaning:'Request to wait',     fingers:[1,1,1,1,1] },
    { en:'How are you?', ku:'Çawa yî?',   meaning:'Asking after someone',fingers:[1,0,0,0,1] }
  ],
  letter: [
    { en:'D', ku:'D', meaning:'ASL letter D', fingers:[0,1,0,0,0] },
    { en:'E', ku:'E', meaning:'ASL letter E', fingers:[0,0,0,0,0] },
    { en:'L', ku:'L', meaning:'ASL letter L', fingers:[1,1,0,0,0] },
    { en:'V', ku:'V', meaning:'ASL letter V', fingers:[0,1,1,0,0] },
    { en:'W', ku:'W', meaning:'ASL letter W', fingers:[0,1,1,1,0] },
    { en:'Y', ku:'Y', meaning:'ASL letter Y', fingers:[1,0,0,0,1] }
  ]
};

const FINGER_NAMES = ['Thmb','Idx','Mid','Ring','Pnky'];

/* ---------- 2. THE DECODER ---------- */
const chipBox  = document.getElementById('chips');
const fingerBox= document.getElementById('fingers');
const elEn     = document.getElementById('r-en');
const elKu     = document.getElementById('r-ku');
const elMeta   = document.getElementById('r-meta');
const elNote   = document.getElementById('r-note');
const modeBtns = document.querySelectorAll('.mode');

let mode = 'word';

/* Build the five bars once. */
FINGER_NAMES.forEach(name => {
  const f = document.createElement('div');
  f.className = 'finger';
  f.innerHTML = `<div class="bar"></div><span class="lbl">${name}</span>`;
  fingerBox.appendChild(f);
});
const bars = [...fingerBox.querySelectorAll('.finger')];

/* Any other sign in the same mode with an identical finger pattern. */
function twins(sign){
  return SIGNS[mode]
    .filter(s => s !== sign && s.fingers.join('') === sign.fingers.join(''))
    .map(s => s.en);
}

function show(sign){
  elEn.textContent = sign.en;
  elKu.textContent = sign.ku;
  elMeta.textContent = mode === 'word'
    ? sign.meaning + ' \u00B7 sent as text and spoken aloud'
    : sign.meaning + ' \u00B7 added to the spelled word';

  bars.forEach((f, i) => {
    const extended = sign.fingers[i] === 1;
    f.classList.toggle('ext', extended);
    f.querySelector('.bar').style.height = extended ? '100%' : '32%';
  });

  const same = twins(sign);
  elNote.textContent = same.length
    ? `Identical finger pattern to ${same.join(' and ')}. The flex sensors alone cannot separate these — the MPU9250 tells them apart by hand orientation and motion.`
    : '';
}

function renderChips(){
  chipBox.innerHTML = '';
  SIGNS[mode].forEach((sign, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip' + (i === 0 ? ' on' : '');
    b.textContent = sign.en;
    b.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
    b.addEventListener('click', () => {
      chipBox.querySelectorAll('.chip').forEach(c => {
        c.classList.remove('on');
        c.setAttribute('aria-pressed', 'false');
      });
      b.classList.add('on');
      b.setAttribute('aria-pressed', 'true');
      show(sign);
    });
    chipBox.appendChild(b);
  });
  show(SIGNS[mode][0]);
}

modeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    mode = btn.dataset.mode;
    modeBtns.forEach(b => {
      const on = b === btn;
      b.classList.toggle('on', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    renderChips();
  });
});

renderChips();

/* ---------- 3. GALLERY + LIGHTBOX ---------- */
const PHOTOS = [
  { file:'glove-01', alt:'The glove worn on a raised hand, with the clear electronics enclosure strapped to the forearm and its red power light on.',
    cap:'The complete system as worn — sensors on the hand, electronics on the forearm.' },
  { file:'glove-02', alt:'Front view of the worn glove and forearm enclosure against a pale wall.',
    cap:'The enclosure keeps the wiring off the hand so the fingers stay free.' },
  { file:'glove-03', alt:'Close view of the back of the glove showing the flex sensors running along each finger and the wiring gathered at the cuff.',
    cap:'One flex sensor per finger, wiring gathered at the wrist.' },
  { file:'glove-04', alt:'The glove with the hand open, showing all five flex sensors including the one on the thumb.',
    cap:'The thumb sensor sits differently from the rest — and needed its own calibration.' },
  { file:'glove-05', alt:'The glove and enclosure seen at an angle, with the internal boards and wiring visible through the clear case.',
    cap:'Everything is visible through the case: Nano, Bluetooth, boost converter, battery.' },
  { file:'glove-06', alt:'The full arm raised with glove and enclosure, photographed against a curtain.',
    cap:'Worn and ready — the whole system runs about seven hours per charge.' }
];

const gallery = document.getElementById('gallery');
PHOTOS.forEach((p, i) => {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'shot';
  b.setAttribute('aria-label', 'Open photo ' + (i + 1) + ': ' + p.cap);
  b.innerHTML =
    `<picture>
       <source srcset="assets/img/${p.file}.webp" type="image/webp">
       <img src="assets/img/${p.file}.jpg" loading="lazy" alt="${p.alt}">
     </picture>`;
  b.addEventListener('click', () => openLB(i));
  gallery.appendChild(b);
});

const lb      = document.getElementById('lightbox');
const lbImg   = document.getElementById('lbImg');
const lbCap   = document.getElementById('lbCap');
const lbClose = document.getElementById('lbClose');
const lbPrev  = document.getElementById('lbPrev');
const lbNext  = document.getElementById('lbNext');
let lbIndex = 0;
let lastFocus = null;

function paintLB(){
  const p = PHOTOS[lbIndex];
  lbImg.src = `assets/img/${p.file}.jpg`;
  lbImg.alt = p.alt;
  lbCap.textContent = p.cap;
}
function openLB(i){
  lbIndex = i;
  lastFocus = document.activeElement;
  paintLB();
  lb.hidden = false;
  document.body.style.overflow = 'hidden';
  lbClose.focus();
}
function closeLB(){
  lb.hidden = true;
  document.body.style.overflow = '';
  if (lastFocus) lastFocus.focus();
}
function step(n){
  lbIndex = (lbIndex + n + PHOTOS.length) % PHOTOS.length;
  paintLB();
}

lbClose.addEventListener('click', closeLB);
lbPrev.addEventListener('click', () => step(-1));
lbNext.addEventListener('click', () => step(1));
lb.addEventListener('click', e => { if (e.target === lb) closeLB(); });

document.addEventListener('keydown', e => {
  if (lb.hidden) return;
  if (e.key === 'Escape')     closeLB();
  if (e.key === 'ArrowLeft')  step(-1);
  if (e.key === 'ArrowRight') step(1);
  if (e.key === 'Tab'){
    // keep focus inside the viewer while it is open
    const focusable = [lbClose, lbPrev, lbNext];
    const idx = focusable.indexOf(document.activeElement);
    e.preventDefault();
    const next = e.shiftKey ? idx - 1 : idx + 1;
    focusable[(next + focusable.length) % focusable.length].focus();
  }
});
