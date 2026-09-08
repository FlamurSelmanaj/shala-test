import { Component, computed, inject } from '@angular/core';

import { Magazine } from '../../components/magazine/magazine';
import { Welcome } from '../../components/welcome/welcome';
import { ContentService } from '../../content/content.service';
import { TranslationService } from '../../i18n';
import { PageHero } from '../../shared/page-hero/page-hero';

@Component({
  selector: 'app-inspiration-page',
  imports: [PageHero, Welcome, Magazine],
  templateUrl: './inspiration.html',
  styleUrl: './inspiration.scss'
})
export class InspirationPage {
  private readonly content = inject(ContentService);

  protected readonly t = inject(TranslationService).t;
  protected readonly page = computed(() => this.content.page('inspiration'));
}
