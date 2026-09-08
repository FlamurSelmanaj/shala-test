import type { Request, Response } from "express";
import * as service from "./pages.service.ts";
import {
  createBlockSchema,
  updateBlockSchema,
  upsertBlockTranslationSchema,
  reorderBlocksSchema,
} from "./pages.validation.ts";
import { assertLocale } from "../../lib/translation.ts";

export async function addBlockHandler(req: Request, res: Response): Promise<void> {
  const body = createBlockSchema.parse(req.body);
  const data = await service.addBlock(Number(req.params.id), body);
  res.status(201).json({ data });
}

export async function reorderBlocksHandler(req: Request, res: Response): Promise<void> {
  const body = reorderBlocksSchema.parse(req.body);
  res.json({ data: await service.reorderBlocks(Number(req.params.id), body.order) });
}

export async function updateBlockHandler(req: Request, res: Response): Promise<void> {
  const body = updateBlockSchema.parse(req.body);
  res.json({ data: await service.updateBlock(Number(req.params.id), body) });
}

export async function deleteBlockHandler(req: Request, res: Response): Promise<void> {
  await service.deleteBlock(Number(req.params.id));
  res.status(204).send();
}

export async function upsertBlockTranslationHandler(req: Request, res: Response): Promise<void> {
  const locale = assertLocale(req.params.locale);
  const body = upsertBlockTranslationSchema.parse(req.body);
  res.json({ data: await service.upsertBlockTranslation(Number(req.params.id), locale, body.data) });
}
