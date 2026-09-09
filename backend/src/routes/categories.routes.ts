import { Router } from "express";
import { Category, CategoryTranslation, Product } from "../models/index.ts";
import { sequelize } from "../db/sequelize.ts";
import { categoryCreateSchema, categoryUpdateSchema } from "../schemas.ts";
import { requireAuth } from "../middleware/auth.ts";
import type { Lang } from "../types/lang.ts";

export const categoriesRouter = Router();

const LANGS: Lang[] = ["de", "en", "sq"];

categoriesRouter.post("/", requireAuth, async (req, res) => {
  const parsed = categoryCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid category payload", details: parsed.error.flatten() });
    return;
  }

  const { slug, name, icon } = parsed.data;
  const existing = await Category.findOne({ where: { slug } });
  if (existing) {
    res.status(409).json({ error: "Category slug already exists" });
    return;
  }

  const category = await sequelize.transaction(async (t) => {
    const category = await Category.create({ slug, icon }, { transaction: t });
    await CategoryTranslation.bulkCreate(
      LANGS.map((lang) => ({ categoryId: category.id, locale: lang, name: name[lang] })),
      { transaction: t },
    );
    return category;
  });

  res.status(201).json({ id: category.slug, slug: category.slug, icon: category.icon ?? "", name });
});

categoriesRouter.patch("/:id", requireAuth, async (req, res) => {
  const parsed = categoryUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid category patch", details: parsed.error.flatten() });
    return;
  }

  const category = await Category.findOne({ where: { slug: req.params.id } });
  if (!category) {
    res.status(404).json({ error: "Category not found" });
    return;
  }

  const { name, icon, slug } = parsed.data;

  await sequelize.transaction(async (t) => {
    if (icon !== undefined || slug !== undefined) {
      await category.update({ ...(icon !== undefined ? { icon } : {}), ...(slug !== undefined ? { slug } : {}) }, { transaction: t });
    }
    if (name) {
      for (const lang of LANGS) {
        if (name[lang] === undefined) continue;
        await CategoryTranslation.upsert(
          { categoryId: category.id, locale: lang, name: name[lang] },
          { transaction: t },
        );
      }
    }
  });

  const translations = await CategoryTranslation.findAll({ where: { categoryId: category.id } });
  res.json({
    id: category.slug,
    slug: category.slug,
    icon: category.icon ?? "",
    name: Object.fromEntries(translations.map((tr) => [tr.locale, tr.name])),
  });
});

categoriesRouter.delete("/:id", requireAuth, async (req, res) => {
  const category = await Category.findOne({ where: { slug: req.params.id } });
  if (!category) {
    res.status(404).json({ error: "Category not found" });
    return;
  }

  await Product.destroy({ where: { categoryId: category.id } });
  await category.destroy();
  res.status(204).send();
});
