import { extendZodWithOpenApi, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

// Patches the Zod prototype so schemas can carry OpenAPI metadata. Must run
// before any schema is passed into the generator (safe to call once, here,
// even though most schemas in modules/**/*.validation.ts were already
// defined — this is a prototype-level patch, not per-instance).
extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();

export const BEARER_AUTH = "bearerAuth";

registry.registerComponent("securitySchemes", BEARER_AUTH, {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
  description: "Obtain a token from POST /api/v1/auth/login.",
});
