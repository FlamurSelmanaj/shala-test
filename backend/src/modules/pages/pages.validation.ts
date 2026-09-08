import { z } from "zod";
import { SUPPORTED_LOCALES } from "../../config/constants.ts";

const pageTranslationInput = z.object({
  locale: z.enum(SUPPORTED_LOCALES),
  title: z.string().min(1).max(255),
  metaTitle: z.string().max(255).optional(),
  metaDescription: z.string().max(500).optional(),
  ogImageId: z.number().int().positive().optional(),
});

export const createPageSchema = z.object({
  slug: z.string().min(1).max(255),
  template: z.string().max(100).optional(),
  isActive: z.boolean().optional(),
  publishedAt: z.string().datetime().optional(),
  translations: z.array(pageTranslationInput).min(1),
});

export const updatePageSchema = z.object({
  slug: z.string().min(1).max(255).optional(),
  template: z.string().max(100).nullable().optional(),
  isActive: z.boolean().optional(),
  publishedAt: z.string().datetime().nullable().optional(),
  translations: z.array(pageTranslationInput).optional(),
});

export const upsertPageTranslationSchema = pageTranslationInput.omit({ locale: true }).partial();

const blockTranslationInput = z.object({
  locale: z.enum(SUPPORTED_LOCALES),
  data: z.record(z.unknown()),
});

export const createBlockSchema = z.object({
  type: z.string().min(1).max(64),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
  settings: z.record(z.unknown()).optional(),
  translations: z.array(blockTranslationInput).min(1),
});

export const updateBlockSchema = z.object({
  type: z.string().min(1).max(64).optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
  settings: z.record(z.unknown()).optional(),
});

export const upsertBlockTranslationSchema = z.object({
  data: z.record(z.unknown()),
});

export const reorderBlocksSchema = z.object({
  order: z.array(z.number().int().positive()),
});
