import { DOCUMENT } from '@angular/common';
import { Injectable, effect, inject, signal } from '@angular/core';

import { de, type Dictionary, type TranslationKey } from './dictionaries/de';
import { en } from './dictionaries/en';
import { sq } from './dictionaries/sq';
import { LANGS, type Lang, isLang } from './lang';

const DICTIONARIES: Record<Lang, Dictionary> = { de, en, sq };
const STORAGE_KEY = 'kann-lang';
const DEFAULT_LANG: Lang = 'de';

/**
 * Runtime i18n. Holds the active language in a signal and resolves keys against
 * the matching dictionary, so any template that calls `t(...)` re-renders on
 * language change (zoneless-friendly — no pipe, no zone.js needed).
 */
@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly document = inject(DOCUMENT);

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
   * Resolve a translation key for the active language. Bound as a field so it can
   * be handed straight to a template (`protected readonly t = i18n.t`).
   */
  readonly t = (key: TranslationKey): string =>
    DICTIONARIES[this.lang()][key] ?? de[key] ?? key;

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
