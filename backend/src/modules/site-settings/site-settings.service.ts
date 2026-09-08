import { SiteSettings, SiteSettingsTranslation, Media } from "../../db/models/index.ts";
import { resolveTranslation } from "../../lib/translation.ts";
import type { Locale } from "../../config/constants.ts";
import type { SocialLinks } from "../../db/models/site-settings.model.ts";

const INCLUDES = [{ model: SiteSettingsTranslation, as: "translations" }, { model: Media, as: "logo" }];

async function getOrCreateSingleton(): Promise<SiteSettings> {
  const existing = await SiteSettings.findOne({ include: INCLUDES });
  if (existing) return existing;

  await SiteSettings.create({ socialLinks: {} });
  const created = await SiteSettings.findOne({ include: INCLUDES });
  if (!created) throw new Error("Failed to initialize site settings singleton");
  return created;
}

export async function getPublicSiteSettings(locale: Locale) {
  const settings = await getOrCreateSingleton();
  const translation = resolveTranslation((settings.get("translations") as SiteSettingsTranslation[]) ?? [], locale);
  const logo = settings.get("logo") as Media | undefined;

  return {
    phone: settings.phone,
    email: settings.email,
    socialLinks: settings.socialLinks,
    tagline: translation?.tagline ?? null,
    logo: logo ? { id: logo.id, url: logo.url } : null,
  };
}

export async function getSiteSettingsAdmin() {
  return getOrCreateSingleton();
}

export interface SiteSettingsInput {
  logoMediaId?: number | null;
  phone?: string | null;
  email?: string | null;
  socialLinks?: SocialLinks;
}

export async function updateSiteSettings(input: SiteSettingsInput) {
  const settings = await getOrCreateSingleton();
  if (input.logoMediaId !== undefined) settings.logoMediaId = input.logoMediaId;
  if (input.phone !== undefined) settings.phone = input.phone;
  if (input.email !== undefined) settings.email = input.email;
  if (input.socialLinks !== undefined) settings.socialLinks = input.socialLinks;
  await settings.save();
  return getOrCreateSingleton();
}

export async function upsertSiteSettingsTranslation(locale: Locale, data: { tagline?: string }) {
  const settings = await getOrCreateSingleton();
  const [translation] = await SiteSettingsTranslation.findOrCreate({
    where: { siteSettingsId: settings.id, locale },
    defaults: { siteSettingsId: settings.id, locale, tagline: data.tagline ?? null },
  });
  if (data.tagline !== undefined) translation.tagline = data.tagline;
  await translation.save();
  return translation;
}
