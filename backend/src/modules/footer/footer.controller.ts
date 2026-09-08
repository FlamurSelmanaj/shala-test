import type { Request, Response } from "express";
import * as service from "./footer.service.ts";
import {
  createFooterColumnSchema,
  updateFooterColumnSchema,
  upsertFooterColumnTranslationSchema,
  createFooterLinkSchema,
  updateFooterLinkSchema,
  upsertFooterLinkTranslationSchema,
} from "./footer.validation.ts";
import { assertLocale } from "../../lib/translation.ts";

export async function getPublicHandler(req: Request, res: Response): Promise<void> {
  res.json({ data: await service.getPublicFooter(req.locale) });
}

export async function listColumnsHandler(_req: Request, res: Response): Promise<void> {
  res.json({ data: await service.listFooterColumnsAdmin() });
}

export async function createColumnHandler(req: Request, res: Response): Promise<void> {
  const body = createFooterColumnSchema.parse(req.body);
  res.status(201).json({ data: await service.createFooterColumn(body) });
}

export async function updateColumnHandler(req: Request, res: Response): Promise<void> {
  const body = updateFooterColumnSchema.parse(req.body);
  res.json({ data: await service.updateFooterColumn(Number(req.params.id), body) });
}

export async function deleteColumnHandler(req: Request, res: Response): Promise<void> {
  await service.deleteFooterColumn(Number(req.params.id));
  res.status(204).send();
}

export async function upsertColumnTranslationHandler(req: Request, res: Response): Promise<void> {
  const locale = assertLocale(req.params.locale);
  const body = upsertFooterColumnTranslationSchema.parse(req.body);
  res.json({ data: await service.upsertFooterColumnTranslation(Number(req.params.id), locale, body) });
}

export async function createLinkHandler(req: Request, res: Response): Promise<void> {
  const body = createFooterLinkSchema.parse(req.body);
  const data = await service.createFooterLink(Number(req.params.id), body);
  res.status(201).json({ data });
}

export async function updateLinkHandler(req: Request, res: Response): Promise<void> {
  const body = updateFooterLinkSchema.parse(req.body);
  res.json({ data: await service.updateFooterLink(Number(req.params.linkId), body) });
}

export async function deleteLinkHandler(req: Request, res: Response): Promise<void> {
  await service.deleteFooterLink(Number(req.params.linkId));
  res.status(204).send();
}

export async function upsertLinkTranslationHandler(req: Request, res: Response): Promise<void> {
  const locale = assertLocale(req.params.locale);
  const body = upsertFooterLinkTranslationSchema.parse(req.body);
  res.json({ data: await service.upsertFooterLinkTranslation(Number(req.params.linkId), locale, body) });
}
