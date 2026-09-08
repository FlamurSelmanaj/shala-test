# Sample POST request bodies

Ready-to-paste JSON for every `POST` endpoint, matching the actual Zod validation
schemas. Use these in Swagger UI (`/api/docs`) "Try it out" boxes or with `curl -d`.

Notes:
- Anywhere an id (`categoryId`, `pageId`, `mediaId`, etc.) appears, swap in a real id
  returned from a prior request — these are foreign-key references, not free text.
- Every `translations` array needs at least one entry; `en` is the safest bet given
  the locale fallback rules (missing `sq` falls back to `en`, not the other way around).
- `POST /admin/media` is `multipart/form-data` (file upload), not JSON — see the note
  at the bottom instead of a JSON body.

---

## `POST /auth/login`
Public, rate-limited.

```json
{
  "email": "admin@example.com",
  "password": "change-me-please"
}
```

---

## `POST /admin/categories`

```json
{
  "slug": "pflastersteine-gestaltung",
  "icon": "paver-icon.svg",
  "sortOrder": 0,
  "isActive": true,
  "translations": [
    { "locale": "en", "name": "Design Pavers", "description": "Creative paving stones for outdoor design", "metaTitle": "Design Pavers", "metaDescription": "Explore our range of design paving stones." },
    { "locale": "sq", "name": "Guralecë Dizajni", "description": "Guralecë krijues për dizajn të jashtëm", "metaTitle": "Guralecë Dizajni", "metaDescription": "Eksploroni gamën tonë të guralecëve të dizajnit." }
  ]
}
```

---

## `POST /admin/products`
Replace `categoryId` with a real id from the response above.

```json
{
  "sku": "ADINA-001",
  "slug": "adina",
  "categoryId": 1,
  "facetValues": {
    "surface_finish": ["fein_gestockt"],
    "slip_resistance": "r11",
    "is_frost_resistant": true,
    "recycled_content_percent": 20
  },
  "sortOrder": 0,
  "isActive": true,
  "translations": [
    { "locale": "en", "name": "Adina", "shortDescription": "Elegant textured paver", "description": "A premium concrete paver with a fine-stocked surface finish, ideal for driveways and patios." },
    { "locale": "sq", "name": "Adina", "shortDescription": "Guralec elegant me teksturë", "description": "Një guralec betoni premium me finish sipërfaqësor fin, ideal për hyrje dhe tarraca." }
  ]
}
```

---

## `POST /admin/products/{id}/images`
`mediaId` must reference a file already uploaded via `POST /admin/media`.

```json
{
  "mediaId": 1,
  "sortOrder": 0,
  "isPrimary": true
}
```

---

## `POST /admin/attributes`

```json
{
  "key": "slip_resistance",
  "type": "SELECT",
  "isFilterable": true,
  "sortOrder": 0,
  "translations": [
    { "locale": "en", "label": "Slip Resistance", "helpText": "Rated R9 (least slip-resistant) to R13 (most slip-resistant)" },
    { "locale": "sq", "label": "Rezistenca ndaj Rrëshqitjes", "helpText": "Vlerësuar nga R9 (më pak rezistent) deri R13 (më rezistent)" }
  ]
}
```

---

## `POST /admin/attributes/{id}/options`

```json
{
  "value": "r11",
  "sortOrder": 0,
  "translations": [
    { "locale": "en", "label": "R11" },
    { "locale": "sq", "label": "R11" }
  ]
}
```

---

## `POST /admin/pages`

```json
{
  "slug": "about-us",
  "isActive": true,
  "translations": [
    { "locale": "en", "title": "About Us", "metaTitle": "About Us", "metaDescription": "Learn more about our company." },
    { "locale": "sq", "title": "Rreth Nesh", "metaTitle": "Rreth Nesh", "metaDescription": "Mësoni më shumë rreth kompanisë sonë." }
  ]
}
```

---

## `POST /admin/pages/{id}/blocks`
Example for a `HERO_SLIDER` block. Other known types — `CATEGORY_GRID`, `RICH_TEXT`,
`PRODUCT_NEWS_TEASER`, `PROCESS_STEPS`, `CTA_BANNER`, `SERVICE_CARDS`,
`MAGAZINE_TEASER` — each have their own `data` shape in
`src/modules/pages/block-types/schemas.ts`. Any other `type` string is accepted as
freeform JSON (not strictly validated).

```json
{
  "type": "HERO_SLIDER",
  "sortOrder": 0,
  "isActive": true,
  "settings": {},
  "translations": [
    { "locale": "en", "data": { "slides": [ { "title": "Creative Outdoor Design", "subtitle": "Discover our paving stone collections", "badge": "New", "imageId": 1 } ] } },
    { "locale": "sq", "data": { "slides": [ { "title": "Dizajn Kreativ i Jashtëm", "subtitle": "Zbuloni koleksionet tona të guralecëve", "badge": "E Re", "imageId": 1 } ] } }
  ]
}
```

---

## `POST /admin/navigation`
Category-linked example:

```json
{
  "linkType": "CATEGORY",
  "categoryId": 1,
  "sortOrder": 0,
  "isActive": true,
  "openInNewTab": false,
  "translations": [
    { "locale": "en", "label": "Products" },
    { "locale": "sq", "label": "Produktet" }
  ]
}
```

External-link example:

```json
{
  "linkType": "EXTERNAL",
  "externalUrl": "https://example.com/careers",
  "sortOrder": 1,
  "translations": [
    { "locale": "en", "label": "Careers" },
    { "locale": "sq", "label": "Karriera" }
  ]
}
```

---

## `POST /admin/footer-columns`

```json
{
  "sortOrder": 0,
  "isActive": true,
  "translations": [
    { "locale": "en", "title": "Company" },
    { "locale": "sq", "title": "Kompania" }
  ]
}
```

---

## `POST /admin/footer-columns/{id}/links`

```json
{
  "sortOrder": 0,
  "linkType": "PAGE",
  "pageId": 1,
  "translations": [
    { "locale": "en", "label": "About Us" },
    { "locale": "sq", "label": "Rreth Nesh" }
  ]
}
```

---

## `POST /admin/users/{id}/change-password`
Self only — the authenticated admin's own id.

```json
{
  "currentPassword": "change-me-please",
  "newPassword": "a-new-strong-password-123"
}
```

---

## `POST /admin/media`
`multipart/form-data`, not JSON — Swagger UI's "Try it out" gives you a file picker
plus a `folder` text field directly. Fields: `file` (image or PDF, max 10MB) and
optional `folder` (e.g. `"products"`).
