import { Router } from "express";
import { getPublicHandler } from "./navigation.controller.ts";

export const navigationRouter = Router();

navigationRouter.get("/", getPublicHandler);
