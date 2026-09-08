import { Component, computed, inject } from '@angular/core';

import { CareerCta } from '../../components/career-cta/career-cta';
import { ContentService } from '../../content/content.service';
import { TranslationService } from '../../i18n';
import { PageHero } from '../../shared/page-hero/page-hero';

@Component({
  selector: 'app-careers-page',
  imports: [PageHero, CareerCta],
  templateUrl: './careers.html',
  styleUrl: './careers.scss'
})
export class CareersPage {
  private readonly content = inject(ContentService);

  protected readonly t = inject(TranslationService).t;
  protected readonly page = computed(() => this.content.page('careers'));
}
