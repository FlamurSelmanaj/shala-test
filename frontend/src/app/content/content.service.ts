import { Injectable, computed, inject, signal } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { type Lang } from '../i18n/lang';
import { API_BASE } from './api-base';
import {
  type Category,
  type LocalDb,
  type LocalDbContent,
  type PageRecord,
  type Product,
  type Translations
} from './localdb.model';

/** Bundled copy, used when the backend isn't reachable so the built site still works. */
const LOCALDB_FALLBACK_URL = 'localdb.json';

const EMPTY_CONTENT: LocalDbContent = {
  logo: '',
  nav: [],
  hero: [],
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
  pages: [],
  categories: [],
  products: []
};

/**
 * Loads the content DB once at app startup (see `provideAppInitializer` in
 * `app.config.ts`) and exposes it as signals.
 *
 * Scope of what the admin dashboard can change:
 *  - **categories** / **products** — full CRUD, requires an admin session.
 *  - **pages** — edit only (hero fields + section body text); no create/delete.
 * Every mutation re-pulls `/db` so the live site reflects it immediately.
 */
@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly auth = inject(AuthService);
  private readonly db = signal<LocalDb>(EMPTY_DB);

  /** True once the backend answered — the admin dashboard needs it for writes. */
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
  readonly categories = computed(() => this.db().categories);
  readonly products = computed(() => this.db().products);

  page(slug: string): PageRecord | undefined {
    return this.db().pages.find((entry) => entry.slug === slug);
  }

  category(id: string): Category | undefined {
    return this.db().categories.find((entry) => entry.id === id);
  }

  product(id: string): Product | undefined {
    return this.db().products.find((entry) => entry.id === id);
  }

  productsByCategory(categoryId: string): Product[] {
    return this.db().products.filter((entry) => entry.categoryId === categoryId);
  }

  // ── Pages: edit-only ─────────────────────────────────────────────────────

  async updatePage(id: string, patch: Partial<PageRecord>): Promise<void> {
    await this.mutate('PATCH', `/pages/${encodeURIComponent(id)}`, patch);
    await this.refresh();
  }

  /**
   * Merge translation entries per language and persist. Pass only the changed
   * keys — json-server PATCH shallow-merges the top level, so this rebuilds the
   * full `de`/`en`/`sq` maps first to avoid clobbering the rest.
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

  // ── Categories CRUD ─────────────────────────────────────────────────────

  async createCategory(record: Category): Promise<void> {
    await this.mutate('POST', '/categories', record);
    await this.refresh();
  }

  async updateCategory(id: string, patch: Partial<Category>): Promise<void> {
    await this.mutate('PATCH', `/categories/${encodeURIComponent(id)}`, patch);
    await this.refresh();
  }

  /** Deletes the category and cascades to every product that belonged to it. */
  async deleteCategory(id: string): Promise<void> {
    for (const product of this.productsByCategory(id)) {
      await this.mutate('DELETE', `/products/${encodeURIComponent(product.id)}`);
    }
    await this.mutate('DELETE', `/categories/${encodeURIComponent(id)}`);
    await this.refresh();
  }

  // ── Products CRUD ──────────────────────────────────────────────────────

  async createProduct(record: Product): Promise<void> {
    await this.mutate('POST', '/products', record);
    await this.refresh();
  }

  async updateProduct(id: string, patch: Partial<Product>): Promise<void> {
    await this.mutate('PATCH', `/products/${encodeURIComponent(id)}`, patch);
    await this.refresh();
  }

  async deleteProduct(id: string): Promise<void> {
    await this.mutate('DELETE', `/products/${encodeURIComponent(id)}`);
    await this.refresh();
  }

  // ── Internals ─────────────────────────────────────────────────────────

  private async mutate(
    method: 'POST' | 'PATCH' | 'DELETE',
    path: string,
    body?: unknown
  ): Promise<void> {
    const token = this.auth.token();
    const headers: Record<string, string> = {};
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
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
