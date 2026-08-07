# Sign Language Translator Glove

Project website for a wearable glove that reads the shape of the hand and turns it into
words — written to a phone over Bluetooth, and spoken aloud through a small speaker.

Built in the Department of Biomedical Engineering, College of Engineering,
University of Duhok (2025–2026), and shown at the 13th Engineering Design Day.

**Live site:** https://aliazhardewali-pixel.github.io/sign-language-glove/

## The glove

| Part | What it does |
| --- | --- |
| Arduino Nano | Reads every sensor and runs the recognition logic |
| Flex sensor × 5 | One per finger — resistance changes with bend angle |
| MPU9250 (9-axis) | Hand orientation and acceleration, over I²C |
| HM-10 Bluetooth LE | Sends the recognized text to a smartphone |
| DFPlayer Mini + speaker | Speaks the recognized word aloud |
| MicroSD card | Holds the audio files for the DFPlayer |
| Li-ion battery (3.7 V, 700 mAh) | Around seven hours of use per charge |
| MT3608 boost converter | Steps the battery up to a steady 5 V |

Each sensor reading is compared against a calibrated range. When all of them fall inside
the range recorded for one gesture, that gesture is recognized and sent to both outputs at
once. The glove has a word mode (Hello, Yes, No, Stop, Wait, How are you?) and a letter
mode (six ASL letters), and switches between them with a gesture rather than a button.

## This repository

A static site — no build step, no dependencies. Every file is served as-is by GitHub Pages
from the repository root.

| File | Purpose |
| --- | --- |
| `index.html` | The whole page. English copy lives here. |
| `style.css` | All styling, including the right-to-left rules for Arabic. |
| `script.js` | Photo slider and lightbox. |
| `i18n.js` | Arabic strings and the English/Arabic switcher. |
| `schematic.*`, `shot-*.webp`, `glove-*.*`, `poster-*.webp`, `logo-*` | Images. |

The written report is deliberately **not** kept in this repository. It is sent on
request — the site carries an email link for that. Please do not commit it here.

### Running it locally

Open `index.html` in a browser, or serve the folder so relative paths behave exactly as
they do in production:

```bash
python -m http.server 8000
```

Then visit http://localhost:8000.

### Editing the text

English copy is written directly in `index.html`. Every translatable element carries a
`data-i18n="key"` attribute; `i18n.js` captures the English on load and swaps in the
matching Arabic string from its `AR` table when the reader picks العربية.

To change or add a line:

1. Edit the English in `index.html`.
2. Edit the Arabic under the same key in `i18n.js`.
3. Bump the `?v=` number on the `<script>`/`<link>` tags in `index.html` so browsers pick
   up the new file instead of a cached copy.

Keys must exist in both places — an element with a `data-i18n` key that `AR` does not have
simply stays in English when the page is switched.

## The team

- **Abdulqader Masood** — Biomedical Engineering student
- **Zaid Mahdi** — Biomedical Engineering student
- **Dr. Soleen Jaladet Al-Sofi** — supervisor, Department of Biomedical Engineering; the
  project was her suggestion

The full report is available on request — see the contact links on the site.
