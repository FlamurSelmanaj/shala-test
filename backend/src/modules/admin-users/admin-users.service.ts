import { Admin } from "../../db/models/index.ts";
import { NotFoundError, UnauthorizedError } from "../../lib/errors.ts";
import { hashPassword, verifyPassword } from "../../lib/password.ts";

export async function listAdminUsers() {
  return Admin.findAll({ attributes: { exclude: ["passwordHash"] } });
}

export async function getAdminUserOr404(id: number) {
  const admin = await Admin.findByPk(id, { attributes: { exclude: ["passwordHash"] } });
  if (!admin) throw new NotFoundError("Admin user not found");
  return admin;
}

export async function updateAdminUser(id: number, input: { name?: string; role?: string }) {
  const admin = await Admin.findByPk(id);
  if (!admin) throw new NotFoundError("Admin user not found");
  if (input.name !== undefined) admin.name = input.name;
  if (input.role !== undefined) admin.role = input.role;
  await admin.save();
  return getAdminUserOr404(id);
}

export async function changeAdminPassword(id: number, currentPassword: string, newPassword: string): Promise<void> {
  const admin = await Admin.findByPk(id);
  if (!admin) throw new NotFoundError("Admin user not found");

  const valid = await verifyPassword(currentPassword, admin.passwordHash);
  if (!valid) throw new UnauthorizedError("Current password is incorrect");

  admin.passwordHash = await hashPassword(newPassword);
  admin.tokenVersion += 1;
  await admin.save();
}
