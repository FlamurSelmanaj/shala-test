import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { verifyAdminToken } from "../lib/jwt.ts";
import { UnauthorizedError } from "../lib/errors.ts";
import { Admin } from "../db/models/index.ts";

export async function requireAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      throw new UnauthorizedError("Missing bearer token");
    }

    const token = header.slice("Bearer ".length).trim();
    const payload = verifyAdminToken(token);

    const admin = await Admin.findByPk(payload.sub);
    if (!admin || admin.tokenVersion !== payload.tokenVersion) {
      throw new UnauthorizedError("Token is no longer valid");
    }

    req.admin = { id: admin.id, email: admin.email, role: admin.role };
    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError) {
      next(new UnauthorizedError("Invalid or expired token"));
      return;
    }
    next(err);
  }
}
