import { Component, signal } from '@angular/core';

import { ASSET } from '../../shared/asset';

@Component({
  selector: 'app-site-header',
  imports: [],
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss'
})
export class SiteHeader {
  protected readonly logo =
    ASSET + '/typo3conf/ext/kann_baustoffwerke_sitepackage/Resources/Public/Images/logo.svg';

  protected readonly menuOpen = signal(false);

  protected readonly navItems = [
    'Inspiration',
    'Alle Produkte',
    'Öffentlicher Raum',
    'Service',
    'KANN',
    'Karriere'
  ];

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }
}
