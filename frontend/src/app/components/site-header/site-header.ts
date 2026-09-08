import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { ASSET } from '../../shared/asset';

interface NavItem {
  label: string;
  path: string;
}

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss'
})
export class SiteHeader {
  protected readonly logo =
    ASSET + '/typo3conf/ext/kann_baustoffwerke_sitepackage/Resources/Public/Images/logo.svg';

  protected readonly menuOpen = signal(false);

  protected readonly navItems: NavItem[] = [
    { label: 'Inspiration', path: '/inspiration' },
    { label: 'Alle Produkte', path: '/products' },
    { label: 'Öffentlicher Raum', path: '/public-space' },
    { label: 'Service', path: '/service' },
    { label: 'KANN', path: '/about' },
    { label: 'Karriere', path: '/careers' }
  ];

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}
