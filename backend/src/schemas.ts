import { z } from "zod";

const langText = z.object({ de: z.string(), en: z.string(), sq: z.string() });

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const categoryCreateSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: langText,
  icon: z.string().default(""),
});
export const categoryUpdateSchema = categoryCreateSchema.partial();

export const productCreateSchema = z.object({
  id: z.string().min(1),
  categoryId: z.string().min(1),
  name: langText,
  blurb: langText,
  image: z.string().default(""),
});
export const productUpdateSchema = productCreateSchema.partial();

export const pageUpdateSchema = z.object({
  slug: z.string().min(1).optional(),
  titleKey: z.string().min(1).optional(),
  subtitleKey: z.string().min(1).optional(),
  heroImage: z.string().optional(),
  sections: z.array(z.string()).optional(),
});

const langMap = z.record(z.string(), z.string());
export const translationsPatchSchema = z.object({
  de: langMap.optional(),
  en: langMap.optional(),
  sq: langMap.optional(),
});
