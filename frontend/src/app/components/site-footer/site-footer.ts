import { Component, inject } from '@angular/core';

import { type TranslationKey, TranslationService } from '../../i18n';
import { FooterColumn } from '../../shared/content.model';

@Component({
  selector: 'app-site-footer',
  imports: [],
  templateUrl: './site-footer.html',
  styleUrl: './site-footer.scss'
})
export class SiteFooter {
  protected readonly t = inject(TranslationService).t;

  protected readonly footerColumns: FooterColumn[] = [
    {
      titleKey: 'footer.inspiration.title',
      linkKeys: [
        'footer.inspiration.l1',
        'footer.inspiration.l2',
        'footer.inspiration.l3',
        'footer.inspiration.l4',
        'footer.inspiration.l5',
        'footer.inspiration.l6',
        'footer.inspiration.l7'
      ]
    },
    {
      titleKey: 'footer.products.title',
      linkKeys: [
        'footer.products.l1',
        'footer.products.l2',
        'footer.products.l3',
        'footer.products.l4',
        'footer.products.l5'
      ]
    },
    {
      titleKey: 'footer.publicSpace.title',
      linkKeys: [
        'footer.publicSpace.l1',
        'footer.publicSpace.l2',
        'footer.publicSpace.l3',
        'footer.publicSpace.l4',
        'footer.publicSpace.l5',
        'footer.publicSpace.l6'
      ]
    },
    {
      titleKey: 'footer.service.title',
      linkKeys: [
        'footer.service.l1',
        'footer.service.l2',
        'footer.service.l3',
        'footer.service.l4',
        'footer.service.l5',
        'footer.service.l6',
        'footer.service.l7'
      ]
    },
    {
      titleKey: 'footer.about.title',
      linkKeys: [
        'footer.about.l1',
        'footer.about.l2',
        'footer.about.l3',
        'footer.about.l4',
        'footer.about.l5',
        'footer.about.l6'
      ]
    }
  ];

  protected readonly complianceLinks: TranslationKey[] = [
    'footer.legal.impressum',
    'footer.legal.verhaltenskodex',
    'footer.legal.agb',
    'footer.legal.lieferantenkodex',
    'footer.legal.aeb',
    'footer.legal.datenschutz',
    'footer.legal.hinweise'
  ];

  protected readonly socialLinks = ['Facebook', 'Instagram', 'Pinterest'];
}
