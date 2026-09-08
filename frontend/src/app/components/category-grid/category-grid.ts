import { Component, inject } from '@angular/core';

import { ContentService } from '../../content/content.service';
import { TranslationService } from '../../i18n';

@Component({
  selector: 'app-category-grid',
  imports: [],
  templateUrl: './category-grid.html',
  styleUrl: './category-grid.scss'
})
export class CategoryGrid {
  private readonly i18n = inject(TranslationService);

  protected readonly t = this.i18n.t;
  protected readonly text = this.i18n.text;
  protected readonly categories = inject(ContentService).categories;
}
