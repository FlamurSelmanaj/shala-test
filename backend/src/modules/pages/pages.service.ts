import { Page, PageTranslation, ContentBlock, ContentBlockTranslation } from "../../db/models/index.ts";
import { resolveTranslation } from "../../lib/translation.ts";
import { NotFoundError } from "../../lib/errors.ts";
import type { Locale } from "../../config/constants.ts";
import { validateBlockData } from "./block-types/schemas.ts";

const PAGE_INCLUDES = [
  { model: PageTranslation, as: "translations" },
  { model: ContentBlock, as: "blocks", include: [{ model: ContentBlockTranslation, as: "translations" }] },
];

export async function getPublicPageBySlug(slug: string, locale: Locale) {
  const page = await Page.findOne({ where: { slug, isActive: true }, include: PAGE_INCLUDES });
  if (!page) throw new NotFoundError("Page not found");

  const translations = (page.get("translations") as PageTranslation[]) ?? [];
  const translation = resolveTranslation(translations, locale);
  const blocks = ((page.get("blocks") as ContentBlock[]) ?? [])
    .filter((b) => b.isActive)
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return {
    id: page.id,
    slug: page.slug,
    template: page.template,
    title: translation?.title ?? page.slug,
    metaTitle: translation?.metaTitle ?? null,
    metaDescription: translation?.metaDescription ?? null,
    blocks: blocks.map((block) => {
      const blockTranslation = resolveTranslation((block.get("translations") as ContentBlockTranslation[]) ?? [], locale);
      return { id: block.id, type: block.type, settings: block.settings, data: blockTranslation?.data ?? {} };
    }),
  };
}

// ---- Admin ----

export async function listPagesAdmin() {
  return Page.findAll({ include: PAGE_INCLUDES, order: [["slug", "ASC"]] });
}

export async function getPageAdminOr404(id: number) {
  const page = await Page.findByPk(id, { include: PAGE_INCLUDES });
  if (!page) throw new NotFoundError("Page not found");
  return page;
}

export interface PageTranslationInput {
  locale: Locale;
  title?: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImageId?: number | null;
}

export interface PageInput {
  slug?: string;
  template?: string | null;
  isActive?: boolean;
  publishedAt?: string | null;
  translations?: PageTranslationInput[];
}

export async function createPage(input: PageInput & { slug: string; translations: PageTranslationInput[] }) {
  const page = await Page.create({
    slug: input.slug,
    template: input.template ?? null,
    isActive: input.isActive ?? true,
    publishedAt: input.publishedAt ? new Date(input.publishedAt) : null,
  });

  await PageTranslation.bulkCreate(
    input.translations.map((t) => ({
      pageId: page.id,
      locale: t.locale,
      title: t.title ?? "",
      metaTitle: t.metaTitle ?? null,
      metaDescription: t.metaDescription ?? null,
      ogImageId: t.ogImageId ?? null,
    })),
  );

  return getPageAdminOr404(page.id);
}

export async function updatePage(id: number, input: PageInput) {
  const page = await getPageAdminOr404(id);

  if (input.slug !== undefined) page.slug = input.slug;
  if (input.template !== undefined) page.template = input.template;
  if (input.isActive !== undefined) page.isActive = input.isActive;
  if (input.publishedAt !== undefined) page.publishedAt = input.publishedAt ? new Date(input.publishedAt) : null;
  await page.save();

  if (input.translations) {
    for (const t of input.translations) {
      await upsertPageTranslation(id, t.locale, t);
    }
  }

  return getPageAdminOr404(id);
}

export async function upsertPageTranslation(id: number, locale: Locale, data: Partial<PageTranslationInput>) {
  await getPageAdminOr404(id);
  const [translation] = await PageTranslation.findOrCreate({
    where: { pageId: id, locale },
    defaults: {
      pageId: id,
      locale,
      title: data.title ?? "",
      metaTitle: data.metaTitle ?? null,
      metaDescription: data.metaDescription ?? null,
      ogImageId: data.ogImageId ?? null,
    },
  });

  if (data.title !== undefined) translation.title = data.title;
  if (data.metaTitle !== undefined) translation.metaTitle = data.metaTitle;
  if (data.metaDescription !== undefined) translation.metaDescription = data.metaDescription;
  if (data.ogImageId !== undefined) translation.ogImageId = data.ogImageId;
  await translation.save();
  return translation;
}

export async function deletePage(id: number): Promise<void> {
  const page = await getPageAdminOr404(id);
  await page.destroy();
}

export interface BlockTranslationInput {
  locale: Locale;
  data: Record<string, unknown>;
}

export interface BlockInput {
  type?: string;
  sortOrder?: number;
  isActive?: boolean;
  settings?: Record<string, unknown>;
}

export async function getBlockOr404(id: number) {
  const block = await ContentBlock.findByPk(id, { include: [{ model: ContentBlockTranslation, as: "translations" }] });
  if (!block) throw new NotFoundError("Content block not found");
  return block;
}

export async function addBlock(
  pageId: number,
  input: {
    type: string;
    sortOrder?: number;
    isActive?: boolean;
    settings?: Record<string, unknown>;
    translations: BlockTranslationInput[];
  },
) {
  await getPageAdminOr404(pageId);
  const block = await ContentBlock.create({
    pageId,
    type: input.type,
    sortOrder: input.sortOrder ?? 0,
    isActive: input.isActive ?? true,
    settings: input.settings ?? {},
  });

  await ContentBlockTranslation.bulkCreate(
    input.translations.map((t) => ({
      blockId: block.id,
      locale: t.locale,
      data: validateBlockData(input.type, t.data),
    })),
  );

  return getBlockOr404(block.id);
}

export async function updateBlock(id: number, input: BlockInput) {
  const block = await getBlockOr404(id);
  if (input.type !== undefined) block.type = input.type;
  if (input.sortOrder !== undefined) block.sortOrder = input.sortOrder;
  if (input.isActive !== undefined) block.isActive = input.isActive;
  if (input.settings !== undefined) block.settings = input.settings;
  await block.save();
  return getBlockOr404(id);
}

export async function upsertBlockTranslation(id: number, locale: Locale, data: Record<string, unknown>) {
  const block = await getBlockOr404(id);
  const validated = validateBlockData(block.type, data);

  const [translation] = await ContentBlockTranslation.findOrCreate({
    where: { blockId: id, locale },
    defaults: { blockId: id, locale, data: validated },
  });
  translation.data = validated;
  await translation.save();
  return translation;
}

export async function deleteBlock(id: number): Promise<void> {
  const block = await getBlockOr404(id);
  await block.destroy();
}

export async function reorderBlocks(pageId: number, order: number[]) {
  await getPageAdminOr404(pageId);
  await Promise.all(
    order.map((blockId, index) => ContentBlock.update({ sortOrder: index }, { where: { id: blockId, pageId } })),
  );
  return getPageAdminOr404(pageId);
}
