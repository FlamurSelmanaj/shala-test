import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { ContentService } from '../../content/content.service';

/**
 * Layout for the admin area: a header (title, API status, section nav, link back
 * to the site) plus a `<router-outlet>` for the child screens.
 */
@Component({
  selector: 'app-admin-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-shell.html',
  styleUrl: './admin-shell.scss'
})
export class AdminShell {
  protected readonly apiOnline = inject(ContentService).apiOnline;
}
