# Validation — 16 October 2026 — version 1.1.1

## Story and result

The retained six-phase coffee ritual flows from the roast chapter through espresso, cream, overhead swirl, floating cup/steam, and expanding light-disc/package reveal into the existing coffee collection. It uses the existing shared WebGL renderer. This is a self-contained static site: there is no API, database, authentication, or server-side data flow.

- Production build passed: `npm run build`, standalone `dist/index.html`, approximately 4.64 MiB.
- `npm run verify` passed: inline JavaScript parses; all embedded image/font tokens resolve; no remote runtime script/image/font references; all sections and three products exist; six ritual phases occur between roast and collection.
- Desktop and mobile liquid geometry remains finite at 101 points across the timeline; reverse scrubbing returns exactly the same geometry.
- Visual review covered 1920×1080, 1440×900, 1366×768, 768×1024, 430×932, and 390×844. No horizontal page overflow was observed.
- Forward, reverse, quick scrolling, pause, dark opening, liquid ribbons/droplets, overhead swirl, floating cup, steam, and final package reveal were exercised.
- Resizing desktop to phone preserved normalized story progress at 0.6351. Tablet framing was corrected so the cup remains fully visible.
- Only one WebGL canvas was present during the ritual.
- Motion OFF shows a readable photographic ritual, removes both pinned sections, and hides the opening-color overlay. Static ritual → collection → Night Bloom details passed.
- The JavaScript prefers-reduced-motion branch was tested with an isolated fixture simulating matchMedia: initial reduced preference skipped the intro and produced a static ritual with zero pins; live preference changes normal → reduced restored then removed both pins. The saved user preference was ON, confirming system reduction takes precedence.
- Animated final handoff reached phase 6, displayed the Night Bloom package, and the skip-to-coffee link opened the collection. Night Bloom details and Escape dismissal worked.
- Final workspace browser console check returned zero warnings/errors.
- All existing source and original imagery are retained. No scene reconstruction or replacement was performed.

## Verification limits

The in-app browser blocks file:// navigation, so direct-from-disk execution was not exercised there; the self-contained production HTML was tested through local HTTP. The browser does not expose media-feature emulation, so the OS preference branch was tested via an isolated matchMedia fixture rather than changing macOS settings. Native CSS media-query handling was reviewed in source. No physical-device Safari/Chrome tests or measured Core Web Vitals scores are claimed. The fixture is excluded from the delivered project.

Liquids are procedural art-directed meshes and shader distortion, not physical fluid simulation. No reference video was attached to the supplied brief.

## Independent Desktop verification

- All 1,704 initially copied project files matched SHA-256 checksums, including installed dependencies.
- Ran `npm run build` and `npm run verify` from `/Users/vihangainduwara/Desktop/NOIR BEAN`; both passed. The Desktop-generated HTML was byte-identical to the recovered project's build.
- Stopped the workspace HTTP server; started `npm run preview` from the Desktop folder. Browser received the Desktop dist/index.html.
- Desktop build showed the overhead swirl at phase 4 with one shared canvas, no horizontal overflow, then the complete phase 6 package reveal at progress 1.0000.
- Skip-to-coffee → Night Bloom product details passed on this Desktop-served copy. Console returned zero warnings/errors.
- Old Desktop HTML and source ZIP were copied before replacement; backup bytes were verified and hashes saved in BACKUP-SHA256.json.
- Final source ZIP integrity was checked.
