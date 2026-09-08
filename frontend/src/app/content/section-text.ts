import { type SectionKey } from './localdb.model';

/**
 * Translation-key prefixes whose entries make up each section's body copy. The
 * page editor lists every key under these prefixes (minus a11y-only keys) so the
 * static content shown on a page can be edited per language.
 */
const SECTION_TEXT_PREFIXES: Partial<Record<SectionKey, string[]>> = {
  hero: ['hero.'],
  welcome: ['welcome.'],
  'product-news': ['news.'],
  process: ['process.'],
  resorb: ['resorb.'],
  service: ['service.'],
  magazine: ['magazine.'],
  'career-cta': ['career.']
  // 'category-grid' / 'product-catalog' render category & product records, which
  // carry their own inline text — nothing to edit here.
};

/** Keys under a section prefix that are aria/screen-reader only — hidden from the editor. */
const A11Y_KEY = /(Aria|aria)$|\.regionAria$|\.chooseSlide$|\.prev$|\.next$/;

/**
 * The editable translation keys for a section, in dictionary order. `allKeys` is
 * the full key list from any one language (they're kept in parity).
 */
export function sectionTextKeys(section: SectionKey, allKeys: string[]): string[] {
  const prefixes = SECTION_TEXT_PREFIXES[section];
  if (!prefixes) {
    return [];
  }
  return allKeys.filter(
    (key) => prefixes.some((prefix) => key.startsWith(prefix)) && !A11Y_KEY.test(key)
  );
}
