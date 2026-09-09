import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Admin } from "../models/index.ts";
import { env } from "../config/env.ts";
import { loginSchema } from "../schemas.ts";
import { requireAuth, type AuthedRequest } from "../middleware/auth.ts";

export const authRouter = Router();

authRouter.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid credentials payload" });
    return;
  }

  const { email, password } = parsed.data;
  const admin = await Admin.findOne({ where: { email } });
  if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const token = jwt.sign({ sub: String(admin.id), email: admin.email }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  } as jwt.SignOptions);

  res.json({ token, email: admin.email });
});

authRouter.get("/me", requireAuth, (req: AuthedRequest, res) => {
  res.json({ email: req.user!.email });
});
