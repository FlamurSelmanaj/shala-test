import { Component } from '@angular/core';

import { ASSET } from '../../shared/asset';
import { OverlayCard } from '../../shared/content.model';

@Component({
  selector: 'app-process',
  imports: [],
  templateUrl: './process.html',
  styleUrl: './process.scss'
})
export class Process {
  protected readonly overlayCards: OverlayCard[] = [
    {
      title: 'Inspiration für Ihre individuelle Außengestaltung',
      text:
        '„Einen Garten anzulegen heißt, an morgen zu glauben." Diesem Zitat von Audrey Hepburn schließen wir uns an – unser Ziel ist es, Sie bei der Gestaltung Ihres Außenbereichs mit hochwertigen Produkten zu unterstützen.',
      image: ASSET + '/fileadmin/_processed_/4/4/csm_Vios-Platten__100x100__grau-4_9d7c886c04.jpeg'
    },
    {
      title: 'KANN Planungstools',
      text:
        'Lassen Sie Ihrer Kreativität freien Lauf und planen Sie Ihren Außenbereich ganz einfach und bequem online mit unseren Planungstools.',
      image:
        ASSET +
        '/fileadmin/_processed_/2/6/csm_0000_KLEINJOBS_SERVICE_2023_UNTERSEITE_MAUERGESTALTER_2306272_56d80c2116.jpg'
    },
    {
      title: 'Öffentlicher Raum',
      text:
        'Ob Stadtplätze, Parks oder Verkehrsflächen – die Gestaltung öffentlicher Räume erfordert ein perfektes Zusammenspiel aus Ästhetik, Funktionalität und Langlebigkeit.',
      image:
        ASSET + '/fileadmin/_processed_/8/1/csm_Marktplatz_Neuwied_Vajo_RX40_09_BC_2025_a3d326babc.jpg'
    }
  ];
}
