import { Component } from '@angular/core';

import { ASSET } from '../../shared/asset';

@Component({
  selector: 'app-product-news',
  imports: [],
  templateUrl: './product-news.html',
  styleUrl: './product-news.scss'
})
export class ProductNews {
  protected readonly newsImage =
    ASSET + '/fileadmin/_processed_/a/6/csm_MultiTec-Aqua__40x20__Jura-1_5ffe39333c.jpg';
}
