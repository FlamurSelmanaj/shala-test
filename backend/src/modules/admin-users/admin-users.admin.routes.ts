import { Router } from "express";
import * as controller from "./admin-users.controller.ts";

export const adminUsersAdminRouter = Router();

adminUsersAdminRouter.get("/", controller.listHandler);
adminUsersAdminRouter.patch("/:id", controller.updateHandler);
adminUsersAdminRouter.post("/:id/change-password", controller.changePasswordHandler);
