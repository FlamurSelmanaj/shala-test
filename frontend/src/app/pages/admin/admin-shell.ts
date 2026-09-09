import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '../../auth/auth.service';
import { ContentService } from '../../content/content.service';

/**
 * Layout for the admin area: a status bar, a top nav (Pages / Categories /
 * Products) and a `<router-outlet>`. Also declares the `--admin-*` design tokens
 * that the child screens inherit through the cascade.
 */
@Component({
  selector: 'app-admin-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-shell.html',
  styleUrl: './admin-shell.scss'
})
export class AdminShell {
  private readonly content = inject(ContentService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly apiOnline = this.content.apiOnline;

  protected readonly nav = [
    { path: 'pages', label: 'Pages' },
    { path: 'categories', label: 'Categories' },
    { path: 'products', label: 'Products' }
  ];

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/admin/login']);
  }
}
