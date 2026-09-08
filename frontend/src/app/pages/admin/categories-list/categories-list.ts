import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ContentService } from '../../../content/content.service';
import { TranslationService } from '../../../i18n';

/** Admin: all product categories, with a per-row product count. */
@Component({
  selector: 'app-admin-categories-list',
  imports: [RouterLink],
  templateUrl: './categories-list.html',
  styleUrl: './categories-list.scss'
})
export class AdminCategoriesList {
  private readonly content = inject(ContentService);

  protected readonly text = inject(TranslationService).text;
  protected readonly apiOnline = this.content.apiOnline;

  protected readonly rows = computed(() =>
    this.content.categories().map((category) => ({
      category,
      count: this.content.productsByCategory(category.id).length
    }))
  );
}
