# Backend build session summary

What we did, in order, building the backend for the kann.de clone.

## 1. Planning

Started from a blank Express 5 + TypeScript scaffold (`src/app.ts` with one health
route, no DB/auth/models) and an Angular frontend that's a hardcoded clone of
kann.de's homepage (no routing/i18n/HTTP wired up yet).

Goal: turn the backend into a small headless CMS —
- JWT-protected admin dashboard (hidden frontend route; the real security boundary
  is the API, not the URL).
- Only the dashboard's login + write operations require auth; every public
  content-read endpoint stays open.
- Content modeled after kann.de's product category pages (hero, breadcrumb, faceted
  filter sidebar, product grid) plus the existing homepage sections.
- Full English (`en`) / Albanian (`sq`) translation support, editable from the
  dashboard.

Explored the target page (`kann.de/produkte/p/pflastersteine-gestaltung/`) and the
existing frontend components (`category-grid`, homepage sections) to ground the
content model in what actually needs to be served.

Architecture decisions made during planning (some via direct back-and-forth, not
just the initial research):
- **MySQL + Sequelize** (not Postgres/Prisma) — your call, overriding the initial
  research recommendation.
- **No Docker**, anywhere — native local MySQL install.
- **Bearer token in `Authorization` header** for JWT delivery (not an httpOnly
  cookie) — simpler CORS, no cookie/CSRF machinery needed.
- **Production target: GoDaddy shared hosting via cPanel** (Node.js Selector /
  Phusion Passenger). This ruled out Docker, PM2, and native npm modules with
  compiled binaries, and shaped several choices below.

Full plan is saved at
`C:\Users\test\.claude\plans\workflow-orchestration-https-www-kann-d-mossy-lamport.md`.

## 2. Tech stack (final)

| Concern | Choice | Why |
|---|---|---|
| DB | MySQL 8, native local install | No Docker; GoDaddy shared hosting doesn't have it either |
| ORM | Sequelize v6 (`sequelize` + `mysql2`) | Your choice; TS via `InferAttributes`/`InferCreationAttributes`, no decorators |
| Migrations | Umzug, not `sequelize-cli` | `sequelize-cli`'s CJS config fights this project's `"type": "module"` + `NodeNext` setup |
| Validation | Zod | Same schemas double as OpenAPI doc source (see §5) |
| JWT | `jsonwebtoken` | Standard, works fine with `esModuleInterop` |
| Password hashing | `bcryptjs` (pure JS) | `argon2`/`bcrypt` ship native binaries that risk failing to build on GoDaddy shared hosting |
| Uploads | `multer` (2.x), local disk | `UPLOAD_DIR` env-configurable; in prod points at `public_html/uploads` so Apache serves files directly, not through Node |
| API docs | `@asteasolutions/zod-to-openapi` + `swagger-ui-express` | Generates the OpenAPI spec straight from the same Zod schemas that validate requests, so docs can't drift |

## 3. What was built

**Config & infra**
- `src/config/env.ts` — Zod-validated `process.env` (fails fast on boot).
- `src/config/constants.ts` — `SUPPORTED_LOCALES = ['en', 'sq']`, `DEFAULT_LOCALE = 'en'`.
- `src/db/connection.ts` — Sequelize instance (`underscored: true` globally, so camelCase model attrs map to snake_case columns automatically).
- `src/lib/` — `errors.ts` (typed `AppError` subclasses), `password.ts`, `jwt.ts`, `pagination.ts`, `translation.ts` (`resolveTranslation()` fallback helper, `assertLocale()`), `http.ts` (`asString()` — Express 5 types route params as `string | string[]`).
- `src/middleware/` — `auth.middleware.ts` (`requireAuth`), `locale.middleware.ts`, `validate.middleware.ts`, `rate-limit.middleware.ts` (login only), `error-handler.middleware.ts`, `not-found.middleware.ts`.

**Database — 25 Sequelize models, 9 migrations** (`src/db/models/`, `src/db/migrations/`)
- Admin, Media + AssetTranslation
- Category + CategoryTranslation, Product + ProductTranslation + ProductImage
- Attribute + AttributeTranslation + AttributeOption + AttributeOptionTranslation + CategoryAttribute (the facet/filter metadata layer for category sidebars)
- Page + PageTranslation, ContentBlock + ContentBlockTranslation (page-builder pattern for the homepage sections)
- NavigationItem + NavigationItemTranslation, FooterColumn/FooterLink + their translations
- SiteSettings + SiteSettingsTranslation (singleton)

i18n pattern: structured entities get a dedicated `*Translation` table (one row per
`(entityId, locale)`); freeform page-block content gets a `data JSON` column per
locale, validated per block `type` (`src/modules/pages/block-types/schemas.ts`).
Public reads resolve `?locale=sq` and fall back to `en` if missing; admin writes do
not silently fall back.

`src/db/migrator.ts` — Umzug runner; `runMigrations()` is called automatically on
every server boot (idempotent, safe — matters for GoDaddy where the app process
restarts often). `src/db/seed.ts` seeds the admin account from `.env` + a
placeholder home page.

**10 feature modules** (`src/modules/`), each with `*.validation.ts` (Zod),
`*.service.ts` (Sequelize queries), `*.controller.ts`, and separate
`*.routes.ts` (public) / `*.admin.routes.ts` (protected) files:
auth, categories, products, attributes, pages (+ `blocks.controller.ts`/`blocks.admin.routes.ts`), navigation, footer, site-settings, media, admin-users.

**Auth boundary**: `requireAuth` is mounted **once**, at `/api/v1/admin`
(`src/routes/admin.routes.ts`) — every route registered under it inherits
protection automatically. Everything else (`src/routes/index.ts`) is public.

**Interactive API docs**: `src/docs/` — `registry.ts` (OpenAPI registry + Bearer
security scheme), `schemas.ts` (shared param/response schemas), `paths.ts` (all 52
endpoints registered, reusing the real validation schemas for request bodies),
`openapi.ts` (document generator). Served at `GET /api/docs` (Swagger UI) and
`GET /api/docs.json` (raw spec) — see `app.ts`.

**Deployment**: `passenger-app.mjs` — the cPanel Passenger startup file; registers
`tsx/esm` then imports `src/server.ts`, so production runs the same TypeScript
source as `npm run dev`, no compiled `dist/` build step to keep in sync.

## 4. Bugs found and fixed along the way

- **`.gitignore`**: the pre-existing `backend/.env.*` / `.env.*` rules were also
  silently excluding `backend/.env.example` (which should be tracked as a
  template). Added a trailing `!backend/.env.example` negation.
- **`src/db/migrator.ts`**: the CLI-invocation check compared `import.meta.url` to
  a hand-built `file://` string, which is wrong on Windows (drive-letter path
  format). `npm run migrate` silently did nothing. Fixed with
  `pathToFileURL(process.argv[1]).href`.
- **`multer`**: the initial pin (`^1.4.5-lts.1`) resolved to a version npm flags
  as vulnerable; bumped to `^2.0.1`.
- Left one `npm audit` finding alone: a transitive `uuid` vulnerability via
  Sequelize. The suggested fix force-downgrades Sequelize to 3.x, which is worse
  than the low-severity, not-actually-exploited-here issue.

## 5. Follow-up change: removed per-locale URL slugs

Originally `CategoryTranslation` and `ProductTranslation` had an optional
per-locale `slug` override (so `/en/design-pavers` could differ from
`/sq/guralece-dizajni`). You asked to remove that — one canonical, English-only
`slug` per Category/Product is enough; only user-visible *content* fields
(name, description, etc.) need to be multi-language, not the URL path.

Removed from: both translation models, both migrations (0003, 0005), both
validation schemas, and the service-layer fallback-lookup-by-translated-slug
logic. Since this was still local placeholder data, the dev DB was dropped,
recreated, migrated, and reseeded rather than layering a churn migration on top.

## 6. Verification performed

- `npm run typecheck` — clean throughout.
- Installed dependencies, confirmed multer 2.x didn't need a matching
  `@types/multer` bump (it type-checked fine as-is).
- With your local MySQL (port 3306) connected: ran all 9 migrations, seeded the
  admin account + placeholder home page.
- Full round trip via `curl`: health check → public content with locale
  fallback → `401` on `/admin/**` without a token → login → `/auth/me` → created
  a category with `en`+`sq` translations → confirmed the public API serves the
  right localized name per `?locale=` while the slug stays identical.
- Verified Albanian special characters (ë, ç) round-trip correctly at the raw
  MySQL byte level (`utf8mb4_0900_ai_ci`) — an earlier garbled-looking result was
  a terminal-encoding artifact from typing the character into a shell command,
  not an app bug.
- Verified the OpenAPI doc generates correctly (52 registered paths, Bearer
  security scheme present, Swagger UI page loads) after both the docs addition
  and the slug removal.
- Cleaned up all test data created during verification; stopped background
  dev-server processes each time.

## 7. Reference files added

- `.env.example` — env var template (now correctly tracked in git).
- `sample-requests.md` — ready-to-paste JSON bodies for every `POST` endpoint.
- This file.

## 8. Suggested next steps

- Change `ADMIN_PASSWORD` in `.env` and re-run `npm run seed` before this goes
  anywhere near a real deployment.
- Decide whether `/api/docs` should be disabled or gated in production (currently
  open in all environments — no secrets exposed, just endpoint shapes).
- Consider an automated test suite (e.g. Vitest + supertest against a test DB) —
  offered but not yet built.
- Frontend work is still untouched: Angular routing, the hidden dashboard UI
  itself, an `HttpClient` auth interceptor for the Bearer token, and an i18n
  library for the static UI chrome (separate from the backend-managed content
  translations built here).
