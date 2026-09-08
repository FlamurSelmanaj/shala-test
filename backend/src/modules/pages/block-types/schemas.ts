import { z } from "zod";

const mediaRef = z.number().int().positive().nullable().optional();

export const heroSliderSchema = z.object({
  slides: z
    .array(
      z.object({
        title: z.string().optional(),
        subtitle: z.string().optional(),
        badge: z.string().optional(),
        imageId: mediaRef,
      }),
    )
    .optional(),
});

export const categoryGridSchema = z.object({
  heading: z.string().optional(),
  categoryIds: z.array(z.number().int().positive()).optional(),
});

export const richTextSchema = z.object({
  heading: z.string().optional(),
  body: z.string().optional(),
  imageId: mediaRef,
});

export const productNewsTeaserSchema = z.object({
  heading: z.string().optional(),
  productIds: z.array(z.number().int().positive()).optional(),
});

export const processStepsSchema = z.object({
  heading: z.string().optional(),
  steps: z
    .array(z.object({ title: z.string().optional(), text: z.string().optional(), imageId: mediaRef }))
    .optional(),
});

export const ctaBannerSchema = z.object({
  heading: z.string().optional(),
  body: z.string().optional(),
  ctaLabel: z.string().optional(),
  ctaUrl: z.string().optional(),
  imageId: mediaRef,
});

export const serviceCardsSchema = z.object({
  cards: z
    .array(
      z.object({
        title: z.string().optional(),
        text: z.string().optional(),
        imageId: mediaRef,
        link: z.string().optional(),
      }),
    )
    .optional(),
});

export const magazineTeaserSchema = z.object({
  heading: z.string().optional(),
  cards: z.array(z.object({ title: z.string().optional(), imageId: mediaRef, link: z.string().optional() })).optional(),
});

const BLOCK_SCHEMAS: Record<string, z.ZodTypeAny> = {
  HERO_SLIDER: heroSliderSchema,
  CATEGORY_GRID: categoryGridSchema,
  RICH_TEXT: richTextSchema,
  PRODUCT_NEWS_TEASER: productNewsTeaserSchema,
  PROCESS_STEPS: processStepsSchema,
  CTA_BANNER: ctaBannerSchema,
  SERVICE_CARDS: serviceCardsSchema,
  MAGAZINE_TEASER: magazineTeaserSchema,
};

/** Known block types are strictly validated; custom/future types stay freeform JSON. */
export function validateBlockData(type: string, data: unknown): Record<string, unknown> {
  const schema = BLOCK_SCHEMAS[type];
  if (!schema) return data as Record<string, unknown>;
  return schema.parse(data) as Record<string, unknown>;
}
