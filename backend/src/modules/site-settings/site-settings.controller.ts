import type { Request, Response } from "express";
import * as service from "./site-settings.service.ts";
import { updateSiteSettingsSchema, upsertSiteSettingsTranslationSchema } from "./site-settings.validation.ts";
import { assertLocale } from "../../lib/translation.ts";

export async function getPublicHandler(req: Request, res: Response): Promise<void> {
  res.json({ data: await service.getPublicSiteSettings(req.locale) });
}

export async function getAdminHandler(_req: Request, res: Response): Promise<void> {
  res.json({ data: await service.getSiteSettingsAdmin() });
}

export async function updateHandler(req: Request, res: Response): Promise<void> {
  const body = updateSiteSettingsSchema.parse(req.body);
  res.json({ data: await service.updateSiteSettings(body) });
}

export async function upsertTranslationHandler(req: Request, res: Response): Promise<void> {
  const locale = assertLocale(req.params.locale);
  const body = upsertSiteSettingsTranslationSchema.parse(req.body);
  res.json({ data: await service.upsertSiteSettingsTranslation(locale, body) });
}
