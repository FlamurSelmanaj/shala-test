import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.ts";
import { categoriesAdminRouter } from "../modules/categories/categories.admin.routes.ts";
import { productsAdminRouter } from "../modules/products/products.admin.routes.ts";
import { attributesAdminRouter } from "../modules/attributes/attributes.admin.routes.ts";
import { pagesAdminRouter } from "../modules/pages/pages.admin.routes.ts";
import { blocksAdminRouter } from "../modules/pages/blocks.admin.routes.ts";
import { navigationAdminRouter } from "../modules/navigation/navigation.admin.routes.ts";
import { footerAdminRouter } from "../modules/footer/footer.admin.routes.ts";
import { siteSettingsAdminRouter } from "../modules/site-settings/site-settings.admin.routes.ts";
import { mediaAdminRouter } from "../modules/media/media.admin.routes.ts";
import { adminUsersAdminRouter } from "../modules/admin-users/admin-users.admin.routes.ts";

export const adminRouter = Router();

// Single security boundary: every route mounted below this line requires a valid admin JWT.
// See plan §2.4 — this is deliberately router-level, not per-route, so new admin
// resources inherit protection automatically just by being registered here.
adminRouter.use(requireAuth);

adminRouter.use("/categories", categoriesAdminRouter);
adminRouter.use("/products", productsAdminRouter);
adminRouter.use("/attributes", attributesAdminRouter);
adminRouter.use("/pages", pagesAdminRouter);
adminRouter.use("/blocks", blocksAdminRouter);
adminRouter.use("/navigation", navigationAdminRouter);
adminRouter.use("/footer-columns", footerAdminRouter);
adminRouter.use("/site-settings", siteSettingsAdminRouter);
adminRouter.use("/media", mediaAdminRouter);
adminRouter.use("/users", adminUsersAdminRouter);
