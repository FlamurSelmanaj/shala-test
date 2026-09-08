import { DEFAULT_LOCALE, isSupportedLocale, type Locale } from "../config/constants.ts";
import { BadRequestError } from "./errors.ts";
import { asString } from "./http.ts";

/** Validates a route param (e.g. `:locale`) against SUPPORTED_LOCALES, throwing a 400 otherwise. */
export function assertLocale(value: string | string[] | undefined): Locale {
  const str = asString(value);
  if (!isSupportedLocale(str)) {
    throw new BadRequestError(`Unsupported locale: ${str}`);
  }
  return str;
}

export interface HasLocale {
  locale: string;
}

/**
 * Picks the translation matching `locale`, falling back to DEFAULT_LOCALE when missing.
 * Public read endpoints use this; admin endpoints should NOT fall back silently (see plan §3.1).
 */
export function resolveTranslation<T extends HasLocale>(
  translations: T[],
  locale: Locale,
): T | undefined {
  return (
    translations.find((t) => t.locale === locale) ??
    translations.find((t) => t.locale === DEFAULT_LOCALE)
  );
}

export function indexByLocale<T extends HasLocale>(translations: T[]): Record<string, T> {
  const result: Record<string, T> = {};
  for (const translation of translations) {
    result[translation.locale] = translation;
  }
  return result;
}
