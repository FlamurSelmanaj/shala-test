import { Injectable, effect, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { type RouterStateSnapshot, TitleStrategy } from '@angular/router';

import { TranslationService } from './translation.service';

/**
 * Treats each route's `title` as a translation key and keeps `document.title` in
 * sync with the active language (re-applies it when the language changes).
 */
@Injectable({ providedIn: 'root' })
export class TranslatedTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly i18n = inject(TranslationService);
  private currentKey: string | undefined;

  constructor() {
    super();
    // Re-apply the title whenever the language changes (localdb.json is already
    // loaded by the app initializer before the first navigation runs).
    effect(() => {
      this.i18n.lang();
      if (this.currentKey) {
        this.title.setTitle(this.i18n.t(this.currentKey));
      }
    });
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    this.currentKey = this.buildTitle(snapshot);
    if (this.currentKey) {
      this.title.setTitle(this.i18n.t(this.currentKey));
    }
  }
}
