import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SiteFooter } from './components/site-footer/site-footer';
import { SiteHeader } from './components/site-header/site-header';

@Component({
  selector: 'app-root',
  imports: [SiteHeader, RouterOutlet, SiteFooter],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
