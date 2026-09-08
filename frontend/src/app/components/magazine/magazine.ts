import { Component, inject } from '@angular/core';

import { TranslationService } from '../../i18n';
import { ASSET } from '../../shared/asset';
import { MagazineArticle } from '../../shared/content.model';

@Component({
  selector: 'app-magazine',
  imports: [],
  templateUrl: './magazine.html',
  styleUrl: './magazine.scss'
})
export class Magazine {
  protected readonly t = inject(TranslationService).t;

  protected readonly magazineArticles: MagazineArticle[] = [
    {
      categoryKey: 'magazine.a1.category',
      titleKey: 'magazine.a1.title',
      image: ASSET + '/fileadmin/_processed_/e/7/csm_gidlark-btJ3Kurvxfc-unsplash_591ee560fd.jpg'
    },
    {
      categoryKey: 'magazine.a2.category',
      titleKey: 'magazine.a2.title',
      image:
        ASSET + '/fileadmin/_processed_/0/9/csm_La_Tierra__wilder_Verband__Sunset__8__0dff78a3ca.jpeg'
    },
    {
      categoryKey: 'magazine.a3.category',
      titleKey: 'magazine.a3.title',
      image:
        ASSET + '/fileadmin/_processed_/1/6/csm_pexels-james-smith-3851641-5717090_b9e3874228.jpg'
    }
  ];
}
