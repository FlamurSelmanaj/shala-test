import type { Request, Response } from "express";
import * as service from "./navigation.service.ts";
import {
  createNavigationItemSchema,
  updateNavigationItemSchema,
  upsertNavigationItemTranslationSchema,
  reorderNavigationSchema,
} from "./navigation.validation.ts";
import { assertLocale } from "../../lib/translation.ts";

export async function getPublicHandler(req: Request, res: Response): Promise<void> {
  res.json({ data: await service.getPublicNavigationTree(req.locale) });
}

export async function listAdminHandler(_req: Request, res: Response): Promise<void> {
  res.json({ data: await service.listNavigationAdmin() });
}

export async function createHandler(req: Request, res: Response): Promise<void> {
  const body = createNavigationItemSchema.parse(req.body);
  res.status(201).json({ data: await service.createNavigationItem(body) });
}

export async function updateHandler(req: Request, res: Response): Promise<void> {
  const body = updateNavigationItemSchema.parse(req.body);
  res.json({ data: await service.updateNavigationItem(Number(req.params.id), body) });
}

export async function deleteHandler(req: Request, res: Response): Promise<void> {
  await service.deleteNavigationItem(Number(req.params.id));
  res.status(204).send();
}

export async function upsertTranslationHandler(req: Request, res: Response): Promise<void> {
  const locale = assertLocale(req.params.locale);
  const body = upsertNavigationItemTranslationSchema.parse(req.body);
  res.json({ data: await service.upsertNavigationItemTranslation(Number(req.params.id), locale, body) });
}

export async function reorderHandler(req: Request, res: Response): Promise<void> {
  const body = reorderNavigationSchema.parse(req.body);
  res.json({ data: await service.reorderNavigation(body.order) });
}
