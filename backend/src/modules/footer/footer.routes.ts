import { Router } from "express";
import { getPublicHandler } from "./footer.controller.ts";

export const footerRouter = Router();

footerRouter.get("/", getPublicHandler);
