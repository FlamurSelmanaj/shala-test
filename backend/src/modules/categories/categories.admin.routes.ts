import { Router } from "express";
import * as controller from "./categories.controller.ts";

export const categoriesAdminRouter = Router();

categoriesAdminRouter.get("/", controller.listAdminHandler);
categoriesAdminRouter.post("/", controller.createHandler);
categoriesAdminRouter.get("/:id", controller.getAdminHandler);
categoriesAdminRouter.patch("/:id", controller.updateHandler);
categoriesAdminRouter.delete("/:id", controller.deleteHandler);
categoriesAdminRouter.put("/:id/translations/:locale", controller.upsertTranslationHandler);
categoriesAdminRouter.put("/:id/attributes", controller.setAttributesHandler);
