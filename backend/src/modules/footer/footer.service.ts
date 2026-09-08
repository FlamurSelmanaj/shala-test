import {
  FooterColumn,
  FooterColumnTranslation,
  FooterLink,
  FooterLinkTranslation,
  Category,
  Page,
} from "../../db/models/index.ts";
import { resolveTranslation } from "../../lib/translation.ts";
import { NotFoundError } from "../../lib/errors.ts";
import type { Locale } from "../../config/constants.ts";

const COLUMN_INCLUDES = [
  { model: FooterColumnTranslation, as: "translations" },
  {
    model: FooterLink,
    as: "links",
    include: [
      { model: FooterLinkTranslation, as: "translations" },
      { model: Category, as: "category" },
      { model: Page, as: "page" },
    ],
  },
];

function resolveLinkHref(link: FooterLink): string | null {
  if (link.linkType === "EXTERNAL") return link.externalUrl;
  if (link.linkType === "CATEGORY") {
    const category = link.get("category") as Category | undefined;
    return category ? `/categories/${category.slug}` : null;
  }
  if (link.linkType === "PAGE") {
    const page = link.get("page") as Page | undefined;
    return page ? `/${page.slug}` : null;
  }
  return null;
}

export async function getPublicFooter(locale: Locale) {
  const columns = await FooterColumn.findAll({
    where: { isActive: true },
    include: COLUMN_INCLUDES,
    order: [["sortOrder", "ASC"]],
  });

  return columns.map((column) => {
    const translation = resolveTranslation((column.get("translations") as FooterColumnTranslation[]) ?? [], locale);
    const links = ((column.get("links") as FooterLink[]) ?? []).slice().sort((a, b) => a.sortOrder - b.sortOrder);

    return {
      id: column.id,
      title: translation?.title ?? "",
      links: links.map((link) => {
        const linkTranslation = resolveTranslation((link.get("translations") as FooterLinkTranslation[]) ?? [], locale);
        return { id: link.id, label: linkTranslation?.label ?? "", href: resolveLinkHref(link) };
      }),
    };
  });
}

// ---- Admin: columns ----

export async function listFooterColumnsAdmin() {
  return FooterColumn.findAll({ include: COLUMN_INCLUDES, order: [["sortOrder", "ASC"]] });
}

export async function getFooterColumnAdminOr404(id: number) {
  const column = await FooterColumn.findByPk(id, { include: COLUMN_INCLUDES });
  if (!column) throw new NotFoundError("Footer column not found");
  return column;
}

export interface FooterColumnTranslationInput {
  locale: Locale;
  title?: string;
}

export interface FooterColumnInput {
  sortOrder?: number;
  isActive?: boolean;
  translations?: FooterColumnTranslationInput[];
}

export async function createFooterColumn(input: FooterColumnInput & { translations: FooterColumnTranslationInput[] }) {
  const column = await FooterColumn.create({ sortOrder: input.sortOrder ?? 0, isActive: input.isActive ?? true });
  await FooterColumnTranslation.bulkCreate(
    input.translations.map((t) => ({ footerColumnId: column.id, locale: t.locale, title: t.title ?? "" })),
  );
  return getFooterColumnAdminOr404(column.id);
}

export async function updateFooterColumn(id: number, input: FooterColumnInput) {
  const column = await getFooterColumnAdminOr404(id);
  if (input.sortOrder !== undefined) column.sortOrder = input.sortOrder;
  if (input.isActive !== undefined) column.isActive = input.isActive;
  await column.save();

  if (input.translations) {
    for (const t of input.translations) await upsertFooterColumnTranslation(id, t.locale, t);
  }

  return getFooterColumnAdminOr404(id);
}

export async function upsertFooterColumnTranslation(
  id: number,
  locale: Locale,
  data: Partial<FooterColumnTranslationInput>,
) {
  await getFooterColumnAdminOr404(id);
  const [translation] = await FooterColumnTranslation.findOrCreate({
    where: { footerColumnId: id, locale },
    defaults: { footerColumnId: id, locale, title: data.title ?? "" },
  });
  if (data.title !== undefined) translation.title = data.title;
  await translation.save();
  return translation;
}

export async function deleteFooterColumn(id: number): Promise<void> {
  const column = await getFooterColumnAdminOr404(id);
  await column.destroy();
}

// ---- Admin: links ----

export interface FooterLinkTranslationInput {
  locale: Locale;
  label?: string;
}

export interface FooterLinkInput {
  sortOrder?: number;
  linkType?: string;
  categoryId?: number | null;
  pageId?: number | null;
  externalUrl?: string | null;
  translations?: FooterLinkTranslationInput[];
}

export async function getFooterLinkAdminOr404(id: number) {
  const link = await FooterLink.findByPk(id, { include: [{ model: FooterLinkTranslation, as: "translations" }] });
  if (!link) throw new NotFoundError("Footer link not found");
  return link;
}

export async function createFooterLink(
  columnId: number,
  input: FooterLinkInput & { linkType: string; translations: FooterLinkTranslationInput[] },
) {
  await getFooterColumnAdminOr404(columnId);
  const link = await FooterLink.create({
    footerColumnId: columnId,
    sortOrder: input.sortOrder ?? 0,
    linkType: input.linkType,
    categoryId: input.categoryId ?? null,
    pageId: input.pageId ?? null,
    externalUrl: input.externalUrl ?? null,
  });
  await FooterLinkTranslation.bulkCreate(
    input.translations.map((t) => ({ footerLinkId: link.id, locale: t.locale, label: t.label ?? "" })),
  );
  return getFooterLinkAdminOr404(link.id);
}

export async function updateFooterLink(id: number, input: FooterLinkInput) {
  const link = await getFooterLinkAdminOr404(id);
  if (input.sortOrder !== undefined) link.sortOrder = input.sortOrder;
  if (input.linkType !== undefined) link.linkType = input.linkType;
  if (input.categoryId !== undefined) link.categoryId = input.categoryId;
  if (input.pageId !== undefined) link.pageId = input.pageId;
  if (input.externalUrl !== undefined) link.externalUrl = input.externalUrl;
  await link.save();

  if (input.translations) {
    for (const t of input.translations) await upsertFooterLinkTranslation(id, t.locale, t);
  }

  return getFooterLinkAdminOr404(id);
}

export async function upsertFooterLinkTranslation(id: number, locale: Locale, data: Partial<FooterLinkTranslationInput>) {
  await getFooterLinkAdminOr404(id);
  const [translation] = await FooterLinkTranslation.findOrCreate({
    where: { footerLinkId: id, locale },
    defaults: { footerLinkId: id, locale, label: data.label ?? "" },
  });
  if (data.label !== undefined) translation.label = data.label;
  await translation.save();
  return translation;
}

export async function deleteFooterLink(id: number): Promise<void> {
  const link = await getFooterLinkAdminOr404(id);
  await link.destroy();
}
