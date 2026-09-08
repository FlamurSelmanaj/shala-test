import { Component } from '@angular/core';

import { CategoryGrid } from '../../components/category-grid/category-grid';
import { ProductNews } from '../../components/product-news/product-news';
import { ASSET } from '../../shared/asset';
import { PageHero } from '../../shared/page-hero/page-hero';

@Component({
  selector: 'app-products-page',
  imports: [PageHero, CategoryGrid, ProductNews],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
export class ProductsPage {
  protected readonly heroImage =
    ASSET + '/fileadmin/_processed_/b/0/csm_Vios-Platten__greige__100x100__18__RET_9415a69c34.jpg';
}
