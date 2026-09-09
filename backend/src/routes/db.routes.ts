import { Router } from "express";
import { Category, CategoryTranslation, Product, ProductTranslation, SiteContent, Translation } from "../models/index.ts";
import type { Lang, LangText, Translations } from "../types/lang.ts";

export const dbRouter = Router();

function toLangText(rows: Array<{ locale: string; value: string }>): LangText {
  const out: LangText = { de: "", en: "", sq: "" };
  for (const row of rows) {
    if (row.locale === "de" || row.locale === "en" || row.locale === "sq") {
      out[row.locale] = row.value;
    }
  }
  return out;
}

dbRouter.get("/db", async (_req, res) => {
  const [siteContent, translationRows, categories, categoryTranslations, products, productTranslations] =
    await Promise.all([
      SiteContent.findByPk(1),
      Translation.findAll(),
      Category.findAll({ order: [["id", "ASC"]] }),
      CategoryTranslation.findAll(),
      Product.findAll({ order: [["id", "ASC"]] }),
      ProductTranslation.findAll(),
    ]);

  const translations = translationRows.reduce<Translations>(
    (acc, row) => {
      acc[row.lang as Lang] = row.data;
      return acc;
    },
    { de: {}, en: {}, sq: {} },
  );

  res.json({
    meta: siteContent?.meta ?? { languages: ["de", "en", "sq"], defaultLanguage: "de" },
    translations,
    content: siteContent?.content ?? {},
    pages: siteContent?.pages ?? [],
    categories: categories.map((c) => ({
      id: c.slug,
      slug: c.slug,
      icon: c.icon ?? "",
      name: toLangText(
        categoryTranslations
          .filter((t) => t.categoryId === c.id)
          .map((t) => ({ locale: t.locale, value: t.name })),
      ),
    })),
    products: products.map((p) => {
      const category = categories.find((c) => c.id === p.categoryId);
      const rowsForProduct = productTranslations.filter((t) => t.productId === p.id);
      return {
        id: p.slug,
        categoryId: category?.slug ?? "",
        image: (p.facetValues as { image?: string })?.image ?? "",
        name: toLangText(rowsForProduct.map((t) => ({ locale: t.locale, value: t.name }))),
        blurb: toLangText(rowsForProduct.map((t) => ({ locale: t.locale, value: t.shortDescription ?? "" }))),
      };
    }),
  });
});
