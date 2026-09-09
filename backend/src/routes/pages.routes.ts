import { Router } from "express";
import { SiteContent } from "../models/index.ts";
import { pageUpdateSchema } from "../schemas.ts";
import { requireAuth } from "../middleware/auth.ts";

export const pagesRouter = Router();

interface PageRecord {
  id: string;
  slug: string;
  titleKey: string;
  subtitleKey: string;
  heroImage: string;
  sections: string[];
}

pagesRouter.patch("/:id", requireAuth, async (req, res) => {
  const parsed = pageUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid page patch", details: parsed.error.flatten() });
    return;
  }

  const siteContent = await SiteContent.findByPk(1);
  if (!siteContent) {
    res.status(500).json({ error: "Site content is not seeded" });
    return;
  }

  const pages = siteContent.pages as PageRecord[];
  const index = pages.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: "Page not found" });
    return;
  }

  const updated = { ...pages[index], ...parsed.data };
  const nextPages = [...pages];
  nextPages[index] = updated;

  await siteContent.update({ pages: nextPages });
  res.json(updated);
});
