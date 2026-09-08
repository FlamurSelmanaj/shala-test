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

## Task: DE / EN / SQ translations (2026-09-08)

User: "can you add translations in eng and albanin in frontend".
Choices (AskUserQuestion): **lightweight signal-based i18n service, no new dependency**;
**translate all visible copy**. German stays the default; EN + SQ added; in-page switcher.

### Plan
- **`src/app/i18n/`** — new folder:
  - `lang.ts` — `Lang = 'de'|'en'|'sq'`, `LANGS`, `LANG_LABELS`.
  - `dictionaries/de.ts` — canonical flat key→string map (`as const`); exports `TranslationKey`, `Dictionary`.
  - `dictionaries/en.ts`, `dictionaries/sq.ts` — `: Dictionary` (compile-time key parity).
  - `translation.service.ts` — `providedIn:'root'`; `lang = signal<Lang>()` seeded from `localStorage['kann-lang']`; `setLang()`; arrow `t(key)` reads the signal (reactive in zoneless); `effect()` writes `<html lang>` + localStorage.
  - `translated-title.strategy.ts` — `TitleStrategy` treating `route.title` as a key; `effect()` re-applies on lang change.
  - `index.ts` — barrel.
- **`content.model.ts`** — interface string fields → `*Key: TranslationKey` (HeroSlide, Category, OverlayCard, ServiceCard, MagazineArticle, FooterColumn).
- **Every section component** (`site-header`, `hero`, `category-grid`, `welcome`, `product-news`, `process`, `resorb`, `service`, `magazine`, `career-cta`, `site-footer`, `page-hero`) — inject `t`, replace literal German in template + data arrays with keys.
- **`site-header`** — static `DE / FR` span → 3 `<button>` DE/EN/SQ wired to `setLang()`, active state; nav labels via keys.
- **6 `pages/*`** — `PageHero` inputs become `[title]="t('pages.x.title')"` / `[subtitle]="..."`; `not-found` text via keys.
- **`app.routes.ts`** — `title` values → keys (`title.inspiration`, …).
- **`app.config.ts`** — `{ provide: TitleStrategy, useClass: TranslatedTitleStrategy }`.
- **`index.html`** — leave `lang="de"` (service overrides at runtime).

### Verification
- `npm run build` green, no `anyComponentStyle` budget warning (watch `site-header.scss`).
- Grep `dist/frontend/browser/*.js` for EN + SQ strings (`Product categories`, `Kategoritë e produkteve`), `kann-lang`, title-strategy wiring; confirm templates hold keys not raw German.

### Notes
- Albanian is best-effort translation — worth a native-speaker review.
- Not run per CLAUDE.md: `ng serve`, `ng test`. `app.spec.ts` still stale/untouched.

## Task: localdb.json + dynamic content (2026-09-08)

User: "make a localdb.json and make all the content dynamic".
Choices (AskUserQuestion): **fetched at startup** (not bundled); **all content incl. the
DE/EN/SQ translations live in localdb.json** (single source of truth). Merges with /
supersedes the i18n task above — the typed `dictionaries/*.ts` get folded into the JSON.

### Plan
- **`frontend/public/localdb.json`** — the whole DB:
  - `meta` (languages, defaultLanguage)
  - `translations` { de, en, sq } — every UI string, keyed
  - `content` — logo, nav[], hero[], categories[], processCards[], serviceCards[],
    magazineArticles[], footerColumns[], footerComplianceKeys[], footerSocial[],
    images{productNews,resorb,career}, pages{inspiration,products,publicSpace,service,about,careers}
    (each {titleKey, subtitleKey, heroImage}). Image values are full kann.de URLs.
- **`src/app/content/localdb.model.ts`** — interfaces for the JSON (`LocalDb`, `LocalDbContent`,
  `HeroSlide`, `Category`, `OverlayCard`, `ServiceCard`, `MagazineArticle`, `FooterColumn`,
  `PageContent`). `TranslationKey = string` now (no compile-time key set — the chosen trade-off).
- **`src/app/content/content.service.ts`** — `providedIn:'root'`; `db = signal<LocalDb|null>`;
  `async load()` = `fetch('localdb.json')` → set (falls back to `EMPTY_DB` + `console.error`);
  `computed` getters: `translations`, `meta`, `logo`, `nav`, `hero`, `categories`,
  `processCards`, `serviceCards`, `magazineArticles`, `footerColumns`, `footerComplianceKeys`,
  `footerSocial`, `productNewsImage`, `resorbImage`, `careerImage`, `pages`.
- **`app.config.ts`** — `provideAppInitializer(() => inject(ContentService).load())`;
  keep `{ provide: TitleStrategy, useClass: TranslatedTitleStrategy }`.
- **`i18n/`** — delete `dictionaries/`; `lang.ts` keeps `Lang`, `TranslationKey=string`,
  `LANGS`, `LANG_LABELS`, `isLang`. `translation.service.ts` reads dicts from
  `ContentService.translations()` (still reactive via signal); `t()` = `dicts[lang]?.[k] ?? dicts.de?.[k] ?? k`.
- **All 12 components** — replace local `readonly` data arrays / image consts with
  `inject(ContentService).<signal>`; templates call the signal (`heroSlides()` etc.).
  `career-cta.background` becomes a `computed`.
- **`pages/*` (6)** — `page = computed(() => content.pages().<name>)`;
  `<app-page-hero [title]="t(page().titleKey)" [subtitle]="t(page().subtitleKey)" [image]="page().heroImage" />`.
- **`not-found`** — inject `t`, keys.
- **`app.routes.ts`** — `title` values → keys (`title.inspiration`, …).
- **Delete** `shared/content.model.ts`, `shared/asset.ts` (both fully superseded).

### Done
- `public/localdb.json` (43 KB) — `meta` + `translations.{de,en,sq}` (166 keys each,
  full parity, 0 empty) + `content` (logo, nav×6, hero×6, categories×12, processCards×3,
  serviceCards×3, magazineArticles×3, footerColumns×5, footerComplianceKeys×7,
  footerSocial×3, images×3, pages×6). Image values are full `https://www.kann.de/...` URLs.
- `content/localdb.model.ts` — typed shape (`LocalDb`, `LocalDbContent`, item interfaces,
  `PageName`). `TranslationKey` is now `string` (moved to `i18n/lang.ts`).
- `content/content.service.ts` — `db = signal<LocalDb>(EMPTY_DB)`; `async load()` fetches
  `localdb.json` (`cache:'no-cache'`), `console.error` + keep `EMPTY_DB` on failure;
  `computed` getters for every content slice + `page(name)`.
- `app.config.ts` — `provideAppInitializer(() => inject(ContentService).load())` (bootstrap
  waits for the fetch) + `{ provide: TitleStrategy, useClass: TranslatedTitleStrategy }`.
- `i18n/` — `dictionaries/` deleted; `translation.service.ts` resolves via
  `ContentService.translations()` (signal → `t()` reactive to both DB-load and lang switch);
  `translated-title.strategy.ts` treats `route.title` as a key, re-applies on lang change.
- All 12 components + 6 pages + not-found: local data/image consts replaced with
  `inject(ContentService)` signals; templates call the signals. `career-cta.background`
  is now a `computed`. Header `DE/FR` span → 3 DE/EN/SQ `<button>`s → `TranslationService.setLang`.
- `app.routes.ts` titles → keys. Deleted `shared/content.model.ts`, `shared/asset.ts`.

### Verification (`npm run build`, per CLAUDE.md)
- Build green, **no** `anyComponentStyle` budget warning. `main` 9.70 kB; `home` chunk
  6.56 → 5.35 kB (data left the bundle); 8 lazy route chunks intact.
- `dist/frontend/browser/localdb.json` emitted; valid JSON, 3 langs × 166 keys, exact parity.
- Grep of every `*.js`: **0** content literals (`Lieblingsplatz`, `Gestaltungspflaster`,
  `KANN GmbH Baustoffwerke`, EN `Product categories`, SQ `Kategoritë…` — none present) →
  content is fully dynamic. `localdb.json` / `kann-lang` / `could not load` / `EMPTY_PAGE`
  compiled into the shared chunk.
- Not run per CLAUDE.md: `ng serve`, `ng test`. `app.spec.ts` still stale/untouched.

### Notes
- `TranslationKey` lost compile-time safety (chosen trade-off — keys now live only in JSON).
  Mistyped key → falls back to German, then to the raw key string.
- Albanian strings are best-effort — worth a native-speaker review.
- If `localdb.json` fails to load the site renders with blank text (EMPTY_DB), not a crash.

### Follow-up: serve via json-server (2026-09-08)
User clarification: "using json-server". Choices (AskUserQuestion): json-server as a
**frontend devDependency + `npm run api`**; **fall back to the bundled JSON** when it's down.
- `frontend/package.json` — `json-server@0.17.4` pinned devDep; script
  `"api": "json-server --watch public/localdb.json --port 3001"` (backend already owns :3000).
- `public/localdb.json` is the single file: bundled as a static asset **and** watched by json-server.
- `ContentService.load()` now tries `http://localhost:3001/db` first, then the bundled
  `localdb.json` asset (`fetchDb()` helper returns `null` on failure); `EMPTY_DB` only if both fail.
- Verified: `npm run build` green; `npm run api` up → `GET /db` returns `{meta,translations,content}`
  (166×3 keys, hero 6, categories 12), `GET /translations` resource route works; CORS via the
  `cors` package echoes browser `Origin`. json-server stopped after the check.

## Task: DE / EN / SQ translations (2026-09-08) — folded into the localdb task above

## Task: multi-page routing (2026-09-08)

Plan: `C:\Users\Administrator\.claude\plans\keen-forging-steele.md` (overwritten for this task).
User choices: light pages (banner + reused sections), 6 nav pages + 404, English slugs.

### Done
- **Shell** — `app.ts` now imports `[SiteHeader, RouterOutlet, SiteFooter]` only; `app.html` = header + `<main><router-outlet/></main>` + footer. The 9 home sections moved to `pages/home/`.
- **`shared/page-hero/`** — reusable banner. Signal inputs `title` (required) / `subtitle` / `image`; navy bg + gradient overlay when an image is set; `.eyebrow` recoloured to yellow on the dark bg.
- **`pages/`** — 8 standalone route components (`.ts`+`.html`+`.scss`, selector `app-<name>-page`, `:host{display:block}`):
  - `home` = the 9 existing sections verbatim.
  - `inspiration` = PageHero + Welcome + Magazine
  - `products` = PageHero + CategoryGrid + ProductNews
  - `public-space` = PageHero + Resorb + Service
  - `service` = PageHero + Service + Process
  - `about` (nav label "KANN") = PageHero + Welcome + CareerCta
  - `careers` = PageHero + CareerCta
  - `not-found` (`**`) = 404 block + `routerLink="/"` button (global `.btn`).
  - Each page's `heroImage` reuses an already-hotlinked kann.de asset via `shared/asset.ts` `ASSET`.
- **`app.routes.ts`** — 8 lazy `loadComponent` routes, each with a `title` (Angular default `TitleStrategy` applies it).
- **`app.config.ts`** — `provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' }))`.
- **`site-header`** — `navItems` now `{label,path}[]`; imports `RouterLink`/`RouterLinkActive`; brand + nav use `routerLink`, nav has `routerLinkActive="active"` and `(click)="closeMenu()"`; `.main-nav a.active` style added. Footer links left as `href="#"` (out of scope).

### Verification (`npm run build`, per CLAUDE.md — no `ng serve` / `ng test`)
- Build green, **no** `anyComponentStyle` budget warning.
- Code-splitting confirmed: `main` 9.43 kB (was 235 kB — framework + pages are now lazy/shared chunks). 8 lazy route chunks emitted (`home`, `inspiration`, `products`, `public-space`, `service`, `about`, `careers`, `not-found`).
- Bundle greps: `router-outlet`, `page-hero`, `RouterLinkActive`, `scrollPositionRestoration`/`anchorScrolling` present; route paths `inspiration` / `products` / `public-space` / `careers` / `about` each ×3; route titles (`Alle Produkte | KANN`, `Karriere | KANN`); home still composes (`Lieblingsplatz Jahreshighlights` in the `home` chunk).

### Flag
- `src/app/app.spec.ts` is now **stale** — it references `App` composing the section components directly (they moved to `pages/home/`) and casts `App` to `{ activeSlide, next }` (now on `Hero`). Left untouched per CLAUDE.md ("do not touch/run/fix frontend tests"). `ng build` uses `tsconfig.app.json` (excludes `*.spec.ts`) so the build stays green. Recommend redistributing specs to `pages/home` + `hero` / `category-grid` when the test rule is lifted.

