# Wonderyear

A single-page site for a fictional year-round children's play centre. The active
season is auto-detected from the visitor's date; clicking **SUMMER · AUTUMN ·
WINTER · SPRING** transforms the whole page in place — a clip-path "Season Bloom"
reveal with a Canvas particle burst, no page reload.

Built with plain **HTML / CSS / JS** — no framework, no runtime dependencies.

## Run

Any static server, e.g.:

```bash
python3 -m http.server 8777
# open http://localhost:8777/index.html
```

## Structure

- `index.html` — markup
- `styles.css` — all styling (CSS custom properties drive seasonal theming)
- `app.js` — season switching, Season Bloom, particles, scroll choreography
- `assets/*.webp` — optimized illustrations (hero, map, adventures, portraits, footers)

## Features

- Date-based season auto-detect; keyboard (← →) and swipe switching
- Season Bloom hero transition + ambient seasonal particles
- Full-width illustrated map with picture-book tooltips
- Scroll-drawn day timeline, staggered reveals, seasonal gradient bands
- Fully responsive (360px → 1920px), WCAG-AA contrast, `prefers-reduced-motion` respected

---

Crafted by [WEBDEVCAVEMAN](https://webdevcaveman.com)
