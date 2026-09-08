import { Injectable, effect, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { type RouterStateSnapshot, TitleStrategy } from '@angular/router';

import { type TranslationKey } from './dictionaries/de';
import { TranslationService } from './translation.service';

/**
 * Treats each route's `title` as a translation key and keeps `document.title` in
 * sync with the active language (re-applies it when the language changes).
 */
@Injectable({ providedIn: 'root' })
export class TranslatedTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly i18n = inject(TranslationService);
  private currentKey: TranslationKey | undefined;

  constructor() {
    super();
    effect(() => {
      this.i18n.lang();
      if (this.currentKey) {
        this.title.setTitle(this.i18n.t(this.currentKey));
      }
    });
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    this.currentKey = this.buildTitle(snapshot) as TranslationKey | undefined;
    if (this.currentKey) {
      this.title.setTitle(this.i18n.t(this.currentKey));
    }
  }
}
