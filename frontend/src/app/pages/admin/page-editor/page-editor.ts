import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { ContentService } from '../../../content/content.service';
import { SECTION_LABELS, type SectionKey } from '../../../content/localdb.model';
import { sectionTextKeys } from '../../../content/section-text';
import { type Lang, type LangText, TranslationService, blankLangText } from '../../../i18n';

interface HeroText {
  title: string;
  subtitle: string;
}

interface Draft {
  heroImage: string;
  hero: Record<Lang, HeroText>;
  /** translation key -> per-language value */
  sectionText: Record<string, LangText>;
}

interface SectionGroup {
  section: SectionKey;
  label: string;
  keys: string[];
}

const LONG_KEY = /\.(p\d+|text|lead|legal)$/;

/** Admin: edit one page's hero + the static body text of its sections. */
@Component({
  selector: 'app-admin-page-editor',
  imports: [FormsModule, RouterLink],
  templateUrl: './page-editor.html',
  styleUrl: './page-editor.scss'
})
export class AdminPageEditor {
  private readonly content = inject(ContentService);
  private readonly router = inject(Router);

  readonly id = input.required<string>();

  protected readonly t = inject(TranslationService).t;
  protected readonly apiOnline = this.content.apiOnline;
  protected readonly languages = this.content.languages;

  protected readonly activeLang = signal<Lang>('de');
  protected readonly busy = signal(false);
  protected readonly message = signal<{ kind: 'ok' | 'err'; text: string } | null>(null);

  protected readonly record = computed(() => this.content.page(this.id()));
  protected readonly notFound = computed(
    () => this.content.pages().length > 0 && !this.record()
  );

  protected readonly sectionGroups = computed<SectionGroup[]>(() => {
    const record = this.record();
    if (!record) {
      return [];
    }
    const allKeys = Object.keys(this.content.translations().de);
    return record.sections
      .map((section) => ({
        section,
        label: SECTION_LABELS[section],
        keys: sectionTextKeys(section, allKeys)
      }))
      .filter((group) => group.keys.length > 0);
  });

  protected draft: Draft = { heroImage: '', hero: this.blankHero(), sectionText: {} };
  private seededFor: string | null = null;

  constructor() {
    effect(() => {
      const record = this.record();
      const groups = this.sectionGroups();
      if (record && this.seededFor !== record.id) {
        this.seed(record.heroImage, record.titleKey, record.subtitleKey, groups);
        this.seededFor = record.id;
      }
    });
  }

  protected pageTitle(): string {
    return this.draft.hero[this.activeLang()]?.title || this.record()?.slug || 'Page';
  }

  protected isLong(key: string): boolean {
    return LONG_KEY.test(key);
  }

  protected async save(): Promise<void> {
    const record = this.record();
    if (!record || !this.apiOnline() || this.busy()) {
      return;
    }
    this.busy.set(true);
    this.message.set(null);
    try {
      await this.content.updateTranslations(this.translationChanges(record.titleKey, record.subtitleKey));
      await this.content.updatePage(record.id, { heroImage: this.draft.heroImage.trim() });
      this.seededFor = null;
      this.message.set({ kind: 'ok', text: `Saved “${record.slug}”.` });
    } catch (error) {
      this.message.set({ kind: 'err', text: String(error) });
    } finally {
      this.busy.set(false);
    }
  }

  protected cancel(): void {
    this.router.navigate(['/admin/pages']);
  }

  private seed(
    heroImage: string,
    titleKey: string,
    subtitleKey: string,
    groups: SectionGroup[]
  ): void {
    const tr = this.content.translations();
    const hero = this.blankHero();
    const sectionText: Record<string, LangText> = {};
    for (const lang of this.languages()) {
      hero[lang] = {
        title: tr[lang][titleKey] ?? '',
        subtitle: tr[lang][subtitleKey] ?? ''
      };
    }
    for (const group of groups) {
      for (const key of group.keys) {
        sectionText[key] ??= blankLangText();
        for (const lang of this.languages()) {
          sectionText[key][lang] = tr[lang][key] ?? '';
        }
      }
    }
    this.draft = { heroImage, hero, sectionText };
    this.message.set(null);
  }

  private translationChanges(
    titleKey: string,
    subtitleKey: string
  ): Partial<Record<Lang, Record<string, string>>> {
    const changes: Partial<Record<Lang, Record<string, string>>> = {};
    for (const lang of this.languages()) {
      const entries: Record<string, string> = {
        [titleKey]: this.draft.hero[lang].title,
        [subtitleKey]: this.draft.hero[lang].subtitle
      };
      for (const [key, value] of Object.entries(this.draft.sectionText)) {
        entries[key] = value[lang];
      }
      changes[lang] = entries;
    }
    return changes;
  }

  private blankHero(): Record<Lang, HeroText> {
    return {
      de: { title: '', subtitle: '' },
      en: { title: '', subtitle: '' },
      sq: { title: '', subtitle: '' }
    };
  }
}
