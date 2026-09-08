import { z } from "zod";
import { SUPPORTED_LOCALES } from "../../config/constants.ts";

const translationInput = z.object({
  locale: z.enum(SUPPORTED_LOCALES),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  metaTitle: z.string().max(255).optional(),
  metaDescription: z.string().max(500).optional(),
});

export const createCategorySchema = z.object({
  slug: z.string().min(1).max(255),
  icon: z.string().max(1024).optional(),
  parentId: z.number().int().positive().optional(),
  imageId: z.number().int().positive().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
  translations: z.array(translationInput).min(1),
});

export const updateCategorySchema = z.object({
  slug: z.string().min(1).max(255).optional(),
  icon: z.string().max(1024).optional(),
  parentId: z.number().int().positive().nullable().optional(),
  imageId: z.number().int().positive().nullable().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
  translations: z.array(translationInput).optional(),
});

export const upsertCategoryTranslationSchema = translationInput.omit({ locale: true }).partial();

export const setCategoryAttributesSchema = z.object({
  attributeIds: z.array(z.number().int().positive()),
});
