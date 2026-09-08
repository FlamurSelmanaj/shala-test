import { Component, inject } from '@angular/core';

import { TranslationService } from '../../i18n';
import { ASSET } from '../../shared/asset';

@Component({
  selector: 'app-career-cta',
  imports: [],
  templateUrl: './career-cta.html',
  styleUrl: './career-cta.scss'
})
export class CareerCta {
  protected readonly t = inject(TranslationService).t;

  protected readonly careerImage =
    ASSET +
    '/fileadmin/_processed_/c/8/csm_02_KREATION_ARBEITGEBERMARKE_BANNER_START_1900x990px_220204_d482f6d740.jpg';

  protected readonly background =
    `linear-gradient(rgba(0,28,70,0.72), rgba(0,28,70,0.72)), url(${this.careerImage})`;
}
