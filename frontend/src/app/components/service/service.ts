import { Component, inject } from '@angular/core';

import { ContentService } from '../../content/content.service';
import { TranslationService } from '../../i18n';

@Component({
  selector: 'app-service',
  imports: [],
  templateUrl: './service.html',
  styleUrl: './service.scss'
})
export class Service {
  protected readonly t = inject(TranslationService).t;
  protected readonly serviceCards = inject(ContentService).serviceCards;
}
