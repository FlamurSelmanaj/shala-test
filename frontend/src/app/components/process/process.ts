import { Component, inject } from '@angular/core';

import { TranslationService } from '../../i18n';
import { ASSET } from '../../shared/asset';
import { OverlayCard } from '../../shared/content.model';

@Component({
  selector: 'app-process',
  imports: [],
  templateUrl: './process.html',
  styleUrl: './process.scss'
})
export class Process {
  protected readonly t = inject(TranslationService).t;

  protected readonly overlayCards: OverlayCard[] = [
    {
      titleKey: 'process.c1.title',
      textKey: 'process.c1.text',
      image: ASSET + '/fileadmin/_processed_/4/4/csm_Vios-Platten__100x100__grau-4_9d7c886c04.jpeg'
    },
    {
      titleKey: 'process.c2.title',
      textKey: 'process.c2.text',
      image:
        ASSET +
        '/fileadmin/_processed_/2/6/csm_0000_KLEINJOBS_SERVICE_2023_UNTERSEITE_MAUERGESTALTER_2306272_56d80c2116.jpg'
    },
    {
      titleKey: 'process.c3.title',
      textKey: 'process.c3.text',
      image:
        ASSET + '/fileadmin/_processed_/8/1/csm_Marktplatz_Neuwied_Vajo_RX40_09_BC_2025_a3d326babc.jpg'
    }
  ];
}
