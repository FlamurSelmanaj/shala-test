import { type Type } from '@angular/core';

import { CareerCta } from '../components/career-cta/career-cta';
import { CategoryGrid } from '../components/category-grid/category-grid';
import { Hero } from '../components/hero/hero';
import { Magazine } from '../components/magazine/magazine';
import { ProductCatalog } from '../components/product-catalog/product-catalog';
import { ProductNews } from '../components/product-news/product-news';
import { Process } from '../components/process/process';
import { Resorb } from '../components/resorb/resorb';
import { Service } from '../components/service/service';
import { Welcome } from '../components/welcome/welcome';
import { type SectionKey } from './localdb.model';

/** Maps a section key stored on a `PageRecord` to the component that renders it. */
export const SECTION_REGISTRY: Record<SectionKey, Type<unknown>> = {
  hero: Hero,
  'category-grid': CategoryGrid,
  welcome: Welcome,
  'product-news': ProductNews,
  'product-catalog': ProductCatalog,
  process: Process,
  resorb: Resorb,
  service: Service,
  magazine: Magazine,
  'career-cta': CareerCta
};
