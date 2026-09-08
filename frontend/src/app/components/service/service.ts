import { Component } from '@angular/core';

import { ASSET } from '../../shared/asset';
import { ServiceCard } from '../../shared/content.model';

@Component({
  selector: 'app-service',
  imports: [],
  templateUrl: './service.html',
  styleUrl: './service.scss'
})
export class Service {
  protected readonly serviceCards: ServiceCard[] = [
    {
      title: 'Händlersuche',
      text:
        'Auch wenn fast jeder Baustoff-Fachhandel KANN-Produkte führt, verrät Ihnen unser Händlerfinder, welche Fachhändler sich in Ihrer Nähe befinden.',
      image:
        ASSET +
        '/fileadmin/_processed_/8/1/csm_Kann_Relaunch_Service_Haendlersuche_Ein-Bildschirm_BH_edit_fbe3800577.jpg',
      link: 'Händlersuche'
    },
    {
      title: 'Info-Material',
      text:
        'Sie interessieren sich für unsere Broschüren und Kataloge? Einfach downloaden oder direkt nach Hause bestellen und Inspiration sammeln.',
      image:
        ASSET + '/fileadmin/_processed_/3/6/csm_pexels-cottonbro-studio-4003327_edit_26afaceb6d.jpg',
      link: 'Info-Material'
    },
    {
      title: 'Technische Hilfe',
      text:
        'Für einen perfekten Lieblingsplatz muss auch die Verarbeitung stimmen. Wir haben alles Wissenswerte für die einzelnen Einbauarbeiten aufbereitet.',
      image: ASSET + '/fileadmin/_processed_/3/f/csm_Kann_Service_TechnischeHilfe_jb_8530b65375.jpg',
      link: 'Technische Hilfe'
    }
  ];
}
