import { Router } from "express";
import { localeMiddleware } from "../middleware/locale.middleware.ts";
import { authRouter } from "../modules/auth/auth.routes.ts";
import { categoriesRouter } from "../modules/categories/categories.routes.ts";
import { productsRouter } from "../modules/products/products.routes.ts";
import { pagesRouter } from "../modules/pages/pages.routes.ts";
import { navigationRouter } from "../modules/navigation/navigation.routes.ts";
import { footerRouter } from "../modules/footer/footer.routes.ts";
import { siteSettingsRouter } from "../modules/site-settings/site-settings.routes.ts";
import { adminRouter } from "./admin.routes.ts";

export const apiRouter = Router();

apiRouter.use(localeMiddleware);

apiRouter.get("/health", (_req, res) => res.json({ status: "ok" }));

// Public, unauthenticated content endpoints.
apiRouter.use("/auth", authRouter);
apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/products", productsRouter);
apiRouter.use("/pages", pagesRouter);
apiRouter.use("/navigation", navigationRouter);
apiRouter.use("/footer", footerRouter);
apiRouter.use("/site-settings", siteSettingsRouter);

// Everything under here requires a JWT — see routes/admin.routes.ts.
apiRouter.use("/admin", adminRouter);
