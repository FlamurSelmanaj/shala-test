import { Router } from "express";
import * as controller from "./products.controller.ts";

export const productsAdminRouter = Router();

productsAdminRouter.get("/", controller.listAdminHandler);
productsAdminRouter.post("/", controller.createHandler);
productsAdminRouter.get("/:id", controller.getAdminHandler);
productsAdminRouter.patch("/:id", controller.updateHandler);
productsAdminRouter.delete("/:id", controller.deleteHandler);
productsAdminRouter.put("/:id/translations/:locale", controller.upsertTranslationHandler);
productsAdminRouter.post("/:id/images", controller.addImageHandler);
productsAdminRouter.delete("/:id/images/:imageId", controller.removeImageHandler);
