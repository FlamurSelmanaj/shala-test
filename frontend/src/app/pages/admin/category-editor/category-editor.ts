import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { ContentService } from '../../../content/content.service';
import { type Category } from '../../../content/localdb.model';
import { type LangText, TranslationService, blankLangText } from '../../../i18n';
import { slugify } from '../admin-util';

interface Draft {
  name: LangText;
  icon: string;
}

/** Admin: create (`/admin/categories/new`) or edit (`/admin/categories/:id`) a category. */
@Component({
  selector: 'app-admin-category-editor',
  imports: [FormsModule, RouterLink],
  templateUrl: './category-editor.html',
  styleUrl: './category-editor.scss'
})
export class AdminCategoryEditor {
  private readonly content = inject(ContentService);
  private readonly router = inject(Router);

  readonly id = input<string>();

  protected readonly apiOnline = this.content.apiOnline;
  protected readonly languages = this.content.languages;

  protected readonly mode = computed<'create' | 'edit'>(() => (this.id() ? 'edit' : 'create'));
  protected readonly record = computed(() => {
    const id = this.id();
    return id ? this.content.category(id) : undefined;
  });
  protected readonly notFound = computed(
    () => this.mode() === 'edit' && this.content.categories().length > 0 && !this.record()
  );
  protected readonly productCount = computed(() =>
    this.id() ? this.content.productsByCategory(this.id()!).length : 0
  );

  protected readonly busy = signal(false);
  protected readonly message = signal<{ kind: 'ok' | 'err'; text: string } | null>(null);

  protected draft: Draft = { name: blankLangText(), icon: '' };
  private seededKey: string | null = null;

  constructor() {
    effect(() => {
      if (this.mode() === 'create') {
        if (this.seededKey !== 'new') {
          this.draft = { name: blankLangText(), icon: '' };
          this.message.set(null);
          this.seededKey = 'new';
        }
        return;
      }
      const record = this.record();
      if (record && this.seededKey !== record.id) {
        this.draft = { name: { ...record.name }, icon: record.icon };
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
    if (creating && this.content.categories().some((c) => c.id === slug)) {
      this.message.set({ kind: 'err', text: `A category "${slug}" already exists.` });
      return;
    }

    this.busy.set(true);
    this.message.set(null);
    try {
      if (creating) {
        const record: Category = {
          id: slug,
          slug,
          name: { ...this.draft.name },
          icon: this.draft.icon.trim()
        };
        await this.content.createCategory(record);
        this.router.navigate(['/admin/categories', slug]);
        return;
      }
      await this.content.updateCategory(slug, {
        name: { ...this.draft.name },
        icon: this.draft.icon.trim()
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
    const count = this.productCount();
    const warn = count
      ? `Delete category "${id}" and its ${count} product(s)?`
      : `Delete category "${id}"?`;
    if (!confirm(warn)) {
      return;
    }
    this.busy.set(true);
    this.message.set(null);
    try {
      await this.content.deleteCategory(id);
      this.router.navigate(['/admin/categories']);
    } catch (error) {
      this.message.set({ kind: 'err', text: String(error) });
      this.busy.set(false);
    }
  }

  protected cancel(): void {
    this.router.navigate(['/admin/categories']);
  }
}
