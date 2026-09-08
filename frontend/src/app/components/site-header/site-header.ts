import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { LANG_LABELS, type Lang, type TranslationKey, TranslationService } from '../../i18n';
import { ASSET } from '../../shared/asset';

interface NavItem {
  labelKey: TranslationKey;
  path: string;
}

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss'
})
export class SiteHeader {
  private readonly i18n = inject(TranslationService);

  protected readonly t = this.i18n.t;
  protected readonly currentLang = this.i18n.lang;
  protected readonly languages = this.i18n.languages;
  protected readonly langLabels = LANG_LABELS;

  protected readonly logo =
    ASSET + '/typo3conf/ext/kann_baustoffwerke_sitepackage/Resources/Public/Images/logo.svg';

  protected readonly menuOpen = signal(false);

  protected readonly navItems: NavItem[] = [
    { labelKey: 'nav.inspiration', path: '/inspiration' },
    { labelKey: 'nav.products', path: '/products' },
    { labelKey: 'nav.publicSpace', path: '/public-space' },
    { labelKey: 'nav.service', path: '/service' },
    { labelKey: 'nav.about', path: '/about' },
    { labelKey: 'nav.careers', path: '/careers' }
  ];

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
