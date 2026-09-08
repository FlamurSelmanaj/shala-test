import { Component, inject, input } from '@angular/core';

import { TranslationService } from '../../i18n';

@Component({
  selector: 'app-page-hero',
  imports: [],
  templateUrl: './page-hero.html',
  styleUrl: './page-hero.scss'
})
export class PageHero {
  protected readonly t = inject(TranslationService).t;

  readonly title = input.required<string>();
  readonly subtitle = input('');
  readonly image = input('');
}
