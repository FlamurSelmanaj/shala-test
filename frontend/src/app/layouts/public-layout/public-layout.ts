import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SiteFooter } from '../../components/site-footer/site-footer';
import { SiteHeader } from '../../components/site-header/site-header';

/**
 * Chrome for the public site: header + footer around a `<router-outlet>`. The
 * admin area (`/admin`) is a separate top-level route and deliberately does not
 * use this layout — it has its own shell.
 */
@Component({
  selector: 'app-public-layout',
  imports: [SiteHeader, RouterOutlet, SiteFooter],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.scss'
})
export class PublicLayout {}
