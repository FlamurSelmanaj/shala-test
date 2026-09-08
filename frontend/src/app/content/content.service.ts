import { Injectable, computed, signal } from '@angular/core';

import { type Lang } from '../i18n/lang';
import {
  type LocalDb,
  type LocalDbContent,
  type PageContent,
  type PageName,
  type Translations
} from './localdb.model';

/** json-server endpoint — run `npm run api` (serves public/localdb.json on :3001). */
const LOCALDB_API_URL = 'http://localhost:3001/db';
/** Bundled copy, used when json-server isn't running so the built site still works. */
const LOCALDB_FALLBACK_URL = 'localdb.json';

const EMPTY_PAGE: PageContent = { titleKey: '', subtitleKey: '', heroImage: '' };

const EMPTY_CONTENT: LocalDbContent = {
  logo: '',
  nav: [],
  hero: [],
  categories: [],
  processCards: [],
  serviceCards: [],
  magazineArticles: [],
  footerColumns: [],
  footerComplianceKeys: [],
  footerSocial: [],
  images: { productNews: '', resorb: '', career: '' },
  pages: {
    inspiration: EMPTY_PAGE,
    products: EMPTY_PAGE,
    publicSpace: EMPTY_PAGE,
    service: EMPTY_PAGE,
    about: EMPTY_PAGE,
    careers: EMPTY_PAGE
  }
};

const EMPTY_TRANSLATIONS: Translations = { de: {}, en: {}, sq: {} };

const EMPTY_DB: LocalDb = {
  meta: { languages: ['de', 'en', 'sq'], defaultLanguage: 'de' },
  translations: EMPTY_TRANSLATIONS,
  content: EMPTY_CONTENT
};

/**
 * Loads `localdb.json` once at app startup (see `provideAppInitializer` in
 * `app.config.ts`) and exposes its content as signals. Everything the site
 * renders — text, images, nav, footer — comes from here, so editing the JSON is
 * all it takes to change the site.
 */
@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly db = signal<LocalDb>(EMPTY_DB);

  async load(): Promise<void> {
    const db =
      (await this.fetchDb(LOCALDB_API_URL)) ?? (await this.fetchDb(LOCALDB_FALLBACK_URL));
    if (db) {
      this.db.set(db);
    } else {
      console.error('[ContentService] no data source reachable — rendering empty content');
      // keep EMPTY_DB — the app still renders (blank strings) instead of crashing
    }
  }

  private async fetchDb(url: string): Promise<LocalDb | null> {
    try {
      const response = await fetch(url, { cache: 'no-cache' });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return (await response.json()) as LocalDb;
    } catch (error) {
      console.warn(`[ContentService] ${url} unavailable:`, error);
      return null;
    }
  }

  readonly meta = computed(() => this.db().meta);
  readonly languages = computed<Lang[]>(() => this.db().meta.languages);
  readonly translations = computed<Translations>(() => this.db().translations);

  private readonly content = computed<LocalDbContent>(() => this.db().content);

  readonly logo = computed(() => this.content().logo);
  readonly nav = computed(() => this.content().nav);
  readonly hero = computed(() => this.content().hero);
  readonly categories = computed(() => this.content().categories);
  readonly processCards = computed(() => this.content().processCards);
  readonly serviceCards = computed(() => this.content().serviceCards);
  readonly magazineArticles = computed(() => this.content().magazineArticles);
  readonly footerColumns = computed(() => this.content().footerColumns);
  readonly footerComplianceKeys = computed(() => this.content().footerComplianceKeys);
  readonly footerSocial = computed(() => this.content().footerSocial);
  readonly productNewsImage = computed(() => this.content().images.productNews);
  readonly resorbImage = computed(() => this.content().images.resorb);
  readonly careerImage = computed(() => this.content().images.career);
  readonly pages = computed(() => this.content().pages);

  page(name: PageName): PageContent {
    return this.content().pages[name] ?? EMPTY_PAGE;
  }
}
