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
