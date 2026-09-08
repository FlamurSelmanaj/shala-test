import { z } from "zod";
import { registry, BEARER_AUTH } from "./registry.ts";
import {
  idParam,
  slugParam,
  localeParam,
  localeQuery,
  paginationQuery,
  dataEnvelope,
  listEnvelope,
  jsonContent,
  OK_ERROR_RESPONSES,
} from "./schemas.ts";

import { loginSchema } from "../modules/auth/auth.validation.ts";
import {
  createCategorySchema,
  updateCategorySchema,
  upsertCategoryTranslationSchema,
  setCategoryAttributesSchema,
} from "../modules/categories/categories.validation.ts";
import {
  createProductSchema,
  updateProductSchema,
  upsertProductTranslationSchema,
  addProductImageSchema,
} from "../modules/products/products.validation.ts";
import {
  createAttributeSchema,
  updateAttributeSchema,
  upsertAttributeTranslationSchema,
  createAttributeOptionSchema,
  updateAttributeOptionSchema,
  upsertAttributeOptionTranslationSchema,
} from "../modules/attributes/attributes.validation.ts";
import {
  createPageSchema,
  updatePageSchema,
  upsertPageTranslationSchema,
  createBlockSchema,
  updateBlockSchema,
  upsertBlockTranslationSchema,
  reorderBlocksSchema,
} from "../modules/pages/pages.validation.ts";
import {
  createNavigationItemSchema,
  updateNavigationItemSchema,
  upsertNavigationItemTranslationSchema,
  reorderNavigationSchema,
} from "../modules/navigation/navigation.validation.ts";
import {
  createFooterColumnSchema,
  updateFooterColumnSchema,
  upsertFooterColumnTranslationSchema,
  createFooterLinkSchema,
  updateFooterLinkSchema,
  upsertFooterLinkTranslationSchema,
} from "../modules/footer/footer.validation.ts";
import {
  updateSiteSettingsSchema,
  upsertSiteSettingsTranslationSchema,
} from "../modules/site-settings/site-settings.validation.ts";
import { updateMediaSchema, upsertMediaTranslationSchema } from "../modules/media/media.validation.ts";
import { updateAdminUserSchema, changePasswordSchema } from "../modules/admin-users/admin-users.validation.ts";

const security = [{ [BEARER_AUTH]: [] }];
const idAndLocale = idParam.merge(localeParam);
const idAndOptionId = idParam.extend({ optionId: z.coerce.number().int().positive() });
const idOptionIdLocale = idAndOptionId.merge(localeParam);
const idAndImageId = idParam.extend({ imageId: z.coerce.number().int().positive() });
const linkIdParam = z.object({ linkId: z.coerce.number().int().positive() });
const linkIdAndLocale = linkIdParam.merge(localeParam);

// ============================================================
// Health
// ============================================================
registry.registerPath({
  method: "get",
  path: "/health",
  tags: ["Health"],
  summary: "Liveness check",
  responses: { 200: { description: "OK", ...jsonContent(z.object({ status: z.literal("ok") })) } },
});

// ============================================================
// Auth
// ============================================================
registry.registerPath({
  method: "post",
  path: "/auth/login",
  tags: ["Auth"],
  summary: "Log in as an admin",
  description: "Public, rate-limited. Returns a JWT to use as `Authorization: Bearer <token>` on /admin/** routes.",
  request: { body: jsonContent(loginSchema) },
  responses: {
    200: { description: "Login succeeded", ...jsonContent(dataEnvelope(z.object({ token: z.string(), admin: z.record(z.unknown()) }))) },
    401: OK_ERROR_RESPONSES[401],
  },
});

registry.registerPath({
  method: "get",
  path: "/auth/me",
  tags: ["Auth"],
  summary: "Get the currently authenticated admin",
  security,
  responses: { 200: { description: "OK", ...jsonContent(dataEnvelope()) }, 401: OK_ERROR_RESPONSES[401] },
});

// ============================================================
// Categories (public)
// ============================================================
registry.registerPath({
  method: "get",
  path: "/categories",
  tags: ["Categories"],
  summary: "List active categories",
  request: { query: localeQuery.extend({ parentId: z.string().optional().openapi({ description: "Numeric id, or 'null' for top-level categories" }) }) },
  responses: { 200: { description: "OK", ...jsonContent(listEnvelope()) } },
});

registry.registerPath({
  method: "get",
  path: "/categories/{slug}",
  tags: ["Categories"],
  summary: "Get a category by slug, with breadcrumb",
  request: { params: slugParam, query: localeQuery },
  responses: { 200: { description: "OK", ...jsonContent(dataEnvelope()) }, 404: OK_ERROR_RESPONSES[404] },
});

registry.registerPath({
  method: "get",
  path: "/categories/{slug}/attributes",
  tags: ["Categories"],
  summary: "Get the facet/filter sidebar metadata for a category",
  request: { params: slugParam, query: localeQuery },
  responses: { 200: { description: "OK", ...jsonContent(dataEnvelope(z.array(z.record(z.unknown())))) }, 404: OK_ERROR_RESPONSES[404] },
});

registry.registerPath({
  method: "get",
  path: "/categories/{slug}/products",
  tags: ["Categories"],
  summary: "Paginated, filterable product grid for a category",
  description: "Any extra query param matching a facet key (e.g. ?slip_resistance=r11) filters the results.",
  request: { params: slugParam, query: localeQuery.merge(paginationQuery).extend({ sort: z.string().optional() }) },
  responses: { 200: { description: "OK", ...jsonContent(listEnvelope()) }, 404: OK_ERROR_RESPONSES[404] },
});

// ============================================================
// Products (public)
// ============================================================
registry.registerPath({
  method: "get",
  path: "/products/{slug}",
  tags: ["Products"],
  summary: "Get a product by slug",
  request: { params: slugParam, query: localeQuery },
  responses: { 200: { description: "OK", ...jsonContent(dataEnvelope()) }, 404: OK_ERROR_RESPONSES[404] },
});

// ============================================================
// Pages (public)
// ============================================================
registry.registerPath({
  method: "get",
  path: "/pages/{slug}",
  tags: ["Pages"],
  summary: "Get a published page with its ordered, translated content blocks",
  request: { params: slugParam, query: localeQuery },
  responses: { 200: { description: "OK", ...jsonContent(dataEnvelope()) }, 404: OK_ERROR_RESPONSES[404] },
});

// ============================================================
// Navigation / Footer / Site settings (public)
// ============================================================
registry.registerPath({
  method: "get",
  path: "/navigation",
  tags: ["Navigation"],
  summary: "Get the header navigation tree",
  request: { query: localeQuery },
  responses: { 200: { description: "OK", ...jsonContent(dataEnvelope(z.array(z.record(z.unknown())))) } },
});

registry.registerPath({
  method: "get",
  path: "/footer",
  tags: ["Footer"],
  summary: "Get the footer columns and links",
  request: { query: localeQuery },
  responses: { 200: { description: "OK", ...jsonContent(dataEnvelope(z.array(z.record(z.unknown())))) } },
});

registry.registerPath({
  method: "get",
  path: "/site-settings",
  tags: ["Site Settings"],
  summary: "Get global site settings (logo, contact, tagline)",
  request: { query: localeQuery },
  responses: { 200: { description: "OK", ...jsonContent(dataEnvelope()) } },
});

// ============================================================
// Admin: Categories
// ============================================================
registry.registerPath({ method: "get", path: "/admin/categories", tags: ["Categories"], summary: "[Admin] List all categories", security, responses: { 200: { description: "OK", ...jsonContent(dataEnvelope(z.array(z.record(z.unknown())))) }, 401: OK_ERROR_RESPONSES[401] } });
registry.registerPath({ method: "post", path: "/admin/categories", tags: ["Categories"], summary: "[Admin] Create a category", security, request: { body: jsonContent(createCategorySchema) }, responses: { 201: { description: "Created", ...jsonContent(dataEnvelope()) }, 400: OK_ERROR_RESPONSES[400], 401: OK_ERROR_RESPONSES[401] } });
registry.registerPath({ method: "get", path: "/admin/categories/{id}", tags: ["Categories"], summary: "[Admin] Get a category by id", security, request: { params: idParam }, responses: { 200: { description: "OK", ...jsonContent(dataEnvelope()) }, 401: OK_ERROR_RESPONSES[401], 404: OK_ERROR_RESPONSES[404] } });
registry.registerPath({ method: "patch", path: "/admin/categories/{id}", tags: ["Categories"], summary: "[Admin] Update a category", security, request: { params: idParam, body: jsonContent(updateCategorySchema) }, responses: { 200: { description: "OK", ...jsonContent(dataEnvelope()) }, 400: OK_ERROR_RESPONSES[400], 401: OK_ERROR_RESPONSES[401] } });
registry.registerPath({ method: "delete", path: "/admin/categories/{id}", tags: ["Categories"], summary: "[Admin] Delete a category", security, request: { params: idParam }, responses: { 204: { description: "Deleted" }, 401: OK_ERROR_RESPONSES[401] } });
registry.registerPath({ method: "put", path: "/admin/categories/{id}/translations/{locale}", tags: ["Categories"], summary: "[Admin] Upsert one locale's translation", security, request: { params: idAndLocale, body: jsonContent(upsertCategoryTranslationSchema) }, responses: { 200: { description: "OK", ...jsonContent(dataEnvelope()) }, 401: OK_ERROR_RESPONSES[401] } });
registry.registerPath({ method: "put", path: "/admin/categories/{id}/attributes", tags: ["Categories"], summary: "[Admin] Set which facets apply to this category", security, request: { params: idParam, body: jsonContent(setCategoryAttributesSchema) }, responses: { 200: { description: "OK", ...jsonContent(dataEnvelope(z.array(z.record(z.unknown())))) }, 401: OK_ERROR_RESPONSES[401] } });

// ============================================================
// Admin: Products
// ============================================================
registry.registerPath({ method: "get", path: "/admin/products", tags: ["Products"], summary: "[Admin] List products", security, request: { query: paginationQuery.extend({ categoryId: z.coerce.number().optional() }) }, responses: { 200: { description: "OK", ...jsonContent(listEnvelope()) }, 401: OK_ERROR_RESPONSES[401] } });
registry.registerPath({ method: "post", path: "/admin/products", tags: ["Products"], summary: "[Admin] Create a product", security, request: { body: jsonContent(createProductSchema) }, responses: { 201: { description: "Created", ...jsonContent(dataEnvelope()) }, 400: OK_ERROR_RESPONSES[400], 401: OK_ERROR_RESPONSES[401] } });
registry.registerPath({ method: "get", path: "/admin/products/{id}", tags: ["Products"], summary: "[Admin] Get a product by id", security, request: { params: idParam }, responses: { 200: { description: "OK", ...jsonContent(dataEnvelope()) }, 401: OK_ERROR_RESPONSES[401], 404: OK_ERROR_RESPONSES[404] } });
registry.registerPath({ method: "patch", path: "/admin/products/{id}", tags: ["Products"], summary: "[Admin] Update a product", security, request: { params: idParam, body: jsonContent(updateProductSchema) }, responses: { 200: { description: "OK", ...jsonContent(dataEnvelope()) }, 400: OK_ERROR_RESPONSES[400], 401: OK_ERROR_RESPONSES[401] } });
registry.registerPath({ method: "delete", path: "/admin/products/{id}", tags: ["Products"], summary: "[Admin] Delete a product", security, request: { params: idParam }, responses: { 204: { description: "Deleted" }, 401: OK_ERROR_RESPONSES[401] } });
registry.registerPath({ method: "put", path: "/admin/products/{id}/translations/{locale}", tags: ["Products"], summary: "[Admin] Upsert one locale's translation", security, request: { params: idAndLocale, body: jsonContent(upsertProductTranslationSchema) }, responses: { 200: { description: "OK", ...jsonContent(dataEnvelope()) }, 401: OK_ERROR_RESPONSES[401] } });
registry.registerPath({ method: "post", path: "/admin/products/{id}/images", tags: ["Products"], summary: "[Admin] Attach a media image to a product", security, request: { params: idParam, body: jsonContent(addProductImageSchema) }, responses: { 201: { description: "Created", ...jsonContent(dataEnvelope()) }, 401: OK_ERROR_RESPONSES[401] } });
registry.registerPath({ method: "delete", path: "/admin/products/{id}/images/{imageId}", tags: ["Products"], summary: "[Admin] Remove a product image", security, request: { params: idAndImageId }, responses: { 204: { description: "Deleted" }, 401: OK_ERROR_RESPONSES[401] } });

// ============================================================
// Admin: Attributes (facet metadata)
// ============================================================
registry.registerPath({ method: "get", path: "/admin/attributes", tags: ["Attributes"], summary: "[Admin] List facet attributes", security, responses: { 200: { description: "OK", ...jsonContent(dataEnvelope(z.array(z.record(z.unknown())))) }, 401: OK_ERROR_RESPONSES[401] } });
registry.registerPath({ method: "post", path: "/admin/attributes", tags: ["Attributes"], summary: "[Admin] Create a facet attribute", security, request: { body: jsonContent(createAttributeSchema) }, responses: { 201: { description: "Created", ...jsonContent(dataEnvelope()) }, 400: OK_ERROR_RESPONSES[400], 401: OK_ERROR_RESPONSES[401] } });
registry.registerPath({ method: "get", path: "/admin/attributes/{id}", tags: ["Attributes"], summary: "[Admin] Get a facet attribute", security, request: { params: idParam }, responses: { 200: { description: "OK", ...jsonContent(dataEnvelope()) }, 401: OK_ERROR_RESPONSES[401], 404: OK_ERROR_RESPONSES[404] } });
registry.registerPath({ method: "patch", path: "/admin/attributes/{id}", tags: ["Attributes"], summary: "[Admin] Update a facet attribute", security, request: { params: idParam, body: jsonContent(updateAttributeSchema) }, responses: { 200: { description: "OK", ...jsonContent(dataEnvelope()) }, 401: OK_ERROR_RESPONSES[401] } });
registry.registerPath({ method: "delete", path: "/admin/attributes/{id}", tags: ["Attributes"], summary: "[Admin] Delete a facet attribute", security, request: { params: idParam }, responses: { 204: { description: "Deleted" }, 401: OK_ERROR_RESPONSES[401] } });
registry.registerPath({ method: "put", path: "/admin/attributes/{id}/translations/{locale}", tags: ["Attributes"], summary: "[Admin] Upsert one locale's translation", security, request: { params: idAndLocale, body: jsonContent(upsertAttributeTranslationSchema) }, responses: { 200: { description: "OK", ...jsonContent(dataEnvelope()) }, 401: OK_ERROR_RESPONSES[401] } });
registry.registerPath({ method: "post", path: "/admin/attributes/{id}/options", tags: ["Attributes"], summary: "[Admin] Add an option to a SELECT/MULTI_SELECT attribute", security, request: { params: idParam, body: jsonContent(createAttributeOptionSchema) }, responses: { 201: { description: "Created", ...jsonContent(dataEnvelope()) }, 401: OK_ERROR_RESPONSES[401] } });
registry.registerPath({ method: "patch", path: "/admin/attributes/{id}/options/{optionId}", tags: ["Attributes"], summary: "[Admin] Update an attribute option", security, request: { params: idAndOptionId, body: jsonContent(updateAttributeOptionSchema) }, responses: { 200: { description: "OK", ...jsonContent(dataEnvelope()) }, 401: OK_ERROR_RESPONSES[401] } });
registry.registerPath({ method: "delete", path: "/admin/attributes/{id}/options/{optionId}", tags: ["Attributes"], summary: "[Admin] Delete an attribute option", security, request: { params: idAndOptionId }, responses: { 204: { description: "Deleted" }, 401: OK_ERROR_RESPONSES[401] } });
registry.registerPath({ method: "put", path: "/admin/attributes/{id}/options/{optionId}/translations/{locale}", tags: ["Attributes"], summary: "[Admin] Upsert one locale's translation for an option", security, request: { params: idOptionIdLocale, body: jsonContent(upsertAttributeOptionTranslationSchema) }, responses: { 200: { description: "OK", ...jsonContent(dataEnvelope()) }, 401: OK_ERROR_RESPONSES[401] } });

// ============================================================
// Admin: Pages & Content Blocks
// ============================================================
registry.registerPath({ method: "get", path: "/admin/pages", tags: ["Pages"], summary: "[Admin] List pages", security, responses: { 200: { description: "OK", ...jsonContent(dataEnvelope(z.array(z.record(z.unknown())))) }, 401: OK_ERROR_RESPONSES[401] } });
registry.registerPath({ method: "post", path: "/admin/pages", tags: ["Pages"], summary: "[Admin] Create a page", security, request: { body: jsonContent(createPageSchema) }, responses: { 201: { description: "Created", ...jsonContent(dataEnvelope()) }, 400: OK_ERROR_RESPONSES[400], 401: OK_ERROR_RESPONSES[401] } });
registry.registerPath({ method: "get", path: "/admin/pages/{id}", tags: ["Pages"], summary: "[Admin] Get a page (all locales, all blocks)", security, request: { params: idParam }, responses: { 200: { description: "OK", ...jsonContent(dataEnvelope()) }, 401: OK_ERROR_RESPONSES[401], 404: OK_ERROR_RESPONSES[404] } });
registry.registerPath({ method: "patch", path: "/admin/pages/{id}", tags: ["Pages"], summary: "[Admin] Update a page", security, request: { params: idParam, body: jsonContent(updatePageSchema) }, responses: { 200: { description: "OK", ...jsonContent(dataEnvelope()) }, 401: OK_ERROR_RESPONSES[401] } });
registry.registerPath({ method: "delete", path: "/admin/pages/{id}", tags: ["Pages"], summary: "[Admin] Delete a page", security, request: { params: idParam }, responses: { 204: { description: "Deleted" }, 401: OK_ERROR_RESPONSES[401] } });
registry.registerPath({ method: "put", path: "/admin/pages/{id}/translations/{locale}", tags: ["Pages"], summary: "[Admin] Upsert one locale's translation", security, request: { params: idAndLocale, body: jsonContent(upsertPageTranslationSchema) }, responses: { 200: { description: "OK", ...jsonContent(dataEnvelope()) }, 401: OK_ERROR_RESPONSES[401] } });
registry.registerPath({ method: "post", path: "/admin/pages/{id}/blocks", tags: ["Content Blocks"], summary: "[Admin] Add a content block to a page", security, request: { params: idParam, body: jsonContent(createBlockSchema) }, responses: { 201: { description: "Created", ...jsonContent(dataEnvelope()) }, 400: OK_ERROR_RESPONSES[400], 401: OK_ERROR_RESPONSES[401] } });
registry.registerPath({ method: "patch", path: "/admin/pages/{id}/blocks/reorder", tags: ["Content Blocks"], summary: "[Admin] Reorder a page's content blocks", security, request: { params: idParam, body: jsonContent(reorderBlocksSchema) }, responses: { 200: { description: "OK", ...jsonContent(dataEnvelope()) }, 401: OK_ERROR_RESPONSES[401] } });
registry.registerPath({ method: "patch", path: "/admin/blocks/{id}", tags: ["Content Blocks"], summary: "[Admin] Update a content block's type/order/settings", security, request: { params: idParam, body: jsonContent(updateBlockSchema) }, responses: { 200: { description: "OK", ...jsonContent(dataEnvelope()) }, 401: OK_ERROR_RESPONSES[401] } });
registry.registerPath({ method: "delete", path: "/admin/blocks/{id}", tags: ["Content Blocks"], summary: "[Admin] Delete a content block", security, request: { params: idParam }, responses: { 204: { description: "Deleted" }, 401: OK_ERROR_RESPONSES[401] } });
registry.registerPath({ method: "put", path: "/admin/blocks/{id}/translations/{locale}", tags: ["Content Blocks"], summary: "[Admin] Upsert one locale's block data (validated against the block's type schema)", security, request: { params: idAndLocale, body: jsonContent(upsertBlockTranslationSchema) }, responses: { 200: { description: "OK", ...jsonContent(dataEnvelope()) }, 400: OK_ERROR_RESPONSES[400], 401: OK_ERROR_RESPONSES[401] } });

// ============================================================
// Admin: Navigation
// ============================================================
registry.registerPath({ method: "get", path: "/admin/navigation", tags: ["Navigation"], summary: "[Admin] List navigation items (flat)", security, responses: { 200: { description: "OK", ...jsonContent(dataEnvelope(z.array(z.record(z.unknown())))) }, 401: OK_ERROR_RESPONSES[401] } });
registry.registerPath({ method: "post", path: "/admin/navigation", tags: ["Navigation"], summary: "[Admin] Create a navigation item", security, request: { body: jsonContent(createNavigationItemSchema) }, responses: { 201: { description: "Created", ...jsonContent(dataEnvelope()) }, 400: OK_ERROR_RESPONSES[400], 401: OK_ERROR_RESPONSES[401] } });
registry.registerPath({ method: "patch", path: "/admin/navigation/reorder", tags: ["Navigation"], summary: "[Admin] Reorder navigation items", security, request: { body: jsonContent(reorderNavigationSchema) }, responses: { 200: { description: "OK", ...jsonContent(dataEnvelope(z.array(z.record(z.unknown())))) }, 401: OK_ERROR_RESPONSES[401] } });
registry.registerPath({ method: "patch", path: "/admin/navigation/{id}", tags: ["Navigation"], summary: "[Admin] Update a navigation item", security, request: { params: idParam, body: jsonContent(updateNavigationItemSchema) }, responses: { 200: { description: "OK", ...jsonContent(dataEnvelope()) }, 401: OK_ERROR_RESPONSES[401] } });
registry.registerPath({ method: "delete", path: "/admin/navigation/{id}", tags: ["Navigation"], summary: "[Admin] Delete a navigation item", security, request: { params: idParam }, responses: { 204: { description: "Deleted" }, 401: OK_ERROR_RESPONSES[401] } });
registry.registerPath({ method: "put", path: "/admin/navigation/{id}/translations/{locale}", tags: ["Navigation"], summary: "[Admin] Upsert one locale's label (falls back to the linked category/page name if unset)", security, request: { params: idAndLocale, body: jsonContent(upsertNavigationItemTranslationSchema) }, responses: { 200: { description: "OK", ...jsonContent(dataEnvelope()) }, 401: OK_ERROR_RESPONSES[401] } });

// ============================================================
// Admin: Footer
// ============================================================
registry.registerPath({ method: "get", path: "/admin/footer-columns", tags: ["Footer"], summary: "[Admin] List footer columns (with links)", security, responses: { 200: { description: "OK", ...jsonContent(dataEnvelope(z.array(z.record(z.unknown())))) }, 401: OK_ERROR_RESPONSES[401] } });
registry.registerPath({ method: "post", path: "/admin/footer-columns", tags: ["Footer"], summary: "[Admin] Create a footer column", security, request: { body: jsonContent(createFooterColumnSchema) }, responses: { 201: { description: "Created", ...jsonContent(dataEnvelope()) }, 400: OK_ERROR_RESPONSES[400], 401: OK_ERROR_RESPONSES[401] } });
registry.registerPath({ method: "patch", path: "/admin/footer-columns/{id}", tags: ["Footer"], summary: "[Admin] Update a footer column", security, request: { params: idParam, body: jsonContent(updateFooterColumnSchema) }, responses: { 200: { description: "OK", ...jsonContent(dataEnvelope()) }, 401: OK_ERROR_RESPONSES[401] } });
registry.registerPath({ method: "delete", path: "/admin/footer-columns/{id}", tags: ["Footer"], summary: "[Admin] Delete a footer column", security, request: { params: idParam }, responses: { 204: { description: "Deleted" }, 401: OK_ERROR_RESPONSES[401] } });
registry.registerPath({ method: "put", path: "/admin/footer-columns/{id}/translations/{locale}", tags: ["Footer"], summary: "[Admin] Upsert one locale's column title", security, request: { params: idAndLocale, body: jsonContent(upsertFooterColumnTranslationSchema) }, responses: { 200: { description: "OK", ...jsonContent(dataEnvelope()) }, 401: OK_ERROR_RESPONSES[401] } });
registry.registerPath({ method: "post", path: "/admin/footer-columns/{id}/links", tags: ["Footer"], summary: "[Admin] Add a link to a footer column", security, request: { params: idParam, body: jsonContent(createFooterLinkSchema) }, responses: { 201: { description: "Created", ...jsonContent(dataEnvelope()) }, 400: OK_ERROR_RESPONSES[400], 401: OK_ERROR_RESPONSES[401] } });
registry.registerPath({ method: "patch", path: "/admin/footer-columns/links/{linkId}", tags: ["Footer"], summary: "[Admin] Update a footer link", security, request: { params: linkIdParam, body: jsonContent(updateFooterLinkSchema) }, responses: { 200: { description: "OK", ...jsonContent(dataEnvelope()) }, 401: OK_ERROR_RESPONSES[401] } });
registry.registerPath({ method: "delete", path: "/admin/footer-columns/links/{linkId}", tags: ["Footer"], summary: "[Admin] Delete a footer link", security, request: { params: linkIdParam }, responses: { 204: { description: "Deleted" }, 401: OK_ERROR_RESPONSES[401] } });
registry.registerPath({ method: "put", path: "/admin/footer-columns/links/{linkId}/translations/{locale}", tags: ["Footer"], summary: "[Admin] Upsert one locale's link label", security, request: { params: linkIdAndLocale, body: jsonContent(upsertFooterLinkTranslationSchema) }, responses: { 200: { description: "OK", ...jsonContent(dataEnvelope()) }, 401: OK_ERROR_RESPONSES[401] } });

// ============================================================
// Admin: Site Settings (singleton)
// ============================================================
registry.registerPath({ method: "get", path: "/admin/site-settings", tags: ["Site Settings"], summary: "[Admin] Get site settings", security, responses: { 200: { description: "OK", ...jsonContent(dataEnvelope()) }, 401: OK_ERROR_RESPONSES[401] } });
registry.registerPath({ method: "patch", path: "/admin/site-settings", tags: ["Site Settings"], summary: "[Admin] Update site settings", security, request: { body: jsonContent(updateSiteSettingsSchema) }, responses: { 200: { description: "OK", ...jsonContent(dataEnvelope()) }, 401: OK_ERROR_RESPONSES[401] } });
registry.registerPath({ method: "put", path: "/admin/site-settings/translations/{locale}", tags: ["Site Settings"], summary: "[Admin] Upsert one locale's tagline", security, request: { params: localeParam, body: jsonContent(upsertSiteSettingsTranslationSchema) }, responses: { 200: { description: "OK", ...jsonContent(dataEnvelope()) }, 401: OK_ERROR_RESPONSES[401] } });

// ============================================================
// Admin: Media
// ============================================================
registry.registerPath({ method: "get", path: "/admin/media", tags: ["Media"], summary: "[Admin] List uploaded media", security, request: { query: paginationQuery.extend({ folder: z.string().optional() }) }, responses: { 200: { description: "OK", ...jsonContent(listEnvelope()) }, 401: OK_ERROR_RESPONSES[401] } });
registry.registerPath({
  method: "post",
  path: "/admin/media",
  tags: ["Media"],
  summary: "[Admin] Upload a file",
  security,
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: z.object({
            file: z.string().openapi({ format: "binary", description: "Image or PDF, max 10MB" }),
            folder: z.string().optional().openapi({ description: "Optional grouping folder, e.g. 'products'" }),
          }),
        },
      },
    },
  },
  responses: { 201: { description: "Created", ...jsonContent(dataEnvelope()) }, 400: OK_ERROR_RESPONSES[400], 401: OK_ERROR_RESPONSES[401] },
});
registry.registerPath({ method: "patch", path: "/admin/media/{id}", tags: ["Media"], summary: "[Admin] Update media metadata (folder)", security, request: { params: idParam, body: jsonContent(updateMediaSchema) }, responses: { 200: { description: "OK", ...jsonContent(dataEnvelope()) }, 401: OK_ERROR_RESPONSES[401] } });
registry.registerPath({ method: "put", path: "/admin/media/{id}/translations/{locale}", tags: ["Media"], summary: "[Admin] Upsert one locale's alt text / caption", security, request: { params: idAndLocale, body: jsonContent(upsertMediaTranslationSchema) }, responses: { 200: { description: "OK", ...jsonContent(dataEnvelope()) }, 401: OK_ERROR_RESPONSES[401] } });
registry.registerPath({ method: "delete", path: "/admin/media/{id}", tags: ["Media"], summary: "[Admin] Delete a media file", security, request: { params: idParam }, responses: { 204: { description: "Deleted" }, 401: OK_ERROR_RESPONSES[401] } });

// ============================================================
// Admin: Users
// ============================================================
registry.registerPath({ method: "get", path: "/admin/users", tags: ["Admin Users"], summary: "[Admin] List admin accounts", security, responses: { 200: { description: "OK", ...jsonContent(dataEnvelope(z.array(z.record(z.unknown())))) }, 401: OK_ERROR_RESPONSES[401] } });
registry.registerPath({ method: "patch", path: "/admin/users/{id}", tags: ["Admin Users"], summary: "[Admin] Update an admin's name/role", security, request: { params: idParam, body: jsonContent(updateAdminUserSchema) }, responses: { 200: { description: "OK", ...jsonContent(dataEnvelope()) }, 401: OK_ERROR_RESPONSES[401] } });
registry.registerPath({ method: "post", path: "/admin/users/{id}/change-password", tags: ["Admin Users"], summary: "[Admin] Change your own password (self only)", security, request: { params: idParam, body: jsonContent(changePasswordSchema) }, responses: { 204: { description: "Password changed" }, 401: OK_ERROR_RESPONSES[401] } });
