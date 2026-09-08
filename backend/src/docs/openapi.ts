import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { registry } from "./registry.ts";
import "./paths.ts"; // side-effect: registers every path onto `registry`

export function getOpenApiDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      title: "Shala CMS API",
      version: "1.0.0",
      description:
        "Public content endpoints are unauthenticated. Everything under /admin requires a Bearer JWT " +
        "from POST /auth/login. Locale-aware endpoints accept ?locale=en|sq (default en, falls back to en).",
    },
    servers: [{ url: "/api/v1" }],
  });
}
