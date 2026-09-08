import { z } from "zod";

export const updateMediaSchema = z.object({ folder: z.string().max(255).optional() });

export const upsertMediaTranslationSchema = z.object({
  altText: z.string().max(255).optional(),
  caption: z.string().max(500).optional(),
});
