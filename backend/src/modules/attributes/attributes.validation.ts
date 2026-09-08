import { z } from "zod";
import { SUPPORTED_LOCALES, ATTRIBUTE_TYPES } from "../../config/constants.ts";

const translationInput = z.object({
  locale: z.enum(SUPPORTED_LOCALES),
  label: z.string().min(1).max(255),
  helpText: z.string().max(500).optional(),
});

export const createAttributeSchema = z.object({
  key: z.string().min(1).max(100),
  type: z.enum(ATTRIBUTE_TYPES),
  unit: z.string().max(32).optional(),
  isFilterable: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  translations: z.array(translationInput).min(1),
});

export const updateAttributeSchema = z.object({
  key: z.string().min(1).max(100).optional(),
  type: z.enum(ATTRIBUTE_TYPES).optional(),
  unit: z.string().max(32).nullable().optional(),
  isFilterable: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  translations: z.array(translationInput).optional(),
});

export const upsertAttributeTranslationSchema = translationInput.omit({ locale: true }).partial();

const optionTranslationInput = z.object({
  locale: z.enum(SUPPORTED_LOCALES),
  label: z.string().min(1).max(255),
});

export const createAttributeOptionSchema = z.object({
  value: z.string().min(1).max(100),
  sortOrder: z.number().int().optional(),
  translations: z.array(optionTranslationInput).min(1),
});

export const updateAttributeOptionSchema = z.object({
  value: z.string().min(1).max(100).optional(),
  sortOrder: z.number().int().optional(),
  translations: z.array(optionTranslationInput).optional(),
});

export const upsertAttributeOptionTranslationSchema = optionTranslationInput.omit({ locale: true }).partial();
