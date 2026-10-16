# Cinematic edition 1.2.0 — changes from b3d71ae

## Modified

- `build.mjs`: include editorial styles.
- `package.json`, `package-lock.json`: version 1.2.0.
- `src/index.html`, `src/ritual.html`: editorial layers and chapter counter.
- `src/main.js`: editorial lifecycle, mobile resize handling and page restoration.
- `src/beans.js`: broader studio reflections, adaptive geometry and rendering.
- `src/ritual-timeline.js`: browser-owned sticky bounds, visible opening, first-render poster release and resize preservation.
- `src/ritual.css`: correct dark overlay and sticky-stage layout.
- `src/ritual-cup.js`: softer ceramic and coffee, subtle ripple, crema bubbles.
- `src/ritual-liquids.js`: gravity-directed pours, irregular crown, reversible droplets and submerged settling.
- `src/ritual-scene.js`: camera choreography, portrait/landscape composition, lighting and render efficiency.
- `dist/index.html`, `NOIR BEAN.html`: rebuilt standalone exports.
- `README.md`, `VALIDATION.md`, `CHANGES.md`: current edition and QA record.

## Added

- `src/editorial.css`
- `src/editorial-motion.js`

## Root cause and fix

The opening overlay was explicitly orange (`#9b4d2f`) and fully opaque at the opening. The poster disappeared before the first rendered WebGL frame, leaving a blank entry; the old fixed-pin swap also exposed fractional stage offsets. The overlay is now dark (`#080907`), title/reveal are visible immediately, the poster waits for an actual render, and CSS sticky owns the stage bounds while the single master timeline animates its contents.

The repository, existing Vercel project and original imagery are retained. No new Vercel project or replacement website was created.

---

# File changes compared with the older Desktop source archive

## Modified

- `ASSET-PROMPTS.md`
- `NOIR BEAN.html`
- `README.md`
- `VALIDATION.md`
- `build.mjs`
- `package-lock.json`
- `package.json`
- `src/beans.js`
- `src/index.html`
- `src/main.js`
- `verify.mjs`

## Added to the delivery

- `RECOVERY.md`
- `assets/cafe.png`
- `assets/origin.png`
- `assets/ritual-poster.jpg`
- `assets/ritual-poster.png`
- `assets/ritual-surface.jpg`
- `assets/ritual-surface.png`
- `check.cjs`
- `dist/index.html`
- `previews/NOIR BEAN - Desktop Verified.jpg`
- `previews/NOIR BEAN - Mobile Ritual.jpg`
- `previews/NOIR BEAN - Ritual Preview.jpg`
- `src/ritual-cup.js`
- `src/ritual-liquids.js`
- `src/ritual-scene.js`
- `src/ritual-timeline.js`
- `src/ritual.css`
- `src/ritual.html`
- `CHANGES.md`

Original PNGs and check.cjs were already in the recovered working project but absent from the older portable ZIP. Installed dependencies are included in the Desktop folder and omitted from the source ZIP. No original source was deleted.

## Unchanged original files

- `THIRD-PARTY-NOTICES.md`
- `assets/cafe.jpg`
- `assets/origin.jpg`
- `src/styles.css`
