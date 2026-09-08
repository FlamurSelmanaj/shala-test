import type { Request, Response } from "express";
import * as service from "./admin-users.service.ts";
import { updateAdminUserSchema, changePasswordSchema } from "./admin-users.validation.ts";
import { ForbiddenError } from "../../lib/errors.ts";

export async function listHandler(_req: Request, res: Response): Promise<void> {
  res.json({ data: await service.listAdminUsers() });
}

export async function updateHandler(req: Request, res: Response): Promise<void> {
  const body = updateAdminUserSchema.parse(req.body);
  res.json({ data: await service.updateAdminUser(Number(req.params.id), body) });
}

export async function changePasswordHandler(req: Request, res: Response): Promise<void> {
  if (!req.admin || req.admin.id !== Number(req.params.id)) {
    throw new ForbiddenError("Can only change your own password");
  }
  const body = changePasswordSchema.parse(req.body);
  await service.changeAdminPassword(Number(req.params.id), body.currentPassword, body.newPassword);
  res.status(204).send();
}
