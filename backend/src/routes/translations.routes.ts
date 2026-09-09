import { Router } from "express";
import { Translation } from "../models/index.ts";
import { translationsPatchSchema } from "../schemas.ts";
import { requireAuth } from "../middleware/auth.ts";
import type { Lang } from "../types/lang.ts";

export const translationsRouter = Router();

translationsRouter.patch("/", requireAuth, async (req, res) => {
  const parsed = translationsPatchSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid translations patch", details: parsed.error.flatten() });
    return;
  }

  // Merge server-side rather than trusting the caller to always send the full
  // dictionary — a partial PATCH previously wiped a whole language's dictionary
  // down to one key when this was a raw replace (see tasks/lessons.md).
  const langs = Object.keys(parsed.data) as Lang[];
  for (const lang of langs) {
    const incoming = parsed.data[lang]!;
    const existing = await Translation.findByPk(lang);
    const data = { ...(existing?.data ?? {}), ...incoming };
    await Translation.upsert({ lang, data });
  }

  const rows = await Translation.findAll();
  const translations = rows.reduce<Record<string, Record<string, string>>>((acc, row) => {
    acc[row.lang] = row.data;
    return acc;
  }, {});

  res.json(translations);
});
