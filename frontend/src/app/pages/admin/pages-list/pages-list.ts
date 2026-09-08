import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ContentService } from '../../../content/content.service';
import { TranslationService } from '../../../i18n';

/** Admin: list of pages, links into the editor, and the "new page" entry point. */
@Component({
  selector: 'app-admin-pages-list',
  imports: [RouterLink],
  templateUrl: './pages-list.html',
  styleUrl: './pages-list.scss'
})
export class AdminPagesList {
  private readonly content = inject(ContentService);

  protected readonly t = inject(TranslationService).t;
  protected readonly pages = this.content.pages;
  protected readonly apiOnline = this.content.apiOnline;
}
