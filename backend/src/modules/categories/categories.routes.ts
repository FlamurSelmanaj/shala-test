import { Router } from "express";
import * as controller from "./categories.controller.ts";
import { listByCategoryHandler } from "../products/products.controller.ts";

export const categoriesRouter = Router();

categoriesRouter.get("/", controller.listPublicHandler);
categoriesRouter.get("/:slug", controller.getPublicBySlugHandler);
categoriesRouter.get("/:slug/attributes", controller.getPublicAttributesHandler);
categoriesRouter.get("/:slug/products", listByCategoryHandler);
