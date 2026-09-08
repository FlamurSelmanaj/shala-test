import type { NextFunction, Request, Response } from "express";
import { DEFAULT_LOCALE, isSupportedLocale } from "../config/constants.ts";

export function localeMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const requested = req.query.locale;
  req.locale = isSupportedLocale(requested) ? requested : DEFAULT_LOCALE;
  next();
}
