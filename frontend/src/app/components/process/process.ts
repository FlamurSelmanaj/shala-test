import { Component, inject } from '@angular/core';

import { ContentService } from '../../content/content.service';
import { TranslationService } from '../../i18n';

@Component({
  selector: 'app-process',
  imports: [],
  templateUrl: './process.html',
  styleUrl: './process.scss'
})
export class Process {
  protected readonly t = inject(TranslationService).t;
  protected readonly cards = inject(ContentService).processCards;
}
