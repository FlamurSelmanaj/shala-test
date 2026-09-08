import { Component, computed, inject } from '@angular/core';

import { CareerCta } from '../../components/career-cta/career-cta';
import { Welcome } from '../../components/welcome/welcome';
import { ContentService } from '../../content/content.service';
import { TranslationService } from '../../i18n';
import { PageHero } from '../../shared/page-hero/page-hero';

@Component({
  selector: 'app-about-page',
  imports: [PageHero, Welcome, CareerCta],
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class AboutPage {
  private readonly content = inject(ContentService);

  protected readonly t = inject(TranslationService).t;
  protected readonly page = computed(() => this.content.page('about'));
}
