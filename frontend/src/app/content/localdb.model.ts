import { type Lang, type TranslationKey } from '../i18n/lang';

/** Per-language map of translation key -> resolved string. */
export type Translations = Record<Lang, Record<string, string>>;

export interface NavItem {
  labelKey: TranslationKey;
  path: string;
}

export interface HeroSlide {
  titleKey: TranslationKey;
  subtitleKey: TranslationKey;
  image: string;
  badge?: string;
}

export interface Category {
  labelKey: TranslationKey;
  icon: string;
}

export interface OverlayCard {
  titleKey: TranslationKey;
  textKey: TranslationKey;
  image: string;
}

export interface ServiceCard {
  titleKey: TranslationKey;
  textKey: TranslationKey;
  linkKey: TranslationKey;
  image: string;
}

export interface MagazineArticle {
  categoryKey: TranslationKey;
  titleKey: TranslationKey;
  image: string;
}

export interface FooterColumn {
  titleKey: TranslationKey;
  linkKeys: TranslationKey[];
}

/** Reusable section components a page can stack below its hero. */
export type SectionKey =
  | 'hero'
  | 'category-grid'
  | 'welcome'
  | 'product-news'
  | 'process'
  | 'resorb'
  | 'service'
  | 'magazine'
  | 'career-cta';

export const SECTION_KEYS: readonly SectionKey[] = [
  'hero',
  'category-grid',
  'welcome',
  'product-news',
  'process',
  'resorb',
  'service',
  'magazine',
  'career-cta'
] as const;

/** Human-readable section names for the admin dashboard (pure data — no components). */
export const SECTION_LABELS: Record<SectionKey, string> = {
  hero: 'Hero slider',
  'category-grid': 'Product category strip',
  welcome: 'Welcome intro',
  'product-news': 'Product news band',
  process: 'Process cards',
  resorb: 'ReSorb feature',
  service: 'Service cards',
  magazine: 'Magazine grid',
  'career-cta': 'Careers CTA'
};

/**
 * A routed content page: a hero (title/subtitle keys + image) plus an ordered
 * list of section components. Served as a json-server collection (`/pages`).
 */
export interface PageRecord {
  id: string;
  slug: string;
  titleKey: TranslationKey;
  subtitleKey: TranslationKey;
  heroImage: string;
  sections: SectionKey[];
}

export interface LocalDbContent {
  logo: string;
  nav: NavItem[];
  hero: HeroSlide[];
  categories: Category[];
  processCards: OverlayCard[];
  serviceCards: ServiceCard[];
  magazineArticles: MagazineArticle[];
  footerColumns: FooterColumn[];
  footerComplianceKeys: TranslationKey[];
  footerSocial: string[];
  images: {
    productNews: string;
    resorb: string;
    career: string;
  };
}

export interface LocalDb {
  meta: {
    languages: Lang[];
    defaultLanguage: Lang;
  };
  translations: Translations;
  content: LocalDbContent;
  pages: PageRecord[];
}
