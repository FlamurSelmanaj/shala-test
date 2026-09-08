import type { Request, Response } from "express";
import * as service from "./categories.service.ts";
import {
  createCategorySchema,
  updateCategorySchema,
  upsertCategoryTranslationSchema,
  setCategoryAttributesSchema,
} from "./categories.validation.ts";
import { assertLocale } from "../../lib/translation.ts";
import { asString } from "../../lib/http.ts";

export async function listPublicHandler(req: Request, res: Response): Promise<void> {
  const parentIdRaw = req.query.parentId;
  let parentId: number | null | undefined;
  if (parentIdRaw === "null") parentId = null;
  else if (parentIdRaw !== undefined) parentId = Number(parentIdRaw);

  const data = await service.listPublicCategories(req.locale, parentId);
  res.json({ data });
}

export async function getPublicBySlugHandler(req: Request, res: Response): Promise<void> {
  const data = await service.getPublicCategoryBySlug(asString(req.params.slug), req.locale);
  res.json({ data });
}

export async function getPublicAttributesHandler(req: Request, res: Response): Promise<void> {
  const data = await service.getPublicCategoryAttributes(asString(req.params.slug), req.locale);
  res.json({ data });
}

export async function listAdminHandler(_req: Request, res: Response): Promise<void> {
  const data = await service.listCategoriesAdmin();
  res.json({ data });
}

export async function getAdminHandler(req: Request, res: Response): Promise<void> {
  const data = await service.getCategoryAdminOr404(Number(req.params.id));
  res.json({ data });
}

export async function createHandler(req: Request, res: Response): Promise<void> {
  const body = createCategorySchema.parse(req.body);
  const data = await service.createCategory(body);
  res.status(201).json({ data });
}

export async function updateHandler(req: Request, res: Response): Promise<void> {
  const body = updateCategorySchema.parse(req.body);
  const data = await service.updateCategory(Number(req.params.id), body);
  res.json({ data });
}

export async function deleteHandler(req: Request, res: Response): Promise<void> {
  await service.deleteCategory(Number(req.params.id));
  res.status(204).send();
}

export async function upsertTranslationHandler(req: Request, res: Response): Promise<void> {
  const locale = assertLocale(req.params.locale);
  const body = upsertCategoryTranslationSchema.parse(req.body);
  const data = await service.upsertCategoryTranslation(Number(req.params.id), locale, body);
  res.json({ data });
}

export async function setAttributesHandler(req: Request, res: Response): Promise<void> {
  const body = setCategoryAttributesSchema.parse(req.body);
  const data = await service.setCategoryAttributes(Number(req.params.id), body.attributeIds);
  res.json({ data });
}
