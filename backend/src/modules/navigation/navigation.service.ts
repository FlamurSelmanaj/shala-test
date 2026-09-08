import {
  NavigationItem,
  NavigationItemTranslation,
  Category,
  CategoryTranslation,
  Page,
  PageTranslation,
} from "../../db/models/index.ts";
import { resolveTranslation } from "../../lib/translation.ts";
import { NotFoundError } from "../../lib/errors.ts";
import type { Locale } from "../../config/constants.ts";

const NAV_INCLUDES = [
  { model: NavigationItemTranslation, as: "translations" },
  { model: Category, as: "category", include: [{ model: CategoryTranslation, as: "translations" }] },
  { model: Page, as: "page", include: [{ model: PageTranslation, as: "translations" }] },
];

function resolveLabel(item: NavigationItem, locale: Locale): string {
  const ownTranslation = resolveTranslation((item.get("translations") as NavigationItemTranslation[]) ?? [], locale);
  if (ownTranslation?.label) return ownTranslation.label;

  const category = item.get("category") as Category | undefined;
  if (category) {
    const catTranslation = resolveTranslation((category.get("translations") as CategoryTranslation[]) ?? [], locale);
    if (catTranslation?.name) return catTranslation.name;
  }

  const page = item.get("page") as Page | undefined;
  if (page) {
    const pageTranslation = resolveTranslation((page.get("translations") as PageTranslation[]) ?? [], locale);
    if (pageTranslation?.title) return pageTranslation.title;
  }

  return "";
}

function resolveHref(item: NavigationItem): string | null {
  if (item.linkType === "EXTERNAL") return item.externalUrl;
  if (item.linkType === "CATEGORY") {
    const category = item.get("category") as Category | undefined;
    return category ? `/categories/${category.slug}` : null;
  }
  if (item.linkType === "PAGE") {
    const page = item.get("page") as Page | undefined;
    return page ? `/${page.slug}` : null;
  }
  return null;
}

function serialize(
  item: NavigationItem,
  locale: Locale,
  byParent: Map<number | null, NavigationItem[]>,
): Record<string, unknown> {
  const children = byParent.get(item.id) ?? [];
  return {
    id: item.id,
    label: resolveLabel(item, locale),
    href: resolveHref(item),
    linkType: item.linkType,
    openInNewTab: item.openInNewTab,
    children: children
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((child) => serialize(child, locale, byParent)),
  };
}

export async function getPublicNavigationTree(locale: Locale) {
  const items = await NavigationItem.findAll({
    where: { isActive: true },
    include: NAV_INCLUDES,
    order: [["sortOrder", "ASC"]],
  });

  const byParent = new Map<number | null, NavigationItem[]>();
  for (const item of items) {
    const key = item.parentId ?? null;
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key)?.push(item);
  }

  const roots = byParent.get(null) ?? [];
  return roots
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((root) => serialize(root, locale, byParent));
}

// ---- Admin ----

export async function listNavigationAdmin() {
  return NavigationItem.findAll({ include: NAV_INCLUDES, order: [["sortOrder", "ASC"]] });
}

export async function getNavigationItemAdminOr404(id: number) {
  const item = await NavigationItem.findByPk(id, { include: NAV_INCLUDES });
  if (!item) throw new NotFoundError("Navigation item not found");
  return item;
}

export interface NavigationTranslationInput {
  locale: Locale;
  label?: string | null;
}

export interface NavigationItemInput {
  parentId?: number | null;
  linkType?: string;
  categoryId?: number | null;
  pageId?: number | null;
  externalUrl?: string | null;
  sortOrder?: number;
  isActive?: boolean;
  openInNewTab?: boolean;
  translations?: NavigationTranslationInput[];
}

export async function createNavigationItem(
  input: NavigationItemInput & { linkType: string; translations: NavigationTranslationInput[] },
) {
  const item = await NavigationItem.create({
    parentId: input.parentId ?? null,
    linkType: input.linkType,
    categoryId: input.categoryId ?? null,
    pageId: input.pageId ?? null,
    externalUrl: input.externalUrl ?? null,
    sortOrder: input.sortOrder ?? 0,
    isActive: input.isActive ?? true,
    openInNewTab: input.openInNewTab ?? false,
  });

  await NavigationItemTranslation.bulkCreate(
    input.translations.map((t) => ({ navigationItemId: item.id, locale: t.locale, label: t.label ?? null })),
  );

  return getNavigationItemAdminOr404(item.id);
}

export async function updateNavigationItem(id: number, input: NavigationItemInput) {
  const item = await getNavigationItemAdminOr404(id);

  if (input.parentId !== undefined) item.parentId = input.parentId;
  if (input.linkType !== undefined) item.linkType = input.linkType;
  if (input.categoryId !== undefined) item.categoryId = input.categoryId;
  if (input.pageId !== undefined) item.pageId = input.pageId;
  if (input.externalUrl !== undefined) item.externalUrl = input.externalUrl;
  if (input.sortOrder !== undefined) item.sortOrder = input.sortOrder;
  if (input.isActive !== undefined) item.isActive = input.isActive;
  if (input.openInNewTab !== undefined) item.openInNewTab = input.openInNewTab;
  await item.save();

  if (input.translations) {
    for (const t of input.translations) {
      await upsertNavigationItemTranslation(id, t.locale, t);
    }
  }

  return getNavigationItemAdminOr404(id);
}

export async function upsertNavigationItemTranslation(
  id: number,
  locale: Locale,
  data: Partial<NavigationTranslationInput>,
) {
  await getNavigationItemAdminOr404(id);
  const [translation] = await NavigationItemTranslation.findOrCreate({
    where: { navigationItemId: id, locale },
    defaults: { navigationItemId: id, locale, label: data.label ?? null },
  });
  if (data.label !== undefined) translation.label = data.label;
  await translation.save();
  return translation;
}

export async function deleteNavigationItem(id: number): Promise<void> {
  const item = await getNavigationItemAdminOr404(id);
  await item.destroy();
}

export async function reorderNavigation(order: number[]) {
  await Promise.all(order.map((id, index) => NavigationItem.update({ sortOrder: index }, { where: { id } })));
  return listNavigationAdmin();
}
