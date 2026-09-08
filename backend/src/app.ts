import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import path from "node:path";
import { env } from "./config/env.ts";
import { apiRouter } from "./routes/index.ts";
import { errorHandler } from "./middleware/error-handler.middleware.ts";
import { notFoundMiddleware } from "./middleware/not-found.middleware.ts";
import { uploadsUrlBase } from "./modules/media/upload.ts";
import { getOpenApiDocument } from "./docs/openapi.ts";

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());

// Interactive API docs (Swagger UI), generated from the same Zod schemas that
// validate requests — so this can't drift from what the endpoints actually
// accept. Not linked from anywhere and not sensitive (no secrets, just shapes),
// but relaxes CSP for inline script/style, which only Swagger UI's own bundled
// page needs — scoped to this one path, the rest of the app keeps the strict
// default from the helmet() call above.
const openApiDocument = getOpenApiDocument();
app.get("/api/docs.json", (_req, res) => res.json(openApiDocument));
app.use(
  "/api/docs",
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "script-src": ["'self'", "'unsafe-inline'"],
        "style-src": ["'self'", "'unsafe-inline'"],
      },
    },
  }),
  swaggerUi.serve,
  swaggerUi.setup(openApiDocument),
);

// Dev convenience only: serves uploaded files locally. In production (GoDaddy
// cPanel shared hosting), UPLOAD_DIR points at public_html/uploads instead and
// Apache/LiteSpeed serves those files directly, bypassing Node entirely — see
// plan §9. This mount is harmless there too since nothing else uses that path.
app.use(`/${uploadsUrlBase}`, express.static(path.resolve(process.cwd(), env.UPLOAD_DIR)));

app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

app.use("/api/v1", apiRouter);

app.use(notFoundMiddleware);
app.use(errorHandler);

export default app;
