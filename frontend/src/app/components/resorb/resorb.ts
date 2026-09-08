import { Component, inject } from '@angular/core';

import { ContentService } from '../../content/content.service';
import { TranslationService } from '../../i18n';

@Component({
  selector: 'app-resorb',
  imports: [],
  templateUrl: './resorb.html',
  styleUrl: './resorb.scss'
})
export class Resorb {
  protected readonly t = inject(TranslationService).t;
  protected readonly resorbImage = inject(ContentService).resorbImage;
}
