import { Component, computed, inject } from '@angular/core';

import { Resorb } from '../../components/resorb/resorb';
import { Service } from '../../components/service/service';
import { ContentService } from '../../content/content.service';
import { TranslationService } from '../../i18n';
import { PageHero } from '../../shared/page-hero/page-hero';

@Component({
  selector: 'app-public-space-page',
  imports: [PageHero, Resorb, Service],
  templateUrl: './public-space.html',
  styleUrl: './public-space.scss'
})
export class PublicSpacePage {
  private readonly content = inject(ContentService);

  protected readonly t = inject(TranslationService).t;
  protected readonly page = computed(() => this.content.page('publicSpace'));
}
