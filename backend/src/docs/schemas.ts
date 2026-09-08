import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z, type ZodTypeAny } from "zod";
import { SUPPORTED_LOCALES } from "../config/constants.ts";

// Idempotent — safe even if registry.ts has already patched the Zod prototype.
extendZodWithOpenApi(z);

export const idParam = z.object({ id: z.coerce.number().int().positive() });
export const slugParam = z.object({ slug: z.string() });
export const localeParam = z.object({ locale: z.enum(SUPPORTED_LOCALES) });

export const localeQuery = z.object({
  locale: z.enum(SUPPORTED_LOCALES).optional().openapi({ description: "Defaults to 'en'; falls back to 'en' if the requested locale has no translation." }),
});

export const paginationQuery = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().optional(),
});

export const paginationMeta = z.object({
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export const errorResponseSchema = z.object({
  error: z.object({
    message: z.string(),
    code: z.string(),
    details: z.unknown().optional(),
  }),
});

export function dataEnvelope(schema: ZodTypeAny = z.record(z.unknown())) {
  return z.object({ data: schema });
}

export function listEnvelope(schema: ZodTypeAny = z.record(z.unknown())) {
  return z.object({ data: z.array(schema), meta: paginationMeta.optional() });
}

export function jsonContent(schema: ZodTypeAny) {
  return { content: { "application/json": { schema } } };
}

export const OK_ERROR_RESPONSES = {
  400: { description: "Validation error", ...jsonContent(errorResponseSchema) },
  401: { description: "Missing or invalid bearer token", ...jsonContent(errorResponseSchema) },
  404: { description: "Not found", ...jsonContent(errorResponseSchema) },
};
