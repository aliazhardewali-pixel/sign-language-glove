/* =========================================================
   SIGN LANGUAGE TRANSLATOR GLOVE — interactions
     1. Sign data
     2. The decoder
     3. Gallery + lightbox
   No libraries. Plain JavaScript.
   ========================================================= */

/* ---------- 1. SIGN DATA ----------
*/
const SIGNS = {
  word: [
    { en:'Hello',        ku:'Silav',      meaning:'Greeting' },
    { en:'Yes',          ku:'Bele',       meaning:'Affirmative' },
    { en:'No',           ku:'Nexer',      meaning:'Negative' },
    { en:'Stop',         ku:'Raweste',    meaning:'Request to stop' },
    { en:'Wait',         ku:'Cavere Be',  meaning:'Request to wait' },
    { en:'How are you?', ku:'\u2013',      meaning:'Asking after someone' }
  ],
  letter: [
    { en:'D', ku:'D', meaning:'ASL letter D' },
    { en:'E', ku:'E', meaning:'ASL letter E' },
    { en:'L', ku:'L', meaning:'ASL letter L' },
    { en:'V', ku:'V', meaning:'ASL letter V' },
    { en:'W', ku:'W', meaning:'ASL letter W' },
    { en:'Y', ku:'Y', meaning:'ASL letter Y' }
  ]
};


function show(sign){
  elEn.textContent = sign.en;
  elKu.textContent = sign.ku;
  elMeta.textContent = mode === 'word'
    ? sign.meaning + ' \u00B7 sent as text and spoken aloud'
    : sign.meaning + ' \u00B7 added to the spelled word';


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
  { file:'glove-03', alt:'Close view of the back of the glove showing the flex sensors running along each finger and the wiring gathered at the cuff.',
    cap:'One flex sensor per finger, wiring gathered at the wrist.' },
  { file:'glove-05', alt:'The glove and enclosure seen at an angle, with the internal boards and wiring visible through the clear case.',
    cap:'Everything is visible through the case: Nano, Bluetooth, boost converter, battery.' }
];

const gallery = document.getElementById('gallery');
PHOTOS.forEach((p, i) => {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'shot';
  b.setAttribute('aria-label', 'Open photo ' + (i + 1) + ': ' + p.cap);
  b.innerHTML =
    `<picture>
       <source srcset="${p.file}.webp" type="image/webp">
       <img src="${p.file}.jpg" loading="lazy" alt="${p.alt}">
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
  lbImg.src = `${p.file}.jpg`;
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
