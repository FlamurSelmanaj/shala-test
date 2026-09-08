import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { ContentService } from '../../../content/content.service';
import {
  type PageRecord,
  SECTION_KEYS,
  SECTION_LABELS,
  type SectionKey
} from '../../../content/localdb.model';
import { PAGE_TEMPLATES } from '../../../content/page-templates';
import { type Lang, TranslationService } from '../../../i18n';
import { type Draft, blankDraft, slugify } from '../page-draft';

/** Admin: create (`/admin/pages/new`) or edit (`/admin/pages/:id`) one page. */
@Component({
  selector: 'app-admin-page-editor',
  imports: [FormsModule, RouterLink],
  templateUrl: './page-editor.html',
  styleUrl: './page-editor.scss'
})
export class AdminPageEditor {
  private readonly content = inject(ContentService);
  private readonly router = inject(Router);

  /** Bound from the `:id` route param; absent on the `/new` route. */
  readonly id = input<string>();

  protected readonly t = inject(TranslationService).t;
  protected readonly apiOnline = this.content.apiOnline;
  protected readonly languages = this.content.languages;

  protected readonly sectionCatalog = SECTION_KEYS;
  protected readonly sectionLabels = SECTION_LABELS;
  protected readonly templates = PAGE_TEMPLATES;

  protected readonly mode = computed<'create' | 'edit'>(() => (this.id() ? 'edit' : 'create'));
  protected readonly record = computed(() => {
    const id = this.id();
    return id ? this.content.page(id) : undefined;
  });
  protected readonly notFound = computed(
    () => this.mode() === 'edit' && this.content.pages().length > 0 && !this.record()
  );

  protected readonly busy = signal(false);
  protected readonly message = signal<{ kind: 'ok' | 'err'; text: string } | null>(null);

  protected draft: Draft = blankDraft();
  protected templateId = 'editorial';

  /** `'new'` once the create form is seeded, otherwise the page id last seeded. */
  private seededKey: string | null = null;

  constructor() {
    effect(() => {
      if (this.mode() === 'create') {
        if (this.seededKey !== 'new') {
          this.resetForCreate();
          this.seededKey = 'new';
        }
        return;
      }
      const record = this.record();
      if (record && this.seededKey !== record.id) {
        this.seedFromRecord(record);
        this.seededKey = record.id;
      }
    });
  }

  protected previewSlug(): string {
    return slugify(this.draft.slug);
  }

  protected applyTemplate(): void {
    const template = this.templates.find((entry) => entry.id === this.templateId);
    if (template) {
      this.draft.sections = [...template.sections];
    }
  }

  protected hasSection(section: SectionKey): boolean {
    return this.draft.sections.includes(section);
  }

  protected toggleSection(section: SectionKey): void {
    const index = this.draft.sections.indexOf(section);
    if (index === -1) {
      this.draft.sections.push(section);
    } else {
      this.draft.sections.splice(index, 1);
    }
  }

  protected moveSection(index: number, direction: -1 | 1): void {
    const target = index + direction;
    const sections = this.draft.sections;
    if (target < 0 || target >= sections.length) {
      return;
    }
    [sections[index], sections[target]] = [sections[target], sections[index]];
  }

  protected async save(): Promise<void> {
    if (!this.apiOnline() || this.busy()) {
      return;
    }
    const creating = this.mode() === 'create';
    const slug = creating ? this.previewSlug() : this.draft.slug;
    if (!slug) {
      this.message.set({ kind: 'err', text: 'A slug is required.' });
      return;
    }
    if (creating && this.content.pages().some((page) => page.id === slug)) {
      this.message.set({ kind: 'err', text: `A page with slug "${slug}" already exists.` });
      return;
    }

    const titleKey = `pages.${slug}.title`;
    const subtitleKey = `pages.${slug}.subtitle`;
    const record: PageRecord = {
      id: slug,
      slug,
      titleKey,
      subtitleKey,
      heroImage: this.draft.heroImage.trim(),
      sections: [...this.draft.sections]
    };

    this.busy.set(true);
    this.message.set(null);
    try {
      await this.content.updateTranslations(this.translationChanges(titleKey, subtitleKey));
      if (creating) {
        await this.content.createPage(record);
        this.router.navigate(['/admin/pages', slug]);
        return;
      }
      await this.content.updatePage(record.id, {
        heroImage: record.heroImage,
        sections: record.sections,
        titleKey,
        subtitleKey
      });
      this.seededKey = null;
      this.message.set({ kind: 'ok', text: `Saved page "${slug}".` });
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
    if (!confirm(`Delete page "${id}"? The route goes away; translation strings stay.`)) {
      return;
    }
    this.busy.set(true);
    this.message.set(null);
    try {
      await this.content.deletePage(id);
      this.router.navigate(['/admin/pages']);
    } catch (error) {
      this.message.set({ kind: 'err', text: String(error) });
      this.busy.set(false);
    }
  }

  protected cancel(): void {
    this.router.navigate(['/admin/pages']);
  }

  private resetForCreate(): void {
    this.draft = blankDraft();
    this.templateId = 'editorial';
    this.applyTemplate();
    this.message.set(null);
  }

  private seedFromRecord(record: PageRecord): void {
    const translations = this.content.translations();
    this.draft = {
      slug: record.slug,
      heroImage: record.heroImage,
      sections: [...record.sections],
      text: {
        de: {
          title: translations.de[record.titleKey] ?? '',
          subtitle: translations.de[record.subtitleKey] ?? ''
        },
        en: {
          title: translations.en[record.titleKey] ?? '',
          subtitle: translations.en[record.subtitleKey] ?? ''
        },
        sq: {
          title: translations.sq[record.titleKey] ?? '',
          subtitle: translations.sq[record.subtitleKey] ?? ''
        }
      }
    };
    this.message.set(null);
  }

  private translationChanges(
    titleKey: string,
    subtitleKey: string
  ): Partial<Record<Lang, Record<string, string>>> {
    const changes: Partial<Record<Lang, Record<string, string>>> = {};
    for (const lang of this.languages()) {
      changes[lang] = {
        [titleKey]: this.draft.text[lang].title,
        [subtitleKey]: this.draft.text[lang].subtitle
      };
    }
    return changes;
  }
}
