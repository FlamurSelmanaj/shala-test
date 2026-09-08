import { Component, inject } from '@angular/core';

import { ContentService } from '../../content/content.service';
import { TranslationService } from '../../i18n';

@Component({
  selector: 'app-product-news',
  imports: [],
  templateUrl: './product-news.html',
  styleUrl: './product-news.scss'
})
export class ProductNews {
  protected readonly t = inject(TranslationService).t;
  protected readonly newsImage = inject(ContentService).productNewsImage;
}
