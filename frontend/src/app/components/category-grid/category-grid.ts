import { Component } from '@angular/core';

import { ASSET } from '../../shared/asset';
import { Category } from '../../shared/content.model';

@Component({
  selector: 'app-category-grid',
  imports: [],
  templateUrl: './category-grid.html',
  styleUrl: './category-grid.scss'
})
export class CategoryGrid {
  protected readonly categories: Category[] = [
    {
      label: 'Gestaltungspflaster',
      icon: ASSET + '/fileadmin/user_upload/Icons/04_PRODUKT_ICONS_GESTALTUNGSPFLASTER.svg'
    },
    {
      label: 'Ökopflaster',
      icon: ASSET + '/fileadmin/user_upload/Icons/04_PRODUKT_ICONS_O___eKOGESTALTUNGSPFLASTER.svg'
    },
    {
      label: 'Funktionspflaster',
      icon: ASSET + '/fileadmin/user_upload/04_PRODUKT_ICONS_FUNKTIONSPFLASTER.svg'
    },
    {
      label: 'Beton Terrassenplatten',
      icon: ASSET + '/fileadmin/user_upload/terrassenplatten.svg'
    },
    {
      label: 'Keramik Terrassenplatten',
      icon: ASSET + '/fileadmin/user_upload/04_PRODUKT_ICONS_KERAMIKPLATTEN.svg'
    },
    {
      label: 'Blockstufen',
      icon: ASSET + '/fileadmin/user_upload/Icons/04_PRODUKT_ICONS_STUFEN.svg'
    },
    {
      label: 'Palisaden',
      icon: ASSET + '/fileadmin/user_upload/Icons/04_PRODUKT_ICONS_PALISADEN.svg'
    },
    {
      label: 'Mauer- & Böschungssysteme',
      icon: ASSET + '/fileadmin/user_upload/Icons/04_PRODUKT_ICONS_MAUERN.svg'
    },
    {
      label: 'Bord- & Randsteine',
      icon:
        ASSET +
        '/fileadmin/user_upload/Produktkategorie_Icons_Headerbilder/Bord_Randsteine/KBW_Produkticons_Bord-u-Randsteine_negativ.svg'
    },
    {
      label: 'Entwässerungssysteme',
      icon:
        ASSET +
        '/fileadmin/user_upload/Produktkategorie_Icons_Headerbilder/Entwaesserungartikel/KBW_Produkticons_Entwaesserungsartikel_negativ.svg'
    },
    {
      label: 'Fertigteile',
      icon:
        ASSET +
        '/fileadmin/user_upload/Produktkategorie_Icons_Headerbilder/Fertigteile/KBW_Produkticons_Fertigteile_negativ.svg'
    },
    {
      label: 'Reinigung & Zubehör',
      icon: ASSET + '/fileadmin/user_upload/Icons/04_PRODUKT_ICONS_REINIGUNGSMITTEL.svg'
    }
  ];
}
