import { z } from "zod";
import { SUPPORTED_LOCALES } from "../../config/constants.ts";

const translationInput = z.object({
  locale: z.enum(SUPPORTED_LOCALES),
  name: z.string().min(1).max(255),
  shortDescription: z.string().max(500).optional(),
  description: z.string().optional(),
  metaTitle: z.string().max(255).optional(),
  metaDescription: z.string().max(500).optional(),
});

const facetValuesSchema = z.record(z.union([z.string(), z.array(z.string()), z.number(), z.boolean()]));

export const createProductSchema = z.object({
  sku: z.string().max(100).optional(),
  slug: z.string().min(1).max(255),
  categoryId: z.number().int().positive(),
  facetValues: facetValuesSchema.optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
  translations: z.array(translationInput).min(1),
});

export const updateProductSchema = z.object({
  sku: z.string().max(100).nullable().optional(),
  slug: z.string().min(1).max(255).optional(),
  categoryId: z.number().int().positive().optional(),
  facetValues: facetValuesSchema.optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
  translations: z.array(translationInput).optional(),
});

export const upsertProductTranslationSchema = translationInput.omit({ locale: true }).partial();

export const addProductImageSchema = z.object({
  mediaId: z.number().int().positive(),
  sortOrder: z.number().int().optional(),
  isPrimary: z.boolean().optional(),
});
