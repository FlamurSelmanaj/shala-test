import { Router } from "express";
import * as controller from "./navigation.controller.ts";

export const navigationAdminRouter = Router();

navigationAdminRouter.get("/", controller.listAdminHandler);
navigationAdminRouter.post("/", controller.createHandler);
navigationAdminRouter.patch("/reorder", controller.reorderHandler);
navigationAdminRouter.patch("/:id", controller.updateHandler);
navigationAdminRouter.delete("/:id", controller.deleteHandler);
navigationAdminRouter.put("/:id/translations/:locale", controller.upsertTranslationHandler);
