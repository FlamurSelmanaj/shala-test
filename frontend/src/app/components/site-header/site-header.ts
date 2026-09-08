import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { ContentService } from '../../content/content.service';
import { LANG_LABELS, type Lang, TranslationService } from '../../i18n';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss'
})
export class SiteHeader {
  private readonly i18n = inject(TranslationService);
  private readonly content = inject(ContentService);

  protected readonly t = this.i18n.t;
  protected readonly currentLang = this.i18n.lang;
  protected readonly languages = this.i18n.languages;
  protected readonly langLabels = LANG_LABELS;

  protected readonly logo = this.content.logo;
  protected readonly navItems = this.content.nav;

  protected readonly menuOpen = signal(false);

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  protected selectLang(lang: Lang): void {
    this.i18n.setLang(lang);
  }
}
