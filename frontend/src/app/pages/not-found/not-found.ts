import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TranslationService } from '../../i18n';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss'
})
export class NotFoundPage {
  protected readonly t = inject(TranslationService).t;
}
