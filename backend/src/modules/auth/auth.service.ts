import { Admin } from "../../db/models/index.ts";
import { verifyPassword } from "../../lib/password.ts";
import { signAdminToken } from "../../lib/jwt.ts";
import { UnauthorizedError } from "../../lib/errors.ts";

const LOCKOUT_THRESHOLD = 10;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;

export interface LoginResult {
  token: string;
  admin: { id: number; email: string; name: string; role: string };
}

export async function login(email: string, password: string): Promise<LoginResult> {
  const admin = await Admin.findOne({ where: { email } });
  const invalidCredentials = () => new UnauthorizedError("Invalid credentials");

  if (!admin) throw invalidCredentials();

  if (admin.lockedUntil && admin.lockedUntil.getTime() > Date.now()) {
    throw new UnauthorizedError("Account temporarily locked due to repeated failed logins. Try again later.");
  }

  const passwordValid = await verifyPassword(password, admin.passwordHash);
  if (!passwordValid) {
    admin.failedLoginAttempts += 1;
    if (admin.failedLoginAttempts >= LOCKOUT_THRESHOLD) {
      admin.lockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MS);
      admin.failedLoginAttempts = 0;
    }
    await admin.save();
    throw invalidCredentials();
  }

  admin.failedLoginAttempts = 0;
  admin.lockedUntil = null;
  admin.lastLoginAt = new Date();
  await admin.save();

  const token = signAdminToken({
    sub: admin.id,
    email: admin.email,
    role: admin.role,
    tokenVersion: admin.tokenVersion,
  });

  return {
    token,
    admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
  };
}
