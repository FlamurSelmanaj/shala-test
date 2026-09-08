import { Router } from "express";
import { getPublicHandler } from "./site-settings.controller.ts";

export const siteSettingsRouter = Router();

siteSettingsRouter.get("/", getPublicHandler);
