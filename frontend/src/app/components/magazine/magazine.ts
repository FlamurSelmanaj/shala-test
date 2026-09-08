import { Component, inject } from '@angular/core';

import { ContentService } from '../../content/content.service';
import { TranslationService } from '../../i18n';

@Component({
  selector: 'app-magazine',
  imports: [],
  templateUrl: './magazine.html',
  styleUrl: './magazine.scss'
})
export class Magazine {
  protected readonly t = inject(TranslationService).t;
  protected readonly magazineArticles = inject(ContentService).magazineArticles;
}
