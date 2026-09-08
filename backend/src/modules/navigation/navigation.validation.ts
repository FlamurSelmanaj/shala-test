import { z } from "zod";
import { SUPPORTED_LOCALES, LINK_TYPES } from "../../config/constants.ts";

const translationInput = z.object({
  locale: z.enum(SUPPORTED_LOCALES),
  label: z.string().max(255).optional(),
});

export const createNavigationItemSchema = z.object({
  parentId: z.number().int().positive().nullable().optional(),
  linkType: z.enum(LINK_TYPES),
  categoryId: z.number().int().positive().nullable().optional(),
  pageId: z.number().int().positive().nullable().optional(),
  externalUrl: z.string().max(1024).nullable().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
  openInNewTab: z.boolean().optional(),
  translations: z.array(translationInput).min(1),
});

export const updateNavigationItemSchema = z.object({
  parentId: z.number().int().positive().nullable().optional(),
  linkType: z.enum(LINK_TYPES).optional(),
  categoryId: z.number().int().positive().nullable().optional(),
  pageId: z.number().int().positive().nullable().optional(),
  externalUrl: z.string().max(1024).nullable().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
  openInNewTab: z.boolean().optional(),
  translations: z.array(translationInput).optional(),
});

export const upsertNavigationItemTranslationSchema = translationInput.omit({ locale: true }).partial();

export const reorderNavigationSchema = z.object({
  order: z.array(z.number().int().positive()),
});
