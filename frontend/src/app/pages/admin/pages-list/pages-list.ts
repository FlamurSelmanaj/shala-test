import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ContentService } from '../../../content/content.service';
import { SECTION_LABELS } from '../../../content/localdb.model';
import { TranslationService } from '../../../i18n';

/** Admin: the fixed set of site pages. Rows link into the editor (no create/delete). */
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
  protected readonly sectionLabels = SECTION_LABELS;
}
