import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.ts";

export interface AuthedRequest extends Request {
  user?: { id: string; email: string };
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.header("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : undefined;

  if (!token) {
    res.status(401).json({ error: "Missing bearer token" });
    return;
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret) as { sub: string; email: string };
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
