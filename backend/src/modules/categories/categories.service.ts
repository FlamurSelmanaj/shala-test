import {
  Category,
  CategoryTranslation,
  Media,
  Attribute,
  AttributeTranslation,
  AttributeOption,
  AttributeOptionTranslation,
  CategoryAttribute,
} from "../../db/models/index.ts";
import { resolveTranslation } from "../../lib/translation.ts";
import { NotFoundError } from "../../lib/errors.ts";
import type { Locale } from "../../config/constants.ts";

const CATEGORY_INCLUDES = [
  { model: CategoryTranslation, as: "translations" },
  { model: Media, as: "image" },
];

function serializeMediaRef(media: Media | null) {
  if (!media) return null;
  return { id: media.id, url: media.url, mimeType: media.mimeType };
}

function serializeCategoryPublic(category: Category, locale: Locale) {
  const translations = (category.get("translations") as CategoryTranslation[]) ?? [];
  const translation = resolveTranslation(translations, locale);
  return {
    id: category.id,
    slug: category.slug,
    icon: category.icon,
    name: translation?.name ?? category.slug,
    description: translation?.description ?? null,
    metaTitle: translation?.metaTitle ?? null,
    metaDescription: translation?.metaDescription ?? null,
    image: serializeMediaRef((category.get("image") as Media) ?? null),
    sortOrder: category.sortOrder,
  };
}

export async function listPublicCategories(locale: Locale, parentId?: number | null) {
  const where: Record<string, unknown> = { isActive: true };
  if (parentId === null) where.parentId = null;
  else if (parentId !== undefined) where.parentId = parentId;

  const categories = await Category.findAll({
    where,
    include: CATEGORY_INCLUDES,
    order: [["sortOrder", "ASC"]],
  });

  return categories.map((c) => serializeCategoryPublic(c, locale));
}

export async function findPublicCategoryEntityBySlugOr404(slug: string): Promise<Category> {
  const category = await Category.findOne({ where: { isActive: true, slug }, include: CATEGORY_INCLUDES });
  if (!category) throw new NotFoundError("Category not found");
  return category;
}

async function buildBreadcrumb(category: Category, locale: Locale) {
  const chain: Array<ReturnType<typeof serializeCategoryPublic>> = [];
  let current: Category | null = category;
  while (current) {
    chain.unshift(serializeCategoryPublic(current, locale));
    if (!current.parentId) break;
    current = await Category.findByPk(current.parentId, { include: CATEGORY_INCLUDES });
  }
  return chain;
}

export async function getPublicCategoryBySlug(slug: string, locale: Locale) {
  const category = await findPublicCategoryEntityBySlugOr404(slug);
  const breadcrumb = await buildBreadcrumb(category, locale);
  return { ...serializeCategoryPublic(category, locale), breadcrumb };
}

export async function getPublicCategoryAttributes(slug: string, locale: Locale) {
  const category = await findPublicCategoryEntityBySlugOr404(slug);

  const categoryAttributes = await CategoryAttribute.findAll({
    where: { categoryId: category.id },
    include: [
      {
        model: Attribute,
        as: "attribute",
        include: [
          { model: AttributeTranslation, as: "translations" },
          {
            model: AttributeOption,
            as: "options",
            include: [{ model: AttributeOptionTranslation, as: "translations" }],
          },
        ],
      },
    ],
    order: [["sortOrder", "ASC"]],
  });

  return categoryAttributes.map((ca) => {
    const attribute = ca.get("attribute") as Attribute;
    const attrTranslation = resolveTranslation((attribute.get("translations") as AttributeTranslation[]) ?? [], locale);
    const options = (attribute.get("options") as AttributeOption[]) ?? [];

    return {
      key: attribute.key,
      type: attribute.type,
      unit: attribute.unit,
      label: attrTranslation?.label ?? attribute.key,
      helpText: attrTranslation?.helpText ?? null,
      options: options.map((option) => {
        const optTranslation = resolveTranslation(
          (option.get("translations") as AttributeOptionTranslation[]) ?? [],
          locale,
        );
        return { value: option.value, label: optTranslation?.label ?? option.value };
      }),
    };
  });
}

// ---- Admin ----

export async function listCategoriesAdmin() {
  return Category.findAll({ include: CATEGORY_INCLUDES, order: [["sortOrder", "ASC"]] });
}

export async function getCategoryAdminOr404(id: number) {
  const category = await Category.findByPk(id, { include: CATEGORY_INCLUDES });
  if (!category) throw new NotFoundError("Category not found");
  return category;
}

export interface CategoryTranslationInput {
  locale: Locale;
  name?: string;
  description?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
}

export interface CategoryInput {
  slug?: string;
  icon?: string | null;
  parentId?: number | null;
  imageId?: number | null;
  sortOrder?: number;
  isActive?: boolean;
  translations?: CategoryTranslationInput[];
}

export async function createCategory(input: CategoryInput & { slug: string; translations: CategoryTranslationInput[] }) {
  const category = await Category.create({
    slug: input.slug,
    icon: input.icon ?? null,
    parentId: input.parentId ?? null,
    imageId: input.imageId ?? null,
    sortOrder: input.sortOrder ?? 0,
    isActive: input.isActive ?? true,
  });

  await CategoryTranslation.bulkCreate(
    input.translations.map((t) => ({
      categoryId: category.id,
      locale: t.locale,
      name: t.name ?? "",
      description: t.description ?? null,
      metaTitle: t.metaTitle ?? null,
      metaDescription: t.metaDescription ?? null,
    })),
  );

  return getCategoryAdminOr404(category.id);
}

export async function updateCategory(id: number, input: CategoryInput) {
  const category = await getCategoryAdminOr404(id);

  if (input.slug !== undefined) category.slug = input.slug;
  if (input.icon !== undefined) category.icon = input.icon;
  if (input.parentId !== undefined) category.parentId = input.parentId;
  if (input.imageId !== undefined) category.imageId = input.imageId;
  if (input.sortOrder !== undefined) category.sortOrder = input.sortOrder;
  if (input.isActive !== undefined) category.isActive = input.isActive;
  await category.save();

  if (input.translations) {
    for (const t of input.translations) {
      await upsertCategoryTranslation(id, t.locale, t);
    }
  }

  return getCategoryAdminOr404(id);
}

export async function upsertCategoryTranslation(id: number, locale: Locale, data: Partial<CategoryTranslationInput>) {
  await getCategoryAdminOr404(id);
  const [translation] = await CategoryTranslation.findOrCreate({
    where: { categoryId: id, locale },
    defaults: {
      categoryId: id,
      locale,
      name: data.name ?? "",
      description: data.description ?? null,
      metaTitle: data.metaTitle ?? null,
      metaDescription: data.metaDescription ?? null,
    },
  });

  if (data.name !== undefined) translation.name = data.name;
  if (data.description !== undefined) translation.description = data.description;
  if (data.metaTitle !== undefined) translation.metaTitle = data.metaTitle;
  if (data.metaDescription !== undefined) translation.metaDescription = data.metaDescription;
  await translation.save();
  return translation;
}

export async function deleteCategory(id: number): Promise<void> {
  const category = await getCategoryAdminOr404(id);
  await category.destroy();
}

export async function setCategoryAttributes(categoryId: number, attributeIds: number[]) {
  await getCategoryAdminOr404(categoryId);
  await CategoryAttribute.destroy({ where: { categoryId } });
  await CategoryAttribute.bulkCreate(
    attributeIds.map((attributeId, index) => ({ categoryId, attributeId, sortOrder: index })),
  );
  return CategoryAttribute.findAll({ where: { categoryId } });
}
