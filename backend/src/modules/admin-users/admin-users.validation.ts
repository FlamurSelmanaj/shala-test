import { z } from "zod";

export const updateAdminUserSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  role: z.string().max(32).optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});
