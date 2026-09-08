import { Router } from "express";
import * as controller from "./blocks.controller.ts";

export const blocksAdminRouter = Router();

blocksAdminRouter.patch("/:id", controller.updateBlockHandler);
blocksAdminRouter.delete("/:id", controller.deleteBlockHandler);
blocksAdminRouter.put("/:id/translations/:locale", controller.upsertBlockTranslationHandler);
