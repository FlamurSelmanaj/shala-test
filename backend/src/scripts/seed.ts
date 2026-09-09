import "dotenv/config";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { sequelize } from "../db/sequelize.ts";
import { Category, CategoryTranslation, Product, ProductTranslation, SiteContent, Translation } from "../models/index.ts";
import type { LangText } from "../types/lang.ts";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const localDbPath = path.resolve(dirname, "../../../frontend/public/localdb.json");

interface LocalDb {
  meta: Record<string, unknown>;
  translations: Record<string, Record<string, string>>;
  content: Record<string, unknown>;
  pages: Array<{ id: string; slug: string; titleKey: string; subtitleKey: string; heroImage: string; sections: string[] }>;
  categories: Array<{ id: string; slug: string; name: LangText; icon: string }>;
  products: Array<{ id: string; categoryId: string; name: LangText; blurb: LangText; image: string }>;
}

const LANGS = ["de", "en", "sq"] as const;

async function seed() {
  const raw = readFileSync(localDbPath, "utf-8");
  const db: LocalDb = JSON.parse(raw);

  await sequelize.authenticate();

  await SiteContent.upsert({ id: 1, content: db.content, meta: db.meta, pages: db.pages });

  for (const lang of Object.keys(db.translations)) {
    await Translation.upsert({ lang, data: db.translations[lang] });
  }

  // Real `categories`/`products` tables — this app's own seed is additive: it
  // upserts by slug, so it won't touch any pre-existing rows made by other tooling.
  for (const category of db.categories) {
    const [row] = await Category.findOrCreate({
      where: { slug: category.slug },
      defaults: { slug: category.slug, icon: category.icon },
    });
    await row.update({ icon: category.icon });
    for (const lang of LANGS) {
      await CategoryTranslation.upsert({ categoryId: row.id, locale: lang, name: category.name[lang] });
    }
  }

  const categoryIdBySlug = new Map((await Category.findAll()).map((c) => [c.slug, c.id]));

  for (const product of db.products) {
    const categoryId = categoryIdBySlug.get(product.categoryId);
    if (!categoryId) {
      console.warn(`Skipping product "${product.id}": unknown categoryId "${product.categoryId}"`);
      continue;
    }

    const [row] = await Product.findOrCreate({
      where: { slug: product.id },
      defaults: { slug: product.id, categoryId, facetValues: { image: product.image } },
    });
    await row.update({ categoryId, facetValues: { image: product.image } });
    for (const lang of LANGS) {
      await ProductTranslation.upsert({
        productId: row.id,
        locale: lang,
        name: product.name[lang],
        shortDescription: product.blurb[lang],
      });
    }
  }

  console.log("Seed complete. Admin login is unchanged (already seeded by the real schema's own migrations).");
  await sequelize.close();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
