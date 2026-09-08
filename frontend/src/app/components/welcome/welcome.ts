import { Component, inject } from '@angular/core';

import { TranslationService } from '../../i18n';

@Component({
  selector: 'app-welcome',
  imports: [],
  templateUrl: './welcome.html',
  styleUrl: './welcome.scss'
})
export class Welcome {
  protected readonly t = inject(TranslationService).t;
}
