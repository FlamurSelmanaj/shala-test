import { Router } from "express";
import { Category, Product, ProductTranslation } from "../models/index.ts";
import { sequelize } from "../db/sequelize.ts";
import { productCreateSchema, productUpdateSchema } from "../schemas.ts";
import { requireAuth } from "../middleware/auth.ts";
import type { Lang } from "../types/lang.ts";

export const productsRouter = Router();

const LANGS: Lang[] = ["de", "en", "sq"];

async function serialize(product: Product, category: Category | null) {
  const translations = await ProductTranslation.findAll({ where: { productId: product.id } });
  return {
    id: product.slug,
    categoryId: category?.slug ?? "",
    image: (product.facetValues as { image?: string })?.image ?? "",
    name: Object.fromEntries(translations.map((t) => [t.locale, t.name])),
    blurb: Object.fromEntries(translations.map((t) => [t.locale, t.shortDescription ?? ""])),
  };
}

productsRouter.post("/", requireAuth, async (req, res) => {
  const parsed = productCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid product payload", details: parsed.error.flatten() });
    return;
  }

  const { id: slug, categoryId, name, blurb, image } = parsed.data;

  const [existing, category] = await Promise.all([
    Product.findOne({ where: { slug } }),
    Category.findOne({ where: { slug: categoryId } }),
  ]);
  if (existing) {
    res.status(409).json({ error: "Product id already exists" });
    return;
  }
  if (!category) {
    res.status(400).json({ error: "categoryId does not reference an existing category" });
    return;
  }

  const product = await sequelize.transaction(async (t) => {
    const product = await Product.create(
      { slug, categoryId: category.id, facetValues: { image } },
      { transaction: t },
    );
    await ProductTranslation.bulkCreate(
      LANGS.map((lang) => ({
        productId: product.id,
        locale: lang,
        name: name[lang],
        shortDescription: blurb[lang],
      })),
      { transaction: t },
    );
    return product;
  });

  res.status(201).json(await serialize(product, category));
});

productsRouter.patch("/:id", requireAuth, async (req, res) => {
  const parsed = productUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid product patch", details: parsed.error.flatten() });
    return;
  }

  const product = await Product.findOne({ where: { slug: req.params.id } });
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  const { name, blurb, image, categoryId, id: newSlug } = parsed.data;

  let category = await Category.findByPk(product.categoryId);
  if (categoryId) {
    const target = await Category.findOne({ where: { slug: categoryId } });
    if (!target) {
      res.status(400).json({ error: "categoryId does not reference an existing category" });
      return;
    }
    category = target;
  }

  await sequelize.transaction(async (t) => {
    const patch: Partial<{ slug: string; categoryId: number; facetValues: Record<string, unknown> }> = {};
    if (newSlug !== undefined) patch.slug = newSlug;
    if (category) patch.categoryId = category.id;
    if (image !== undefined) patch.facetValues = { ...(product.facetValues as object), image };
    if (Object.keys(patch).length > 0) {
      await product.update(patch, { transaction: t });
    }

    if (name || blurb) {
      for (const lang of LANGS) {
        const nameValue = name?.[lang];
        const blurbValue = blurb?.[lang];
        if (nameValue === undefined && blurbValue === undefined) continue;

        const existingRow = await ProductTranslation.findOne({
          where: { productId: product.id, locale: lang },
          transaction: t,
        });
        await ProductTranslation.upsert(
          {
            productId: product.id,
            locale: lang,
            name: nameValue ?? existingRow?.name ?? "",
            shortDescription: blurbValue ?? existingRow?.shortDescription ?? "",
          },
          { transaction: t },
        );
      }
    }
  });

  res.json(await serialize(product, category));
});

productsRouter.delete("/:id", requireAuth, async (req, res) => {
  const product = await Product.findOne({ where: { slug: req.params.id } });
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  await product.destroy();
  res.status(204).send();
});
