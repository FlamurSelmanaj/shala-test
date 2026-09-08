import type { Request, Response } from "express";
import * as service from "./products.service.ts";
import {
  createProductSchema,
  updateProductSchema,
  upsertProductTranslationSchema,
  addProductImageSchema,
} from "./products.validation.ts";
import { assertLocale } from "../../lib/translation.ts";
import { asString } from "../../lib/http.ts";

export async function listByCategoryHandler(req: Request, res: Response): Promise<void> {
  const result = await service.listPublicProductsByCategorySlug(
    asString(req.params.slug),
    req.locale,
    req.query as Record<string, unknown>,
  );
  res.json(result);
}

export async function getPublicBySlugHandler(req: Request, res: Response): Promise<void> {
  const data = await service.getPublicProductBySlug(asString(req.params.slug), req.locale);
  res.json({ data });
}

export async function listAdminHandler(req: Request, res: Response): Promise<void> {
  const result = await service.listProductsAdmin(req.query as Record<string, unknown>);
  res.json(result);
}

export async function getAdminHandler(req: Request, res: Response): Promise<void> {
  const data = await service.getProductAdminOr404(Number(req.params.id));
  res.json({ data });
}

export async function createHandler(req: Request, res: Response): Promise<void> {
  const body = createProductSchema.parse(req.body);
  const data = await service.createProduct(body);
  res.status(201).json({ data });
}

export async function updateHandler(req: Request, res: Response): Promise<void> {
  const body = updateProductSchema.parse(req.body);
  const data = await service.updateProduct(Number(req.params.id), body);
  res.json({ data });
}

export async function deleteHandler(req: Request, res: Response): Promise<void> {
  await service.deleteProduct(Number(req.params.id));
  res.status(204).send();
}

export async function upsertTranslationHandler(req: Request, res: Response): Promise<void> {
  const locale = assertLocale(req.params.locale);
  const body = upsertProductTranslationSchema.parse(req.body);
  const data = await service.upsertProductTranslation(Number(req.params.id), locale, body);
  res.json({ data });
}

export async function addImageHandler(req: Request, res: Response): Promise<void> {
  const body = addProductImageSchema.parse(req.body);
  const data = await service.addProductImage(Number(req.params.id), body);
  res.status(201).json({ data });
}

export async function removeImageHandler(req: Request, res: Response): Promise<void> {
  await service.removeProductImage(Number(req.params.id), Number(req.params.imageId));
  res.status(204).send();
}
