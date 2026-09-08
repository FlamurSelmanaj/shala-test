import { z } from "zod";
import { SUPPORTED_LOCALES } from "../../config/constants.ts";

export const updateSiteSettingsSchema = z.object({
  logoMediaId: z.number().int().positive().nullable().optional(),
  phone: z.string().max(64).nullable().optional(),
  email: z.string().email().nullable().optional(),
  socialLinks: z.record(z.string()).optional(),
});

const translationInput = z.object({
  locale: z.enum(SUPPORTED_LOCALES),
  tagline: z.string().max(500).optional(),
});

export const upsertSiteSettingsTranslationSchema = translationInput.omit({ locale: true }).partial();
