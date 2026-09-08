import { Component, inject } from '@angular/core';

import { ContentService } from '../../content/content.service';
import { TranslationService } from '../../i18n';

@Component({
  selector: 'app-site-footer',
  imports: [],
  templateUrl: './site-footer.html',
  styleUrl: './site-footer.scss'
})
export class SiteFooter {
  private readonly content = inject(ContentService);

  protected readonly t = inject(TranslationService).t;
  protected readonly footerColumns = this.content.footerColumns;
  protected readonly complianceLinks = this.content.footerComplianceKeys;
  protected readonly socialLinks = this.content.footerSocial;
}
