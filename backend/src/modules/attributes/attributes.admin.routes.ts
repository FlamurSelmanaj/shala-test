import { Router } from "express";
import * as controller from "./attributes.controller.ts";

export const attributesAdminRouter = Router();

attributesAdminRouter.get("/", controller.listHandler);
attributesAdminRouter.post("/", controller.createHandler);
attributesAdminRouter.get("/:id", controller.getHandler);
attributesAdminRouter.patch("/:id", controller.updateHandler);
attributesAdminRouter.delete("/:id", controller.deleteHandler);
attributesAdminRouter.put("/:id/translations/:locale", controller.upsertTranslationHandler);
attributesAdminRouter.post("/:id/options", controller.createOptionHandler);
attributesAdminRouter.patch("/:id/options/:optionId", controller.updateOptionHandler);
attributesAdminRouter.delete("/:id/options/:optionId", controller.deleteOptionHandler);
attributesAdminRouter.put("/:id/options/:optionId/translations/:locale", controller.upsertOptionTranslationHandler);
