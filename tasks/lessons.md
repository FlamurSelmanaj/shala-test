# Lessons

## Frontend (kann.de clone)

- **"Like a slider" ≠ overlay arrow buttons.** When the user asks a strip to
  behave "like a slider", default to a **native horizontal scrollbar** (styled
  `::-webkit-scrollbar*` with `::-webkit-scrollbar-button` arrows) rather than
  custom floating `‹ ›` buttons + `viewChild`/`scrollBy` JS. It's less code, no
  JS, keyboard + touch + trackpad for free. Only add custom controls if the user
  explicitly wants them.
  - Applied in `frontend/src/app/components/category-grid/`.

- **Every section component needs `:host { display: block; }`.** A custom element
  defaults to `display: inline`; an inline host around an `overflow-x` scroller
  produces a stray scrollbar / baseline gap. Only `app-root` had it — added to all
  11 section components.

- **Verify frontend CSS in the JS bundle, not `dist/**/*.css`.** With
  `@angular/build:application` + emulated encapsulation, component styles are
  inlined as strings in `main-*.js`. Global `styles.scss` is the only real `.css`.
  Grep `dist/frontend/browser/main-*.js` for compiled component rules.

- **Constraints:** never run `ng serve` / `ng test` (see `CLAUDE.md`); a change is
  "done" once `npm run build` is green with no budget warning. `app.spec.ts` is
  intentionally stale and must stay untouched.

- **This app is zoneless** (no `zone.js` in `package.json`, no `provideZoneChangeDetection`).
  So a plain method/function call in a template *is* reactive as long as it reads a
  signal during evaluation. i18n uses this: `TranslationService.t` is a bound arrow
  field that reads `lang()` + `content.translations()`; components do
  `protected readonly t = inject(TranslationService).t` and `{{ t('key') }}` — no pipe,
  re-renders on language switch and on localdb load. Prefer this over an impure pipe.

- **All site content lives in `frontend/public/localdb.json`** (`translations.{de,en,sq}` +
  `content.*`), loaded once by `provideAppInitializer(() => inject(ContentService).load())`.
  Bootstrap waits for the fetch, so the first render + first route title already have data.
  Components read `inject(ContentService).<signal>()` — never hardcode content or image
  URLs in `.ts`/`.html` again. Image values in the JSON are full `https://www.kann.de/...`
  URLs (the old `shared/asset.ts` `ASSET` const is gone).
  - **Served by json-server**: `npm run api` (frontend) → `json-server --watch
    public/localdb.json --port 3001` (backend owns :3000). `ContentService.load()` tries
    `http://localhost:3001/db`, then falls back to the bundled `localdb.json` asset, then
    `EMPTY_DB`. The one file is both the static asset and the json-server db.

- **Killing a stray process on Windows/Git Bash:** `pkill -f <name>` often silently fails
  to match Windows process command lines. Do NOT fall back to `taskkill //F //IM node.exe`
  — it kills *every* node process, including the user's backend/editor. Use
  `taskkill //F //PID <pid>` with a PID from `netstat -ano | grep :<port>`, or run the
  server with `run_in_background` so the harness owns its lifecycle.
