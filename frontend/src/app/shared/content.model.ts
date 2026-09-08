export interface HeroSlide {
  title: string;
  subtitle: string;
  image: string;
  badge?: string;
}

export interface Category {
  label: string;
  icon: string;
}

export interface OverlayCard {
  title: string;
  text: string;
  image: string;
}

export interface ServiceCard {
  title: string;
  text: string;
  image: string;
  link: string;
}

export interface MagazineArticle {
  category: string;
  title: string;
  image: string;
}

export interface FooterColumn {
  title: string;
  links: string[];
}
