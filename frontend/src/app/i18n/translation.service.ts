import { DOCUMENT } from '@angular/common';
import { Injectable, effect, inject, signal } from '@angular/core';

import { ContentService } from '../content/content.service';
import { LANGS, type Lang, type LangText, type TranslationKey, isLang } from './lang';

const STORAGE_KEY = 'shalaj-lang';
const DEFAULT_LANG: Lang = 'de';

/**
 * Runtime i18n. Holds the active language in a signal and resolves keys against
 * the dictionaries loaded from `localdb.json` (via {@link ContentService}). Any
 * template that calls `t(...)` re-renders on language change or once the DB
 * arrives — no pipe, no zone.js needed.
 */
@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly document = inject(DOCUMENT);
  private readonly content = inject(ContentService);

  /** Active language. */
  readonly lang = signal<Lang>(this.readStoredLang());

  /** Languages available in the switcher. */
  readonly languages = LANGS;

  constructor() {
    effect(() => {
      const lang = this.lang();
      this.document.documentElement.lang = lang;
      try {
        this.document.defaultView?.localStorage.setItem(STORAGE_KEY, lang);
      } catch {
        // storage unavailable (private mode / disabled) — the choice just won't persist
      }
    });
  }

  /** Switch the UI language. */
  setLang(lang: Lang): void {
    this.lang.set(lang);
  }

  /**
   * Resolve a translation key for the active language, falling back to German and
   * then to the raw key. Bound as a field so it can be handed straight to a
   * template (`protected readonly t = inject(TranslationService).t`).
   */
  readonly t = (key: TranslationKey): string => {
    const dictionaries = this.content.translations();
    return dictionaries[this.lang()]?.[key] ?? dictionaries[DEFAULT_LANG]?.[key] ?? key;
  };

  /**
   * Resolve an inline multilingual string (used for records whose text lives on
   * the record itself — categories, products — rather than in the dictionaries).
   */
  readonly text = (value: Partial<LangText> | undefined): string =>
    value?.[this.lang()] ?? value?.[DEFAULT_LANG] ?? '';

  private readStoredLang(): Lang {
    try {
      const stored = this.document.defaultView?.localStorage.getItem(STORAGE_KEY);
      if (isLang(stored)) {
        return stored;
      }
    } catch {
      // ignore and fall through to the default
    }
    return DEFAULT_LANG;
  }
}
