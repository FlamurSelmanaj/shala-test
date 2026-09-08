/** Supported UI languages. German is the default; English and Albanian are additions. */
export type Lang = 'de' | 'en' | 'sq';

/**
 * A translation key, e.g. `'nav.inspiration'`. The set of valid keys now lives in
 * `localdb.json` (single source of truth), so this is a plain string alias rather
 * than a compile-time union.
 */
export type TranslationKey = string;

/** Selectable languages, in switcher order. */
export const LANGS: readonly Lang[] = ['de', 'en', 'sq'] as const;

/** Short labels shown on the header language switcher. */
export const LANG_LABELS: Record<Lang, string> = {
  de: 'DE',
  en: 'EN',
  sq: 'SQ'
};

/** Narrowing guard for values coming from storage / user input. */
export const isLang = (value: unknown): value is Lang =>
  typeof value === 'string' && (LANGS as readonly string[]).includes(value);
