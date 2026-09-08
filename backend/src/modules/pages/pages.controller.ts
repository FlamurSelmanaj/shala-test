import type { Request, Response } from "express";
import * as service from "./pages.service.ts";
import { createPageSchema, updatePageSchema, upsertPageTranslationSchema } from "./pages.validation.ts";
import { assertLocale } from "../../lib/translation.ts";
import { asString } from "../../lib/http.ts";

export async function getPublicBySlugHandler(req: Request, res: Response): Promise<void> {
  const data = await service.getPublicPageBySlug(asString(req.params.slug), req.locale);
  res.json({ data });
}

export async function listAdminHandler(_req: Request, res: Response): Promise<void> {
  res.json({ data: await service.listPagesAdmin() });
}

export async function getAdminHandler(req: Request, res: Response): Promise<void> {
  res.json({ data: await service.getPageAdminOr404(Number(req.params.id)) });
}

export async function createHandler(req: Request, res: Response): Promise<void> {
  const body = createPageSchema.parse(req.body);
  res.status(201).json({ data: await service.createPage(body) });
}

export async function updateHandler(req: Request, res: Response): Promise<void> {
  const body = updatePageSchema.parse(req.body);
  res.json({ data: await service.updatePage(Number(req.params.id), body) });
}

export async function deleteHandler(req: Request, res: Response): Promise<void> {
  await service.deletePage(Number(req.params.id));
  res.status(204).send();
}

export async function upsertTranslationHandler(req: Request, res: Response): Promise<void> {
  const locale = assertLocale(req.params.locale);
  const body = upsertPageTranslationSchema.parse(req.body);
  res.json({ data: await service.upsertPageTranslation(Number(req.params.id), locale, body) });
}
