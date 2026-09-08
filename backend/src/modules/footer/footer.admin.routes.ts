import { Router } from "express";
import * as controller from "./footer.controller.ts";

export const footerAdminRouter = Router();

footerAdminRouter.get("/", controller.listColumnsHandler);
footerAdminRouter.post("/", controller.createColumnHandler);
footerAdminRouter.patch("/:id", controller.updateColumnHandler);
footerAdminRouter.delete("/:id", controller.deleteColumnHandler);
footerAdminRouter.put("/:id/translations/:locale", controller.upsertColumnTranslationHandler);

footerAdminRouter.post("/:id/links", controller.createLinkHandler);
footerAdminRouter.patch("/links/:linkId", controller.updateLinkHandler);
footerAdminRouter.delete("/links/:linkId", controller.deleteLinkHandler);
footerAdminRouter.put("/links/:linkId/translations/:locale", controller.upsertLinkTranslationHandler);
