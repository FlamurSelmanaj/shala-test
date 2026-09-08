# Task: Refactor monolithic App into section components

Plan: `C:\Users\Administrator\.claude\plans\keen-forging-steele.md`

## Constraints (CLAUDE.md)
- Do not touch/run/fix frontend tests (`app.spec.ts` left stale, flagged).
- Do not run the app. Verify with `npm run build` only.

## Steps
- [ ] `shared/asset.ts` (ASSET const) + `shared/content.model.ts` (interfaces)
- [ ] Move cross-cutting CSS -> `src/styles.scss` (tokens, headings, .eyebrow, .btn*, .visually-hidden); trim `app.scss` to `:host`
- [ ] `components/site-header/` — menuOpen signal, navItems
- [ ] `components/hero/` — heroSlides, slider timer + next/prev/goToSlide
- [ ] `components/category-grid/` — categories
- [ ] `components/welcome/` — static
- [ ] `components/product-news/` — newsImage
- [ ] `components/process/` — overlayCards
- [ ] `components/resorb/` — resorbImage
- [ ] `components/service/` — serviceCards
- [ ] `components/magazine/` — magazineArticles
- [ ] `components/career-cta/` — careerImage
- [ ] `components/site-footer/` — footerColumns, complianceLinks, socialLinks
- [ ] Rewrite `app.ts` (imports only) + `app.html` (11 `<app-*>` tags)
- [ ] `npm run build` green, no budget warning
- [ ] Grep dist bundle for hero copy / `#001c46` / `kann.de/fileadmin`
- [ ] Fill review section

## Review — DONE

### New structure
```
src/app/
  app.ts (11 imports, no logic) / app.html (11 <app-*> tags in <main>) / app.scss (:host only, 4 lines)
  shared/asset.ts              ASSET const + asset() helper
  shared/content.model.ts      6 interfaces (HeroSlide, Category, OverlayCard, ServiceCard, MagazineArticle, FooterColumn)
  components/
    site-header/  (menuOpen signal, navItems, toggleMenu)
    hero/         (heroSlides, activeSlide signal, OnInit/OnDestroy timer, next/prev/goToSlide, startTimer/stopTimer)
    category-grid/(categories)
    welcome/      (static)
    product-news/ (newsImage)
    process/      (overlayCards)
    resorb/       (resorbImage)
    service/      (serviceCards)
    magazine/     (magazineArticles)
    career-cta/   (careerImage + precomputed background string)
    site-footer/  (footerColumns, complianceLinks, socialLinks)
```
Each component = `.ts` + `.html` + `.scss`, standalone, selector `app-<name>`, class name per repo convention (no `.component` suffix).

### Cross-cutting CSS -> `src/styles.scss`
Design tokens moved from `:host` to `:root`; `h1-h3` typography, `.eyebrow`, `.btn/.btn-primary/.btn-secondary`, `.visually-hidden` now global. Per-section rules + their `@media` fragments live in each component's own scoped `.scss`. `.section-heading` (3 lines) duplicated into the 3 components that use it rather than shared.

### Verification
- `npm run build` — success, **no** `anyComponentStyle` budget warning. `main` 233.7 kB (was 231.4 kB, +1%); `styles.css` 1.4 kB (primitives moved in).
- Bundle grep: all 11 `app-*` selectors compiled; hero copy, "Wir machen deinen Arbeitsplatz", "KANN GmbH Baustoffwerke", "Produktneuheiten 2026" present; `https://www.kann.de` + 32 `/fileadmin/` paths + logo path intact; palette `#001c46`/`#ffee00` + `Roboto Condensed` in `styles.css`.
- Behavior unchanged: slider timing (only prev/goToSlide restart the 6 s timer, next does not — as before), menu toggle, all markup text byte-identical.
- Not run per CLAUDE.md: `ng test`, `ng serve`.

## Follow-up: hero as a real horizontal slider (2026-09-08)

kann.de's hero is a horizontal sliding carousel, not a crossfade. Changed `hero`:
- `hero.html` — slides wrapped in `.hero-track`; `[style.transform]="translateX(-{{active*100}}%)"`. Removed per-slide `.active` class (visibility now by track offset); kept `aria-hidden`, nav buttons, dots, legal line.
- `hero.scss` — `.hero-track` = flex row, `transition: transform .6s ease`. `.hero-slide` now `flex: 0 0 100%; position: relative` (was `position:absolute; inset:0` + opacity fade).
- `hero.ts` — unchanged; `activeSlide` signal + 6 s timer + next/prev/goToSlide still drive it.
- `npm run build` green, no budget warning, `main` 233.77 kB. Bundle contains `hero-track` + `translateX(-`.

## Follow-up: category-grid as a horizontal slider (2026-09-08)

kann.de's product-category block is a horizontal carousel, not a fixed 6-col grid. Changed `category-grid`:
- `category-grid.html` — `.category-track` scroll container + `.cat-nav` prev/next arrows; grid `<a>` -> `.category-item`.
- `category-grid.scss` — `.category-track` = flex + `overflow-x:auto` + `scroll-snap-type:x mandatory`, scrollbar hidden. `.category-item { flex: 0 0 calc(100%/6) }` (1080px -> /3, 640px -> /2). Absolute `.cat-nav` buttons L/R.
- `category-grid.ts` — `viewChild('track')` ElementRef + `scrollBy(dir)` -> `el.scrollBy({ left: dir * clientWidth * 0.8, behavior:'smooth' })`. Native scroll-snap does touch/trackpad for free.
- `npm run build` green, no budget warning. `main` 242.64 kB (was 233.77; +8.9 kB — first use of `viewChild` query infra). Bundle contains `category-track` / `category-slider` / `cat-nav` / `scrollBy`.

## Follow-up: category-grid scrollbar + max-width (2026-09-08)

Reported: visible scroll under the category strip; wants it width-capped like the rest of the page.
- **Root cause of stray scrollbar/gap:** section components had no `:host` display rule — a custom element defaults to `display:inline`, and an inline host wrapping an `overflow-x` scroller is quirk-prone. Added `:host { display: block; }` to **all 11** section components (only `app-root` had it before). Standard Angular hygiene; zero behaviour change.
- **max-width:** `.category-slider` now `max-width: 1180px; margin: 0 auto` — matches `magazine` / `process` / `service` inner-content width. `.category-section` keeps its full-bleed navy background; arrows now align to the 1180 box edges.
- Scrollbar-hiding (`scrollbar-width: none` + `::-webkit-scrollbar{display:none}`) was already compiled correctly and stays.
- `npm run build` green, no budget warning. `main` 243.01 kB. Verified in bundle: 11× `_nghost…{display:block}`, `category-slider…{…max-width:1180px;margin:0 auto}`.

## Follow-up: category-grid — native scrollbar instead of overlay arrows (2026-09-08)

User: remove the `‹ ›` arrows; want a real scrollbar at the bottom with left/right arrow buttons.
- `category-grid.html` — removed both `.cat-nav` buttons and the `.category-slider` wrapper. `.category-track` now carries `max-width: 1180px; margin: 0 auto` and is focusable (`tabindex="0"` for keyboard scroll).
- `category-grid.ts` — removed `viewChild`/`ElementRef`/`scrollBy()`; back to a plain data-only component.
- `category-grid.scss` — dropped scroll-snap + scrollbar-hiding. `overflow-x: scroll` (bar always present). Styled classic bar: `::-webkit-scrollbar{height:16px}`, navy-dark track, rounded translucent thumb, and `::-webkit-scrollbar-button:horizontal:single-button` end buttons with inline-SVG chevrons (`:decrement` left, `:increment` right). Firefox: `scrollbar-color` (FF has no arrow buttons — platform limit, acceptable).
- `npm run build` green, no budget warning. `main` 235.52 kB (was 243.01; −7.5 kB, query infra gone). Bundle: `::-webkit-scrollbar-button…single-button` rules present; 0× `cat-nav` / `scrollBy` / `scroll-snap` / `scrollbar-width:none`.

Lesson captured in `tasks/lessons.md` (prefer native styled scrollbar over custom overlay arrows).

### Flag
- `src/app/app.spec.ts` is now **stale** — its 4th assertion casts `App` to `{ activeSlide, next }`, which moved to `Hero`. Left untouched per CLAUDE.md ("do not touch/run/fix frontend tests"). `ng build` uses `tsconfig.app.json` (excludes `*.spec.ts`) so the build stays green. Recommend redistributing the spec to `hero.spec.ts` / `category-grid.spec.ts` when the test rule is lifted.

