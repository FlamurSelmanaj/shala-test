import { Router } from "express";
import { upload } from "./upload.ts";
import * as controller from "./media.controller.ts";

export const mediaAdminRouter = Router();

mediaAdminRouter.get("/", controller.listMediaHandler);
mediaAdminRouter.post("/", upload.single("file"), controller.uploadMediaHandler);
mediaAdminRouter.patch("/:id", controller.updateMediaHandler);
mediaAdminRouter.put("/:id/translations/:locale", controller.upsertMediaTranslationHandler);
mediaAdminRouter.delete("/:id", controller.deleteMediaHandler);
