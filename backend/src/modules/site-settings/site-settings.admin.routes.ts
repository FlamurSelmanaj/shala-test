import { Router } from "express";
import * as controller from "./site-settings.controller.ts";

export const siteSettingsAdminRouter = Router();

siteSettingsAdminRouter.get("/", controller.getAdminHandler);
siteSettingsAdminRouter.patch("/", controller.updateHandler);
siteSettingsAdminRouter.put("/translations/:locale", controller.upsertTranslationHandler);
