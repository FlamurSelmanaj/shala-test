import type { Request, Response } from "express";
import * as service from "./attributes.service.ts";
import {
  createAttributeSchema,
  updateAttributeSchema,
  upsertAttributeTranslationSchema,
  createAttributeOptionSchema,
  updateAttributeOptionSchema,
  upsertAttributeOptionTranslationSchema,
} from "./attributes.validation.ts";
import { assertLocale } from "../../lib/translation.ts";

export async function listHandler(_req: Request, res: Response): Promise<void> {
  res.json({ data: await service.listAttributesAdmin() });
}

export async function getHandler(req: Request, res: Response): Promise<void> {
  res.json({ data: await service.getAttributeAdminOr404(Number(req.params.id)) });
}

export async function createHandler(req: Request, res: Response): Promise<void> {
  const body = createAttributeSchema.parse(req.body);
  res.status(201).json({ data: await service.createAttribute(body) });
}

export async function updateHandler(req: Request, res: Response): Promise<void> {
  const body = updateAttributeSchema.parse(req.body);
  res.json({ data: await service.updateAttribute(Number(req.params.id), body) });
}

export async function deleteHandler(req: Request, res: Response): Promise<void> {
  await service.deleteAttribute(Number(req.params.id));
  res.status(204).send();
}

export async function upsertTranslationHandler(req: Request, res: Response): Promise<void> {
  const locale = assertLocale(req.params.locale);
  const body = upsertAttributeTranslationSchema.parse(req.body);
  res.json({ data: await service.upsertAttributeTranslation(Number(req.params.id), locale, body) });
}

export async function createOptionHandler(req: Request, res: Response): Promise<void> {
  const body = createAttributeOptionSchema.parse(req.body);
  res.status(201).json({ data: await service.createAttributeOption(Number(req.params.id), body) });
}

export async function updateOptionHandler(req: Request, res: Response): Promise<void> {
  const body = updateAttributeOptionSchema.parse(req.body);
  res.json({ data: await service.updateAttributeOption(Number(req.params.optionId), body) });
}

export async function deleteOptionHandler(req: Request, res: Response): Promise<void> {
  await service.deleteAttributeOption(Number(req.params.optionId));
  res.status(204).send();
}

export async function upsertOptionTranslationHandler(req: Request, res: Response): Promise<void> {
  const locale = assertLocale(req.params.locale);
  const body = upsertAttributeOptionTranslationSchema.parse(req.body);
  res.json({ data: await service.upsertAttributeOptionTranslation(Number(req.params.optionId), locale, body) });
}
