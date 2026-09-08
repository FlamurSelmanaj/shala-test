import { Component, computed, inject } from '@angular/core';

import { Process } from '../../components/process/process';
import { Service } from '../../components/service/service';
import { ContentService } from '../../content/content.service';
import { TranslationService } from '../../i18n';
import { PageHero } from '../../shared/page-hero/page-hero';

@Component({
  selector: 'app-service-page',
  imports: [PageHero, Service, Process],
  templateUrl: './service.html',
  styleUrl: './service.scss'
})
export class ServicePage {
  private readonly content = inject(ContentService);

  protected readonly t = inject(TranslationService).t;
  protected readonly page = computed(() => this.content.page('service'));
}
