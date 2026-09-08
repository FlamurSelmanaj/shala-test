import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.ts";

export interface AdminTokenPayload {
  sub: number;
  email: string;
  role: string;
  tokenVersion: number;
}

export function signAdminToken(payload: AdminTokenPayload): string {
  const options: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"] };
  return jwt.sign(payload, env.JWT_SECRET, options);
}

export function verifyAdminToken(token: string): AdminTokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as unknown as AdminTokenPayload;
}
