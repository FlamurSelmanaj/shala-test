import { type TranslationKey } from '../i18n';

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
