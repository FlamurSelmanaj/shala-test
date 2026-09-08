export const SUPPORTED_LOCALES = ["en", "sq"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export function isSupportedLocale(value: unknown): value is Locale {
  return typeof value === "string" && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export const LINK_TYPES = ["CATEGORY", "PAGE", "EXTERNAL"] as const;
export type LinkType = (typeof LINK_TYPES)[number];

export const ATTRIBUTE_TYPES = ["SELECT", "MULTI_SELECT", "BOOLEAN", "NUMBER"] as const;
export type AttributeType = (typeof ATTRIBUTE_TYPES)[number];

export const STORAGE_PROVIDERS = ["LOCAL", "S3", "CLOUDINARY"] as const;
export type StorageProvider = (typeof STORAGE_PROVIDERS)[number];

export const ADMIN_ROLES = ["ADMIN"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];
