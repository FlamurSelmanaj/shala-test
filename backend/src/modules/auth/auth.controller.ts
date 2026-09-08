import type { Request, Response } from "express";
import { loginSchema } from "./auth.validation.ts";
import { login } from "./auth.service.ts";

export async function loginHandler(req: Request, res: Response): Promise<void> {
  const { email, password } = loginSchema.parse(req.body);
  const result = await login(email, password);
  res.json({ data: result });
}

export async function meHandler(req: Request, res: Response): Promise<void> {
  res.json({ data: req.admin });
}
