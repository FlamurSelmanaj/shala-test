import type { Request, Response } from "express";
import * as mediaService from "./media.service.ts";
import { BadRequestError } from "../../lib/errors.ts";
import { assertLocale } from "../../lib/translation.ts";
import { updateMediaSchema, upsertMediaTranslationSchema } from "./media.validation.ts";

export async function listMediaHandler(req: Request, res: Response): Promise<void> {
  const result = await mediaService.listMediaAdmin(req.query as Record<string, unknown>);
  res.json(result);
}

export async function uploadMediaHandler(req: Request, res: Response): Promise<void> {
  if (!req.file) throw new BadRequestError("No file uploaded");
  if (!req.admin) throw new BadRequestError("Missing admin context");
  const folder = typeof req.body.folder === "string" ? req.body.folder : undefined;
  const media = await mediaService.createMedia({ file: req.file, uploadedById: req.admin.id, folder });
  res.status(201).json({ data: media });
}

export async function updateMediaHandler(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const body = updateMediaSchema.parse(req.body);
  const media = await mediaService.updateMedia(id, body);
  res.json({ data: media });
}

export async function upsertMediaTranslationHandler(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const locale = assertLocale(req.params.locale);
  const body = upsertMediaTranslationSchema.parse(req.body);
  const translation = await mediaService.upsertMediaTranslation(id, locale, body);
  res.json({ data: translation });
}

export async function deleteMediaHandler(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  await mediaService.deleteMedia(id);
  res.status(204).send();
}
