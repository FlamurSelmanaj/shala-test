# Add multi-page routing to the kann.de clone

## Context

The app is currently a single page: `app.html` renders all 11 section components
directly, and `app.routes.ts` is an empty `Routes` array even though
`provideRouter(routes)` is already wired in `app.config.ts`. The header nav
(`site-header`) links are dead `<a href="#">`.

Goal: turn it into a routed multi-page site — keep the current landing page at `/`,
add the six pages from the header nav plus a 404, and make the nav actually
navigate. Per user: **light pages** (a shared banner + reuse of the existing home
sections that thematically belong to each page — no bespoke filler), **English
slugs**, six nav pages + wildcard 404.

## Target structure

```
src/app/
  app.ts / app.html        -- shell: <app-site-header/> <main><router-outlet/></main> <app-site-footer/>
  app.routes.ts            -- 8 lazy routes (loadComponent) with per-route title
  app.config.ts            -- provideRouter(routes, withInMemoryScrolling(...))
  shared/
    page-hero/ page-hero.{ts,html,scss}   app-page-hero  (PageHero) -- reusable banner
  pages/
    home/          home.{ts,html,scss}          HomePage        '/'
    inspiration/   inspiration.{ts,html,scss}   InspirationPage '/inspiration'
    products/      products.{ts,html,scss}      ProductsPage    '/products'
    public-space/  public-space.{ts,html,scss}  PublicSpacePage '/public-space'
    service/       service.{ts,html,scss}       ServicePage     '/service'
    about/         about.{ts,html,scss}         AboutPage       '/about'   (nav label "KANN")
    careers/       careers.{ts,html,scss}       CareersPage     '/careers'
    not-found/     not-found.{ts,html,scss}     NotFoundPage    '**'
```

Naming follows the repo convention (no `.component` suffix, class = PascalCase of
folder + `Page`, selector `app-<folder>-page`). `pages/service` `ServicePage` does
not collide with the existing `components/service` `Service`.

## Components

### `PageHero` (shared/page-hero) — new, ~30 lines
- Signal inputs (Angular 21): `title = input.required<string>()`,
  `subtitle = input<string>('')`, `image = input<string>('')`.
- Template: `<section class="page-hero" [style.background-image]="...">` with a navy
  gradient overlay, `<h1>{{ title() }}</h1>`, and `@if (subtitle()) { <p> }`.
- SCSS: `:host{display:block}`, navy bg, `min-height: clamp(320px, 42vh, 460px)`,
  white text, reuses global `--navy` / `h1` rules. Well under the 10 kB budget.

### `HomePage` (pages/home) — pure move
- `imports`: the 9 content sections currently in `app.ts` (Hero, CategoryGrid,
  Welcome, ProductNews, Process, Resorb, Service, Magazine, CareerCta).
- Template: the 9 `<app-*>` tags currently inside `<main>` in `app.html`, verbatim.
- No SCSS needed beyond `:host{display:block}`.

### Six nav pages — `PageHero` + reused sections (thematic, "same content as those pages")
Each `.ts` declares a `protected readonly heroImage = ASSET + '/fileadmin/...'`
(reusing `shared/asset.ts`), imports `PageHero` + the sections it shows, and has a
~6-line template. No new content models, no bespoke sections.

| Page | Reused sections (existing `components/*`) | heroImage (existing hotlinked asset) |
|---|---|---|
| InspirationPage | `Welcome`, `Magazine` | Stolberg Vios hero image (already in `hero.ts`) |
| ProductsPage | `CategoryGrid`, `ProductNews` | Vios-Platten greige (already in `hero.ts`) |
| PublicSpacePage | `Resorb`, `Service` | Solarmodulhalter (already in `hero.ts`) |
| ServicePage | `Service`, `Process` | Pheos-Platten (already in `hero.ts`) |
| AboutPage | `Welcome`, `CareerCta` | Zentano antik (already in `hero.ts`) |
| CareersPage | `CareerCta` | reuse the `career-cta` background image |

`subtitle` on each `PageHero` is one plain-German line describing that section
(e.g. Products: "Von Gestaltungspflaster bis Terrassenplatten – das komplette KANN
Sortiment."). This is the only new copy.

### `NotFoundPage` (pages/not-found) — new, tiny
- Imports `RouterLink`. Centered `<section>`: big "404", "Seite nicht gefunden",
  `<a routerLink="/">Zur Startseite</a>` styled as `.btn .btn-primary` (global).

## Routing

### `app.routes.ts`
Replace `[]` with 8 entries, all lazy via `loadComponent`, each with `title`:
```ts
{ path: '',            loadComponent: () => import('./pages/home/home').then(m => m.HomePage),                 title: 'KANN Baustoffwerke' },
{ path: 'inspiration', loadComponent: () => import('./pages/inspiration/inspiration').then(m => m.InspirationPage), title: 'Inspiration | KANN' },
{ path: 'products',    loadComponent: () => import('./pages/products/products').then(m => m.ProductsPage),       title: 'Alle Produkte | KANN' },
{ path: 'public-space',loadComponent: () => import('./pages/public-space/public-space').then(m => m.PublicSpacePage), title: 'Öffentlicher Raum | KANN' },
{ path: 'service',     loadComponent: () => import('./pages/service/service').then(m => m.ServicePage),         title: 'Service | KANN' },
{ path: 'about',       loadComponent: () => import('./pages/about/about').then(m => m.AboutPage),               title: 'KANN' },
{ path: 'careers',     loadComponent: () => import('./pages/careers/careers').then(m => m.CareersPage),         title: 'Karriere | KANN' },
{ path: '**',          loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFoundPage),    title: 'Seite nicht gefunden | KANN' },
```
Angular's default `TitleStrategy` applies `title` automatically — no extra code.

### `app.config.ts`
`provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' }))`
so each navigation starts at the top of the page.

### `app.ts` / `app.html`
- `app.ts` imports drop to `[SiteHeader, SiteFooter, RouterOutlet]`; the 9 section
  imports move to `HomePage`.
- `app.html`:
  ```html
  <app-site-header />
  <main><router-outlet /></main>
  <app-site-footer />
  ```
- `app.scss` unchanged (`:host{display:block;min-height:100vh}`).

### `site-header` (ts + html + scss)
- `.ts`: `navItems` becomes `{ label, path }[]`; add `RouterLink`, `RouterLinkActive`
  to `imports`; add `closeMenu()` → `this.menuOpen.set(false)`.
- `.html`: brand → `<a class="brand" routerLink="/">`; nav →
  `<a [routerLink]="item.path" routerLinkActive="active" (click)="closeMenu()">{{ item.label }}</a>`.
- `.scss`: add `.main-nav a.active { color: var(--yellow); }`.

Footer links stay `href="#"` (out of scope — mostly sub-page links that don't exist).

## Execution order

1. `shared/page-hero/` (3 files).
2. `pages/home/` — move the 9 tags + imports out of `app.ts`/`app.html`.
3. Rewrite `app.ts`, `app.html`; update `app.config.ts`, `app.routes.ts`.
4. Six nav pages + `not-found` (3 files each).
5. `site-header` ts/html/scss.
6. `npm run build`; fix any missing-import / selector errors.
7. Update `tasks/todo.md` review section.

## Verification (per `CLAUDE.md`: build only — no `ng serve`, no `ng test`)

- `cd frontend && npm run build` → succeeds, **no** `anyComponentStyle` budget
  warning.
- Expect **lazy chunks**: one JS chunk per page in `dist/frontend/browser/`
  (`chunk-*.js`), separate from `main`. `main` should get *smaller* (home content
  moves to a lazy chunk).
- Grep `dist/frontend/browser/*.js` for: `router-outlet`, each route path
  (`inspiration`, `public-space`, `careers`, …), `page-hero`, `routerlinkactive`,
  and existing home strings (`Lieblingsplatz Jahreshighlights`) to confirm the
  home page still composes.
- `app.spec.ts` remains untouched/stale (per `CLAUDE.md`); build stays green
  because `tsconfig.app.json` excludes specs.

## Out of scope

- No real per-page content beyond one subtitle line each (user chose the light
  option).
- Footer nav, language switch, search — unchanged.
- No route guards, resolvers, or data loading.
- `app.spec.ts` still not updated (blocked by the "ignore frontend tests" rule).
