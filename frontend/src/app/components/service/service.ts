import { Component, inject } from '@angular/core';

import { TranslationService } from '../../i18n';
import { ASSET } from '../../shared/asset';
import { ServiceCard } from '../../shared/content.model';

@Component({
  selector: 'app-service',
  imports: [],
  templateUrl: './service.html',
  styleUrl: './service.scss'
})
export class Service {
  protected readonly t = inject(TranslationService).t;

  protected readonly serviceCards: ServiceCard[] = [
    {
      titleKey: 'service.c1.title',
      textKey: 'service.c1.text',
      linkKey: 'service.c1.link',
      image:
        ASSET +
        '/fileadmin/_processed_/8/1/csm_Kann_Relaunch_Service_Haendlersuche_Ein-Bildschirm_BH_edit_fbe3800577.jpg'
    },
    {
      titleKey: 'service.c2.title',
      textKey: 'service.c2.text',
      linkKey: 'service.c2.link',
      image:
        ASSET + '/fileadmin/_processed_/3/6/csm_pexels-cottonbro-studio-4003327_edit_26afaceb6d.jpg'
    },
    {
      titleKey: 'service.c3.title',
      textKey: 'service.c3.text',
      linkKey: 'service.c3.link',
      image: ASSET + '/fileadmin/_processed_/3/f/csm_Kann_Service_TechnischeHilfe_jb_8530b65375.jpg'
    }
  ];
}
