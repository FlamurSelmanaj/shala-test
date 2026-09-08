import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { ContentService } from '../../../content/content.service';
import { type Product } from '../../../content/localdb.model';
import { type LangText, TranslationService, blankLangText } from '../../../i18n';
import { slugify } from '../admin-util';

interface Draft {
  categoryId: string;
  name: LangText;
  blurb: LangText;
  image: string;
}

const blankDraft = (): Draft => ({
  categoryId: '',
  name: blankLangText(),
  blurb: blankLangText(),
  image: ''
});

/** Admin: create (`/admin/products/new`) or edit (`/admin/products/:id`) a product. */
@Component({
  selector: 'app-admin-product-editor',
  imports: [FormsModule, RouterLink],
  templateUrl: './product-editor.html',
  styleUrl: './product-editor.scss'
})
export class AdminProductEditor {
  private readonly content = inject(ContentService);
  private readonly router = inject(Router);

  readonly id = input<string>();

  protected readonly apiOnline = this.content.apiOnline;
  protected readonly languages = this.content.languages;
  protected readonly categories = this.content.categories;
  protected readonly text = inject(TranslationService).text;

  protected readonly mode = computed<'create' | 'edit'>(() => (this.id() ? 'edit' : 'create'));
  protected readonly record = computed(() => {
    const id = this.id();
    return id ? this.content.product(id) : undefined;
  });
  protected readonly notFound = computed(
    () => this.mode() === 'edit' && this.content.products().length > 0 && !this.record()
  );

  protected readonly busy = signal(false);
  protected readonly message = signal<{ kind: 'ok' | 'err'; text: string } | null>(null);

  protected draft: Draft = blankDraft();
  private seededKey: string | null = null;

  constructor() {
    effect(() => {
      if (this.mode() === 'create') {
        if (this.seededKey !== 'new') {
          this.draft = blankDraft();
          this.draft.categoryId = this.categories()[0]?.id ?? '';
          this.message.set(null);
          this.seededKey = 'new';
        }
        return;
      }
      const record = this.record();
      if (record && this.seededKey !== record.id) {
        this.draft = {
          categoryId: record.categoryId,
          name: { ...record.name },
          blurb: { ...record.blurb },
          image: record.image
        };
        this.message.set(null);
        this.seededKey = record.id;
      }
    });
  }

  protected previewSlug(): string {
    return this.mode() === 'edit' ? (this.id() ?? '') : slugify(this.draft.name.de);
  }

  protected async save(): Promise<void> {
    if (!this.apiOnline() || this.busy()) {
      return;
    }
    const creating = this.mode() === 'create';
    const slug = this.previewSlug();
    if (!slug) {
      this.message.set({ kind: 'err', text: 'A German name is required (it forms the slug).' });
      return;
    }
    if (!this.draft.categoryId) {
      this.message.set({ kind: 'err', text: 'Pick a category.' });
      return;
    }
    if (creating && this.content.products().some((p) => p.id === slug)) {
      this.message.set({ kind: 'err', text: `A product "${slug}" already exists.` });
      return;
    }

    this.busy.set(true);
    this.message.set(null);
    try {
      if (creating) {
        const record: Product = {
          id: slug,
          categoryId: this.draft.categoryId,
          name: { ...this.draft.name },
          blurb: { ...this.draft.blurb },
          image: this.draft.image.trim()
        };
        await this.content.createProduct(record);
        this.router.navigate(['/admin/products', slug]);
        return;
      }
      await this.content.updateProduct(slug, {
        categoryId: this.draft.categoryId,
        name: { ...this.draft.name },
        blurb: { ...this.draft.blurb },
        image: this.draft.image.trim()
      });
      this.seededKey = null;
      this.message.set({ kind: 'ok', text: `Saved “${slug}”.` });
    } catch (error) {
      this.message.set({ kind: 'err', text: String(error) });
    } finally {
      this.busy.set(false);
    }
  }

  protected async remove(): Promise<void> {
    const id = this.id();
    if (!id || !this.apiOnline() || this.busy()) {
      return;
    }
    if (!confirm(`Delete product "${id}"?`)) {
      return;
    }
    this.busy.set(true);
    this.message.set(null);
    try {
      await this.content.deleteProduct(id);
      this.router.navigate(['/admin/products']);
    } catch (error) {
      this.message.set({ kind: 'err', text: String(error) });
      this.busy.set(false);
    }
  }

  protected cancel(): void {
    this.router.navigate(['/admin/products']);
  }
}
