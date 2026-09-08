import { z } from "zod";
import { SUPPORTED_LOCALES, LINK_TYPES } from "../../config/constants.ts";

const columnTranslationInput = z.object({
  locale: z.enum(SUPPORTED_LOCALES),
  title: z.string().min(1).max(255),
});

export const createFooterColumnSchema = z.object({
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
  translations: z.array(columnTranslationInput).min(1),
});

export const updateFooterColumnSchema = z.object({
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
  translations: z.array(columnTranslationInput).optional(),
});

export const upsertFooterColumnTranslationSchema = columnTranslationInput.omit({ locale: true }).partial();

const linkTranslationInput = z.object({
  locale: z.enum(SUPPORTED_LOCALES),
  label: z.string().min(1).max(255),
});

export const createFooterLinkSchema = z.object({
  sortOrder: z.number().int().optional(),
  linkType: z.enum(LINK_TYPES),
  categoryId: z.number().int().positive().nullable().optional(),
  pageId: z.number().int().positive().nullable().optional(),
  externalUrl: z.string().max(1024).nullable().optional(),
  translations: z.array(linkTranslationInput).min(1),
});

export const updateFooterLinkSchema = z.object({
  sortOrder: z.number().int().optional(),
  linkType: z.enum(LINK_TYPES).optional(),
  categoryId: z.number().int().positive().nullable().optional(),
  pageId: z.number().int().positive().nullable().optional(),
  externalUrl: z.string().max(1024).nullable().optional(),
  translations: z.array(linkTranslationInput).optional(),
});

export const upsertFooterLinkTranslationSchema = linkTranslationInput.omit({ locale: true }).partial();
