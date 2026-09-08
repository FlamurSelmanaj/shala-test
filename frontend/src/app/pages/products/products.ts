import { Component, computed, inject } from '@angular/core';

import { CategoryGrid } from '../../components/category-grid/category-grid';
import { ProductNews } from '../../components/product-news/product-news';
import { ContentService } from '../../content/content.service';
import { TranslationService } from '../../i18n';
import { PageHero } from '../../shared/page-hero/page-hero';

@Component({
  selector: 'app-products-page',
  imports: [PageHero, CategoryGrid, ProductNews],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
export class ProductsPage {
  private readonly content = inject(ContentService);

  protected readonly t = inject(TranslationService).t;
  protected readonly page = computed(() => this.content.page('products'));
}
