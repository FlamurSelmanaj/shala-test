import { Component } from '@angular/core';

import { ASSET } from '../../shared/asset';
import { MagazineArticle } from '../../shared/content.model';

@Component({
  selector: 'app-magazine',
  imports: [],
  templateUrl: './magazine.html',
  styleUrl: './magazine.scss'
})
export class Magazine {
  protected readonly magazineArticles: MagazineArticle[] = [
    {
      category: 'Ratgeber Lebensräume',
      title: 'Welchen Beitrag Gärten zur Artenvielfalt leisten können',
      image: ASSET + '/fileadmin/_processed_/e/7/csm_gidlark-btJ3Kurvxfc-unsplash_591ee560fd.jpg'
    },
    {
      category: 'Ratgeber Hitzestress',
      title: 'Pflanzen und Beläge richtig schützen',
      image:
        ASSET + '/fileadmin/_processed_/0/9/csm_La_Tierra__wilder_Verband__Sunset__8__0dff78a3ca.jpeg'
    },
    {
      category: 'Ratgeber Tiny Forest',
      title: 'So schaffen Sie Ihren eigenen Mini-Wald',
      image:
        ASSET + '/fileadmin/_processed_/1/6/csm_pexels-james-smith-3851641-5717090_b9e3874228.jpg'
    }
  ];
}
