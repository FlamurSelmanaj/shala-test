import { env } from "../config/env.ts";
import { hashPassword } from "../lib/password.ts";
import { sequelize, Admin, Page, PageTranslation, ContentBlock, ContentBlockTranslation, SiteSettings, SiteSettingsTranslation } from "./models/index.ts";
import { runMigrations } from "./migrator.ts";

async function seedAdmin(): Promise<void> {
  if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
    console.log("ADMIN_EMAIL/ADMIN_PASSWORD not set, skipping admin seed.");
    return;
  }

  const passwordHash = await hashPassword(env.ADMIN_PASSWORD);
  const [admin, created] = await Admin.findOrCreate({
    where: { email: env.ADMIN_EMAIL },
    defaults: { email: env.ADMIN_EMAIL, passwordHash, name: "Administrator" },
  });

  if (!created) {
    admin.passwordHash = passwordHash;
    await admin.save();
  }

  console.log(`Admin account ready: ${admin.email} (${created ? "created" : "password refreshed"})`);
}

async function seedSiteSettings(): Promise<void> {
  const existing = await SiteSettings.findOne();
  if (existing) return;

  const settings = await SiteSettings.create({ socialLinks: {} });
  await SiteSettingsTranslation.bulkCreate([
    { siteSettingsId: settings.id, locale: "en", tagline: "Creative outdoor paving solutions" },
    { siteSettingsId: settings.id, locale: "sq", tagline: "Zgjidhje kreative shtrimi jashtë" },
  ]);
  console.log("Seeded default site settings.");
}

async function seedHomePage(): Promise<void> {
  const existing = await Page.findOne({ where: { slug: "home" } });
  if (existing) return;

  const page = await Page.create({ slug: "home", isActive: true, publishedAt: new Date() });
  await PageTranslation.bulkCreate([
    { pageId: page.id, locale: "en", title: "Home" },
    { pageId: page.id, locale: "sq", title: "Kryefaqja" },
  ]);

  const blockDefs: Array<{ type: string; sortOrder: number; en: Record<string, unknown>; sq: Record<string, unknown> }> = [
    { type: "HERO_SLIDER", sortOrder: 0, en: { slides: [] }, sq: { slides: [] } },
    { type: "CATEGORY_GRID", sortOrder: 1, en: { heading: "Our Categories" }, sq: { heading: "Kategoritë Tona" } },
    { type: "RICH_TEXT", sortOrder: 2, en: { heading: "Welcome", body: "" }, sq: { heading: "Mirë se vini", body: "" } },
    { type: "PRODUCT_NEWS_TEASER", sortOrder: 3, en: { heading: "New Products", productIds: [] }, sq: { heading: "Produkte të Reja", productIds: [] } },
    { type: "PROCESS_STEPS", sortOrder: 4, en: { heading: "Our Process", steps: [] }, sq: { heading: "Procesi Ynë", steps: [] } },
    { type: "CTA_BANNER", sortOrder: 5, en: {}, sq: {} },
    { type: "SERVICE_CARDS", sortOrder: 6, en: { cards: [] }, sq: { cards: [] } },
    { type: "MAGAZINE_TEASER", sortOrder: 7, en: { heading: "Magazine", cards: [] }, sq: { heading: "Revista", cards: [] } },
    { type: "CTA_BANNER", sortOrder: 8, en: {}, sq: {} },
  ];

  for (const def of blockDefs) {
    const block = await ContentBlock.create({ pageId: page.id, type: def.type, sortOrder: def.sortOrder, settings: {} });
    await ContentBlockTranslation.bulkCreate([
      { blockId: block.id, locale: "en", data: def.en },
      { blockId: block.id, locale: "sq", data: def.sq },
    ]);
  }

  console.log("Seeded home page with placeholder content blocks.");
}

async function main(): Promise<void> {
  await sequelize.authenticate();
  await runMigrations();
  await seedAdmin();
  await seedSiteSettings();
  await seedHomePage();
  await sequelize.close();
  console.log("Seeding complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
