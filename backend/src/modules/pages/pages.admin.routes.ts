import { Router } from "express";
import * as pagesController from "./pages.controller.ts";
import { addBlockHandler, reorderBlocksHandler } from "./blocks.controller.ts";

export const pagesAdminRouter = Router();

pagesAdminRouter.get("/", pagesController.listAdminHandler);
pagesAdminRouter.post("/", pagesController.createHandler);
pagesAdminRouter.get("/:id", pagesController.getAdminHandler);
pagesAdminRouter.patch("/:id", pagesController.updateHandler);
pagesAdminRouter.delete("/:id", pagesController.deleteHandler);
pagesAdminRouter.put("/:id/translations/:locale", pagesController.upsertTranslationHandler);
pagesAdminRouter.post("/:id/blocks", addBlockHandler);
pagesAdminRouter.patch("/:id/blocks/reorder", reorderBlocksHandler);
