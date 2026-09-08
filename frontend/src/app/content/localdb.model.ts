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

export interface PageContent {
  titleKey: TranslationKey;
  subtitleKey: TranslationKey;
  heroImage: string;
}

export type PageName =
  | 'inspiration'
  | 'products'
  | 'publicSpace'
  | 'service'
  | 'about'
  | 'careers';

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
  pages: Record<PageName, PageContent>;
}

export interface LocalDb {
  meta: {
    languages: Lang[];
    defaultLanguage: Lang;
  };
  translations: Translations;
  content: LocalDbContent;
}
