import { Router } from "express";
import { getPublicBySlugHandler } from "./pages.controller.ts";

export const pagesRouter = Router();

pagesRouter.get("/:slug", getPublicBySlugHandler);
