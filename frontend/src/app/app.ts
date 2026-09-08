import { Component } from '@angular/core';

import { CareerCta } from './components/career-cta/career-cta';
import { CategoryGrid } from './components/category-grid/category-grid';
import { Hero } from './components/hero/hero';
import { Magazine } from './components/magazine/magazine';
import { ProductNews } from './components/product-news/product-news';
import { Process } from './components/process/process';
import { Resorb } from './components/resorb/resorb';
import { Service } from './components/service/service';
import { SiteFooter } from './components/site-footer/site-footer';
import { SiteHeader } from './components/site-header/site-header';
import { Welcome } from './components/welcome/welcome';

@Component({
  selector: 'app-root',
  imports: [
    SiteHeader,
    Hero,
    CategoryGrid,
    Welcome,
    ProductNews,
    Process,
    Resorb,
    Service,
    Magazine,
    CareerCta,
    SiteFooter
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
