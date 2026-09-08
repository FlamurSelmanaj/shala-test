import { Product, ProductTranslation, ProductImage, Media } from "../../db/models/index.ts";
import { resolveTranslation } from "../../lib/translation.ts";
import { NotFoundError } from "../../lib/errors.ts";
import { parsePagination, buildPaginationMeta } from "../../lib/pagination.ts";
import { findPublicCategoryEntityBySlugOr404 } from "../categories/categories.service.ts";
import type { Locale } from "../../config/constants.ts";
import type { ProductFacetValues } from "../../db/models/product.model.ts";

const PRODUCT_INCLUDES = [
  { model: ProductTranslation, as: "translations" },
  { model: ProductImage, as: "images", include: [{ model: Media, as: "media" }] },
];

function serializeImage(image: ProductImage) {
  const media = image.get("media") as Media | undefined;
  return {
    id: image.id,
    sortOrder: image.sortOrder,
    isPrimary: image.isPrimary,
    media: media ? { id: media.id, url: media.url, mimeType: media.mimeType } : null,
  };
}

function serializeProductPublic(product: Product, locale: Locale) {
  const translations = (product.get("translations") as ProductTranslation[]) ?? [];
  const translation = resolveTranslation(translations, locale);
  const images = ((product.get("images") as ProductImage[]) ?? []).slice().sort((a, b) => a.sortOrder - b.sortOrder);
  const primary = images.find((i) => i.isPrimary) ?? images[0];

  return {
    id: product.id,
    sku: product.sku,
    slug: product.slug,
    name: translation?.name ?? product.slug,
    shortDescription: translation?.shortDescription ?? null,
    description: translation?.description ?? null,
    metaTitle: translation?.metaTitle ?? null,
    metaDescription: translation?.metaDescription ?? null,
    facetValues: product.facetValues,
    images: images.map(serializeImage),
    primaryImage: primary ? serializeImage(primary) : null,
  };
}

function matchesFacetFilters(facetValues: ProductFacetValues, filters: Record<string, string>): boolean {
  for (const [key, rawValue] of Object.entries(filters)) {
    const productValue = facetValues[key];
    if (productValue === undefined) return false;

    const requestedValues = rawValue.split(",").map((v) => v.trim());

    if (Array.isArray(productValue)) {
      if (!requestedValues.some((rv) => productValue.map(String).includes(rv))) return false;
    } else if (!requestedValues.includes(String(productValue))) {
      return false;
    }
  }
  return true;
}

const RESERVED_QUERY_KEYS = new Set(["locale", "page", "pageSize", "sort"]);

export async function listPublicProductsByCategorySlug(
  categorySlug: string,
  locale: Locale,
  query: Record<string, unknown>,
) {
  const category = await findPublicCategoryEntityBySlugOr404(categorySlug);
  const { page, pageSize } = parsePagination(query);

  const facetFilters: Record<string, string> = {};
  for (const [key, value] of Object.entries(query)) {
    if (RESERVED_QUERY_KEYS.has(key) || typeof value !== "string") continue;
    facetFilters[key] = value;
  }

  const allProducts = await Product.findAll({
    where: { categoryId: category.id, isActive: true },
    include: PRODUCT_INCLUDES,
    order: [["sortOrder", "ASC"]],
  });

  const filtered = allProducts.filter((p) => matchesFacetFilters(p.facetValues, facetFilters));
  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);

  return {
    data: pageItems.map((p) => serializeProductPublic(p, locale)),
    meta: buildPaginationMeta(page, pageSize, total),
  };
}

export async function getPublicProductBySlug(slug: string, locale: Locale) {
  const product = await Product.findOne({ where: { slug, isActive: true }, include: PRODUCT_INCLUDES });
  if (!product) throw new NotFoundError("Product not found");
  return serializeProductPublic(product, locale);
}

// ---- Admin ----

export async function listProductsAdmin(query: { page?: unknown; pageSize?: unknown; categoryId?: unknown }) {
  const { limit, offset, page, pageSize } = parsePagination(query);
  const where: Record<string, unknown> = {};
  if (query.categoryId) where.categoryId = Number(query.categoryId);

  const { rows, count } = await Product.findAndCountAll({
    where,
    include: PRODUCT_INCLUDES,
    order: [["sortOrder", "ASC"]],
    limit,
    offset,
  });

  return { data: rows, meta: buildPaginationMeta(page, pageSize, count) };
}

export async function getProductAdminOr404(id: number) {
  const product = await Product.findByPk(id, { include: PRODUCT_INCLUDES });
  if (!product) throw new NotFoundError("Product not found");
  return product;
}

export interface ProductTranslationInput {
  locale: Locale;
  name?: string;
  shortDescription?: string | null;
  description?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
}

export interface ProductInput {
  sku?: string | null;
  slug?: string;
  categoryId?: number;
  facetValues?: ProductFacetValues;
  sortOrder?: number;
  isActive?: boolean;
  translations?: ProductTranslationInput[];
}

export async function createProduct(
  input: ProductInput & { slug: string; categoryId: number; translations: ProductTranslationInput[] },
) {
  const product = await Product.create({
    sku: input.sku ?? null,
    slug: input.slug,
    categoryId: input.categoryId,
    facetValues: input.facetValues ?? {},
    sortOrder: input.sortOrder ?? 0,
    isActive: input.isActive ?? true,
  });

  await ProductTranslation.bulkCreate(
    input.translations.map((t) => ({
      productId: product.id,
      locale: t.locale,
      name: t.name ?? "",
      shortDescription: t.shortDescription ?? null,
      description: t.description ?? null,
      metaTitle: t.metaTitle ?? null,
      metaDescription: t.metaDescription ?? null,
    })),
  );

  return getProductAdminOr404(product.id);
}

export async function updateProduct(id: number, input: ProductInput) {
  const product = await getProductAdminOr404(id);

  if (input.sku !== undefined) product.sku = input.sku;
  if (input.slug !== undefined) product.slug = input.slug;
  if (input.categoryId !== undefined) product.categoryId = input.categoryId;
  if (input.facetValues !== undefined) product.facetValues = input.facetValues;
  if (input.sortOrder !== undefined) product.sortOrder = input.sortOrder;
  if (input.isActive !== undefined) product.isActive = input.isActive;
  await product.save();

  if (input.translations) {
    for (const t of input.translations) {
      await upsertProductTranslation(id, t.locale, t);
    }
  }

  return getProductAdminOr404(id);
}

export async function upsertProductTranslation(id: number, locale: Locale, data: Partial<ProductTranslationInput>) {
  await getProductAdminOr404(id);
  const [translation] = await ProductTranslation.findOrCreate({
    where: { productId: id, locale },
    defaults: {
      productId: id,
      locale,
      name: data.name ?? "",
      shortDescription: data.shortDescription ?? null,
      description: data.description ?? null,
      metaTitle: data.metaTitle ?? null,
      metaDescription: data.metaDescription ?? null,
    },
  });

  if (data.name !== undefined) translation.name = data.name;
  if (data.shortDescription !== undefined) translation.shortDescription = data.shortDescription;
  if (data.description !== undefined) translation.description = data.description;
  if (data.metaTitle !== undefined) translation.metaTitle = data.metaTitle;
  if (data.metaDescription !== undefined) translation.metaDescription = data.metaDescription;
  await translation.save();
  return translation;
}

export async function deleteProduct(id: number): Promise<void> {
  const product = await getProductAdminOr404(id);
  await product.destroy();
}

export async function addProductImage(
  productId: number,
  data: { mediaId: number; sortOrder?: number; isPrimary?: boolean },
) {
  await getProductAdminOr404(productId);
  return ProductImage.create({
    productId,
    mediaId: data.mediaId,
    sortOrder: data.sortOrder ?? 0,
    isPrimary: data.isPrimary ?? false,
  });
}

export async function removeProductImage(productId: number, imageId: number): Promise<void> {
  const image = await ProductImage.findOne({ where: { id: imageId, productId } });
  if (!image) throw new NotFoundError("Product image not found");
  await image.destroy();
}
