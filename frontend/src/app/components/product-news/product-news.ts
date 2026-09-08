import { Component, inject } from '@angular/core';

import { TranslationService } from '../../i18n';
import { ASSET } from '../../shared/asset';

@Component({
  selector: 'app-product-news',
  imports: [],
  templateUrl: './product-news.html',
  styleUrl: './product-news.scss'
})
export class ProductNews {
  protected readonly t = inject(TranslationService).t;

  protected readonly newsImage =
    ASSET + '/fileadmin/_processed_/a/6/csm_MultiTec-Aqua__40x20__Jura-1_5ffe39333c.jpg';
}
