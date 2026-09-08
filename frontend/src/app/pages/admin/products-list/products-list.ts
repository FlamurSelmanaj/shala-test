import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ContentService } from '../../../content/content.service';
import { type Product } from '../../../content/localdb.model';
import { TranslationService } from '../../../i18n';

interface Group {
  categoryId: string;
  categoryName: string;
  products: Product[];
}

/** Admin: all products, grouped by category. */
@Component({
  selector: 'app-admin-products-list',
  imports: [RouterLink],
  templateUrl: './products-list.html',
  styleUrl: './products-list.scss'
})
export class AdminProductsList {
  private readonly content = inject(ContentService);

  protected readonly text = inject(TranslationService).text;
  protected readonly apiOnline = this.content.apiOnline;
  protected readonly total = computed(() => this.content.products().length);

  protected readonly groups = computed<Group[]>(() => {
    const products = this.content.products();
    const groups: Group[] = this.content.categories().map((category) => ({
      categoryId: category.id,
      categoryName: this.text(category.name),
      products: products.filter((p) => p.categoryId === category.id)
    }));
    const orphans = products.filter(
      (p) => !this.content.categories().some((c) => c.id === p.categoryId)
    );
    if (orphans.length) {
      groups.push({ categoryId: '', categoryName: 'Uncategorised', products: orphans });
    }
    return groups.filter((g) => g.products.length > 0);
  });
}
