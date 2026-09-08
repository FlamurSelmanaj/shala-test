import { Router } from "express";
import { loginHandler, meHandler } from "./auth.controller.ts";
import { loginRateLimiter } from "../../middleware/rate-limit.middleware.ts";
import { requireAuth } from "../../middleware/auth.middleware.ts";

export const authRouter = Router();

authRouter.post("/login", loginRateLimiter, loginHandler);
authRouter.get("/me", requireAuth, meHandler);
