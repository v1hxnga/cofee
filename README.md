# NOIR BEAN

An original specialty coffee brand experience. Roasted for the obsessed.

## Open the website

Double-click `NOIR BEAN.html` in the delivery folder. It is self-contained: images, fonts, 3D rendering, animation libraries, and interaction code are embedded. No server, installation, internet connection, or account is needed to view it in a modern browser.

The editable project is alongside the HTML in this folder. To rebuild it, install Node.js 22 or later, run `npm ci`, then `npm run build`. The resulting standalone page is `dist/index.html`. `npm run preview` serves that file locally when Python 3 is available.

## The experience

- Short skippable opening sequence and oversized editorial typography.
- Procedural 3D coffee beans, PBR materials, warm lighting, and cursor response.
- Origin landscape with parallax, technical bean annotations, and animated roast profile.
- Six-phase cinematic ritual: espresso pour, cream collision, overhead swirl, floating cup and steam, then a package handoff.
- Scroll-driven desktop product gallery and native swipe gallery on phones.
- Three original package designs, product detail panels, and downloadable brew recipes.
- Expanding café imagery, fullscreen navigation, and curtain transitions.
- Keyboard-operable dialogs, focus return, skip link, touch layouts, and reduced-motion support.
- A footer motion switch, saved locally on the device.

## Architecture

This edition uses HTML, CSS, modular JavaScript, Three.js, GSAP / ScrollTrigger, Lenis, and esbuild. A standalone static architecture was selected in place of Next.js so the requested Desktop file opens directly and works offline. No React runtime or server is necessary for this presentation-led experience.

`src/index.html` — semantic page template and brand copy
`src/styles.css` — responsive visual system
`src/main.js` — navigation, animation, gallery, dialogs, brew recipes
`src/beans.js` — procedural geometry, materials, and adaptive rendering
`src/ritual-timeline.js` — one scrubbed chapter timeline, typography, pinning, lifecycle
`src/ritual-scene.js` — shared-renderer camera, lighting, steam, beans
`src/ritual-cup.js` — ceramic cup and shader-distorted crema
`src/ritual-liquids.js` — reversible spline streams, splash sheets, instanced droplets
`src/ritual.css` — chapter-specific responsive styles
`assets` — original concept photography and crema texture
`build.mjs` — creates a single portable HTML file

## Content status

NOIR BEAN is fictional. Products, prices, tasting profiles, origin specifications, café plans, and planned opening hours are illustrative editorial content. The site takes no orders, bookings, subscriptions, or payments. A real location and opening date are intentionally not invented. Replace this information before a commercial launch. The reference video mentioned in the supplied brief was not attached.

Photography was generated with the built-in image-generation tool. These images are conceptual and are not documentary evidence of a particular farm or café. Full prompts are included in `ASSET-PROMPTS.md`.

## Performance and access

The final HTML is about 4.64 MB. It embeds compressed photographs and local WOFF2 fonts, contains no runtime network requests, uses one shared WebGL renderer, caps pixel density, reduces rendering frequency on phones, and suspends rendering off-screen. Systems without WebGL get a CSS-rendered bean. Reduced motion removes the opening animation, smooth scrolling, pinned gallery, and ongoing bean movement; the ritual becomes an original photographic composition with readable copy. No analytics or tracking are included.

The single-file format trades some image reuse/compression efficiency for easy offline distribution. For a hosted commercial deployment, images and scripts can be served as separate cached files. The screenshot-based review is not a measured Core Web Vitals or real-device performance benchmark.

## Recovered edition 1.1.1

Recovered on 16 October 2026 from `/Users/vihangainduwara/Documents/Codex/2026-10-15/do-x20/work/noir-bean`. The October 15 cinematic source was retained, then its unfinished QA was completed. No reconstruction was required. Recovery fixes preserve the current story position across resizing, improve tablet framing, separate the caption at short desktop heights, and support rebuilding from folder names containing spaces.

The ritual uses the existing renderer and smooth-scroll instance. Its 3D scene initializes near the viewport; geometry is driven by normalized scroll progress, with only steam continuing when the visitor pauses. Phone/tablet rendering uses a lower pixel-density cap and shorter scroll duration. The dynamic import is bundled into the single file, so initialization is deferred but no extra network request is needed.

Liquids are art-directed procedural meshes and shader distortion, not a physical fluid simulation or a prerecorded reference video. The isolated liquid module can be exchanged for production-rendered media later. No reference video was supplied.

The Desktop project also includes the current machine's installed dependencies, allowing `npm run build` without reinstalling here. For another machine, run `npm ci` to install the appropriate dependency binaries.
