import { Component, computed, inject } from '@angular/core';

import { ContentService } from '../../content/content.service';
import { type Category, type Product } from '../../content/localdb.model';
import { TranslationService } from '../../i18n';

interface CategoryGroup {
  category: Category;
  products: Product[];
}

/** Full product catalogue: every category with a non-empty product list. */
@Component({
  selector: 'app-product-catalog',
  imports: [],
  templateUrl: './product-catalog.html',
  styleUrl: './product-catalog.scss'
})
export class ProductCatalog {
  private readonly content = inject(ContentService);

  protected readonly t = inject(TranslationService).t;
  protected readonly text = inject(TranslationService).text;

  protected readonly groups = computed<CategoryGroup[]>(() => {
    const products = this.content.products();
    return this.content
      .categories()
      .map((category) => ({
        category,
        products: products.filter((product) => product.categoryId === category.id)
      }))
      .filter((group) => group.products.length > 0);
  });
}
