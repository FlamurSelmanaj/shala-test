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
  protected readonly t = inject(TranslationService).t;
  protected readonly categories = inject(ContentService).categories;
}
