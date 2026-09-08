import { Router } from "express";
import * as controller from "./products.controller.ts";

export const productsRouter = Router();

productsRouter.get("/:slug", controller.getPublicBySlugHandler);
