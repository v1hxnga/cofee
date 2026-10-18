# Minimal black refinement validation — 18 October 2026

Continued the existing partial edits. The source remains the Desktop NOIR BEAN Git project, connected to v1hxnga/cofee and Vercel coffee.

## Local visual and interaction QA

- Reviewed 1366×768, 1440×900, 1920×1080, 390×844, 430×932 and portrait tablet 820×1180.
- Document scrollWidth matched clientWidth at all sampled layouts: 1351, 1425, 1905, 375, 415 and 805px respectively. This browser reserves 15px for its vertical scrollbar. Page scrollX stayed zero.
- Hero, anatomy, roast, ritual stage, menu, footer, transition and body computed backgrounds are rgb(5,5,5). Ritual opening overlay is #000. Grain opacity reduced from .045 to .012.
- Relevant CTA controls computed 999px radii with minimum heights of 44–58px; image cards and package silhouettes remain unchanged.
- Desktop and mobile menus open, navigate and close. Menu transition is black. Coffee detail dialog remains legible and independently scrollable; mobile dialog scrollWidth/clientWidth both 330px. Recipe action remains a pill.
- Mobile gallery advances to Slow Burn at scrollLeft 375px while page scrollX remains zero. Touch/zoom restrictions and Lenis configuration are unchanged.
- Ritual opening, collision, overhead swirl, final handoff, forward/reverse and fast scroll visually checked. Reverse returned to collision progress .3711 after handoff .9517. No orange flash observed.
- Tablet resize preserved ritual progress .3635. Visual inspection found the tablet hero bean crowded the last headline line; a portrait-tablet-only CSS adjustment gives it separate space. Retested successfully.
- Motion OFF renders the static ritual and readable CTA; Motion ON restores animation.
- Console warning/error logs empty after interactions and motion toggling.
- npm run build and npm run verify pass: inline script parses, embedded assets resolve, accessibility hooks/sections remain, all six phases present, geometry finite and reverse liquid geometry deterministic.
- No new input cancellation or scroll container was introduced. Browser wheel bursts and responsive viewport overrides were used; this is not physical-device pinch/touch or OS gesture testing.

Existing historical validation follows below. Production deployment is verified separately after the commit; its SHA is available in Git history.

---

# Horizontal containment validation — 17 October 2026

## Findings and changes

No partial edits were present on resume; the working tree started at d586549. The supplied recording shows the browser/Space sliding away to reveal the macOS Desktop. That OS-level transition is distinct from webpage scrolling and cannot be reliably intercepted by website code.

No genuine document-level horizontal overflow was reproduced before the fix: document scrollWidth matched the viewport at inspected desktop/mobile states, including the expanding disc. Wider internal bounds were intentional: at 1366px the collection track was 4098px wide and the expanding ritual disc produced 2281px of stage scrollWidth, both already clipped by their wrappers. The hero canvas host and decorative type also extended visually but were clipped by their scene parents. Root overscroll-behavior-x was auto.

The CSS-only defense adds horizontal overscroll suppression on html/body and overflow-x:clip plus width bounds on html/body/main. Clip avoids creating a new scrolling ancestor that would break sticky positioning. Ritual and collection wrappers now use overflow:clip instead of hidden, so they cannot become accidental scroll containers. WebGL hosts clip their contents and canvas CSS width is capped to the host. Mobile coffee/cafe galleries retain native horizontal scrolling with edge chaining contained. No JavaScript, Lenis settings, ScrollTrigger timelines, pointer/touch listeners, viewport zoom settings, typography or design changes were made.

## Browser checks

| Viewport | Document/client width | Page scrollX | Result |
| --- | --- | --- | --- |
| 1366×768 | 1366 / 1366 | 0 | Dark opening, collision, mixed-axis scroll |
| 1440×900 | 1440 / 1440 | 0 | Collision, overhead, mixed-axis scroll |
| 1920×1080 | 1920 / 1920 | 0 | Fast reverse, fast forward, expanded disc, collection transform |
| 390×844 | 390 / 390 | 0 | Mobile ritual, mixed-axis scroll |
| 430×932 | 430 / 430 | 0 | Mobile ritual, native gallery, café, motion off/on |

- Horizontal wheel bursts interleaved with vertical forward/reverse bursts did not move the webpage sideways. Vertical progress continued and sticky-stage top stayed 0 during the active ritual.
- Desktop collection navigation advanced to Slow Burn while the wrapper scrollLeft stayed 0.
- Mobile coffee gallery scrolled to x=430 and x=860 (second/third cards), with the webpage at x=0, including further input at the gallery edge. Café gallery interaction also worked.
- Canvas CSS widths matched their hosts. Oversized typography, the expanded disc, fixed cursor and transformed collection did not expand document width.
- Root overscroll-behavior-y remains auto, main overflow-y remains visible, and touch-action remains auto. Viewport meta remains width=device-width, initial-scale=1. No zoom limit or gesture cancellation was added.
- Motion OFF fallback remains readable and in normal flow; switching ON restores the ritual.
- No orange opening/flash observed. Browser console: zero warnings/errors.
- npm run build and npm run verify passed, including finite liquid geometry and deterministic reverse scrubbing.

## Limits

Browser automation exposes separate horizontal/vertical wheel actions, so aggressive diagonal input was approximated with interleaved mixed-axis bursts, not a physical multitouch trackpad or a single trusted two-axis event. Native pinch and macOS Space gestures were not simulated. CSS overscroll support varies by browser; it can suppress browser-level horizontal boundary effects/history swipes where supported, but it cannot control macOS Space switching. No OS settings or invasive event interception were used.

References: [MDN overscroll-behavior-x](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/overscroll-behavior-x), [MDN overflow-x](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/overflow-x), [Apple trackpad gestures](https://support.apple.com/en-ie/102482).

---

# Validation — 16 October 2026 — version 1.2.0

## Final local review

- Built and served from `/Users/vihangainduwara/Desktop/NOIR BEAN`.
- Visual review passed at 1366×768, 1440×900, 1920×1080, 390×844, 430×932, 768×1024 and 844×390. No horizontal page overflow observed.
- Dark opening, gravity-directed pour, collision, droplets, closer overhead swirl, floating cup, final package reveal and collection handoff reviewed.
- One visual defect found in final QA: nearly collapsed splash sheets intersected the rippling coffee surface during overhead transition. Sheets now sink beneath the surface; the affected frame was rechecked and is clear.
- Forward, reverse and fast scroll pass. Sticky stage stays at top 0 during the chapter; preceding/following sections remain outside the viewport while it is active. No orange flash observed.
- Resizing preserved the same story progress across desktop, phone, tablet and landscape. Mid-sequence reload restored progress 0.5503 and the rendered scene.
- Motion OFF displays readable static artwork, removes pin spacers and restores normal flow into the collection. Motion ON restores the chapter.
- One shared WebGL canvas; final local console returned zero errors and warnings.
- `npm run build` and `npm run verify` pass. Inline assets, JavaScript syntax, section placement, finite desktop/mobile liquid geometry and deterministic reverse geometry checked.

This is browser viewport testing, not physical-device certification or a measured performance benchmark. Liquid geometry is art-directed, not physical fluid simulation. Previous OS preference fixture validation and recovery details remain below as historical evidence.

---

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
