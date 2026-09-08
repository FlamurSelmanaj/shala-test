import { Component } from '@angular/core';

import { CareerCta } from '../../components/career-cta/career-cta';
import { CategoryGrid } from '../../components/category-grid/category-grid';
import { Hero } from '../../components/hero/hero';
import { Magazine } from '../../components/magazine/magazine';
import { ProductNews } from '../../components/product-news/product-news';
import { Process } from '../../components/process/process';
import { Resorb } from '../../components/resorb/resorb';
import { Service } from '../../components/service/service';
import { Welcome } from '../../components/welcome/welcome';

@Component({
  selector: 'app-home-page',
  imports: [Hero, CategoryGrid, Welcome, ProductNews, Process, Resorb, Service, Magazine, CareerCta],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomePage {}
