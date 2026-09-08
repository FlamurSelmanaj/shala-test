import { Injectable, computed, signal } from '@angular/core';

import { type Lang } from '../i18n/lang';
import {
  type LocalDb,
  type LocalDbContent,
  type PageRecord,
  type Translations
} from './localdb.model';

/** json-server base — run `npm run api` (serves public/localdb.json on :3001). */
const API_BASE = 'http://localhost:3001';
/** Bundled copy, used when json-server isn't running so the built site still works. */
const LOCALDB_FALLBACK_URL = 'localdb.json';

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
  images: { productNews: '', resorb: '', career: '' }
};

const EMPTY_TRANSLATIONS: Translations = { de: {}, en: {}, sq: {} };

const EMPTY_DB: LocalDb = {
  meta: { languages: ['de', 'en', 'sq'], defaultLanguage: 'de' },
  translations: EMPTY_TRANSLATIONS,
  content: EMPTY_CONTENT,
  pages: []
};

/**
 * Loads the content DB once at app startup (see `provideAppInitializer` in
 * `app.config.ts`) and exposes it as signals. Everything the site renders — text,
 * images, nav, footer, pages — comes from here.
 *
 * The `pages` collection is CRUD-backed by json-server; `createPage` / `updatePage`
 * / `deletePage` / `updateTranslations` mutate `:3001` and then re-pull the whole
 * DB so the live site reflects the change immediately.
 */
@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly db = signal<LocalDb>(EMPTY_DB);

  /** True once json-server answered — the admin dashboard needs it for writes. */
  readonly apiOnline = signal(false);

  async load(): Promise<void> {
    const fromApi = await this.fetchDb(`${API_BASE}/db`);
    if (fromApi) {
      this.apiOnline.set(true);
      this.db.set(fromApi);
      return;
    }
    const fromFile = await this.fetchDb(LOCALDB_FALLBACK_URL);
    if (fromFile) {
      this.db.set(fromFile);
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

  // ── Read signals ──────────────────────────────────────────────────────────

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
  readonly pages = computed(() => this.db().pages);

  page(slug: string): PageRecord | undefined {
    return this.db().pages.find((entry) => entry.slug === slug);
  }

  // ── Pages CRUD (json-server) ──────────────────────────────────────────────

  async createPage(record: PageRecord): Promise<void> {
    await this.mutate('POST', '/pages', record);
    await this.refresh();
  }

  async updatePage(id: string, patch: Partial<PageRecord>): Promise<void> {
    await this.mutate('PATCH', `/pages/${encodeURIComponent(id)}`, patch);
    await this.refresh();
  }

  async deletePage(id: string): Promise<void> {
    await this.mutate('DELETE', `/pages/${encodeURIComponent(id)}`);
    await this.refresh();
  }

  /**
   * Merge translation entries per language and persist. Pass only the changed
   * keys — json-server PATCH shallow-merges the top level, so this method rebuilds
   * the full `de`/`en`/`sq` maps first to avoid clobbering the rest.
   */
  async updateTranslations(changes: Partial<Record<Lang, Record<string, string>>>): Promise<void> {
    const current = this.db().translations;
    const merged: Translations = {
      de: { ...current.de, ...changes.de },
      en: { ...current.en, ...changes.en },
      sq: { ...current.sq, ...changes.sq }
    };
    await this.mutate('PATCH', '/translations', merged);
    await this.refresh();
  }

  private async mutate(method: 'POST' | 'PATCH' | 'DELETE', path: string, body?: unknown): Promise<void> {
    const response = await fetch(`${API_BASE}${path}`, {
      method,
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body)
    });
    if (!response.ok) {
      throw new Error(`${method} ${path} → HTTP ${response.status}`);
    }
  }

  private async refresh(): Promise<void> {
    const db = await this.fetchDb(`${API_BASE}/db`);
    if (db) {
      this.db.set(db);
    }
  }
}
