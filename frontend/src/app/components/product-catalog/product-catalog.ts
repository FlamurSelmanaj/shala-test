import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

import { ContentService } from '../../content/content.service';
import { type Category, type Product } from '../../content/localdb.model';
import { TranslationService } from '../../i18n';

interface CategoryGroup {
  category: Category;
  products: Product[];
}

/** Full product catalogue: every category with a non-empty product list, or —
 * when the category carousel has selected one via `?category=` — just that one. */
@Component({
  selector: 'app-product-catalog',
  imports: [],
  templateUrl: './product-catalog.html',
  styleUrl: './product-catalog.scss'
})
export class ProductCatalog {
  private readonly content = inject(ContentService);
  private readonly route = inject(ActivatedRoute);

  protected readonly t = inject(TranslationService).t;
  protected readonly text = inject(TranslationService).text;

  protected readonly selectedSlug = toSignal(
    this.route.queryParamMap.pipe(map((params) => params.get('category'))),
    { initialValue: this.route.snapshot.queryParamMap.get('category') }
  );

  protected readonly groups = computed<CategoryGroup[]>(() => {
    const products = this.content.products();
    const selected = this.selectedSlug();

    return this.content
      .categories()
      .filter((category) => !selected || category.id === selected)
      .map((category) => ({
        category,
        products: products.filter((product) => product.categoryId === category.id)
      }))
      .filter((group) => group.products.length > 0);
  });
}
