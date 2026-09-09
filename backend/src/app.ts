import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env.ts";
import { authRouter } from "./routes/auth.routes.ts";
import { dbRouter } from "./routes/db.routes.ts";
import { pagesRouter } from "./routes/pages.routes.ts";
import { translationsRouter } from "./routes/translations.routes.ts";
import { categoriesRouter } from "./routes/categories.routes.ts";
import { productsRouter } from "./routes/products.routes.ts";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Backend is running"
  });
});

app.use("/auth", authRouter);
app.use(dbRouter);
app.use("/pages", pagesRouter);
app.use("/translations", translationsRouter);
app.use("/categories", categoriesRouter);
app.use("/products", productsRouter);

export default app;
