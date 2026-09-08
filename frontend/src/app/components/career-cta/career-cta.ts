import { Component, computed, inject } from '@angular/core';

import { ContentService } from '../../content/content.service';
import { TranslationService } from '../../i18n';

@Component({
  selector: 'app-career-cta',
  imports: [],
  templateUrl: './career-cta.html',
  styleUrl: './career-cta.scss'
})
export class CareerCta {
  protected readonly t = inject(TranslationService).t;

  private readonly careerImage = inject(ContentService).careerImage;

  protected readonly background = computed(
    () => `linear-gradient(rgba(0,28,70,0.72), rgba(0,28,70,0.72)), url(${this.careerImage()})`
  );
}
