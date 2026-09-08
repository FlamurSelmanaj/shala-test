import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { UniqueConstraintError } from "sequelize";
import { AppError } from "../lib/errors.ts";
import { env } from "../config/env.ts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        message: err.message,
        code: err.code,
        ...(err instanceof Error && "details" in err ? { details: (err as { details?: unknown }).details } : {}),
      },
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      error: { message: "Validation failed", code: "VALIDATION_ERROR", details: err.flatten() },
    });
    return;
  }

  if (err instanceof UniqueConstraintError) {
    res.status(409).json({ error: { message: "Resource already exists", code: "CONFLICT" } });
    return;
  }

  console.error(err);
  res.status(500).json({
    error: {
      message: env.NODE_ENV === "production" ? "Internal server error" : String(err),
      code: "INTERNAL_ERROR",
    },
  });
}
