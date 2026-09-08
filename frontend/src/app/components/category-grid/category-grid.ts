import { Component, inject } from '@angular/core';

import { TranslationService } from '../../i18n';
import { ASSET } from '../../shared/asset';
import { Category } from '../../shared/content.model';

@Component({
  selector: 'app-category-grid',
  imports: [],
  templateUrl: './category-grid.html',
  styleUrl: './category-grid.scss'
})
export class CategoryGrid {
  protected readonly t = inject(TranslationService).t;

  protected readonly categories: Category[] = [
    {
      labelKey: 'categories.gestaltungspflaster',
      icon: ASSET + '/fileadmin/user_upload/Icons/04_PRODUKT_ICONS_GESTALTUNGSPFLASTER.svg'
    },
    {
      labelKey: 'categories.oekopflaster',
      icon: ASSET + '/fileadmin/user_upload/Icons/04_PRODUKT_ICONS_O___eKOGESTALTUNGSPFLASTER.svg'
    },
    {
      labelKey: 'categories.funktionspflaster',
      icon: ASSET + '/fileadmin/user_upload/04_PRODUKT_ICONS_FUNKTIONSPFLASTER.svg'
    },
    {
      labelKey: 'categories.betonTerrassenplatten',
      icon: ASSET + '/fileadmin/user_upload/terrassenplatten.svg'
    },
    {
      labelKey: 'categories.keramikTerrassenplatten',
      icon: ASSET + '/fileadmin/user_upload/04_PRODUKT_ICONS_KERAMIKPLATTEN.svg'
    },
    {
      labelKey: 'categories.blockstufen',
      icon: ASSET + '/fileadmin/user_upload/Icons/04_PRODUKT_ICONS_STUFEN.svg'
    },
    {
      labelKey: 'categories.palisaden',
      icon: ASSET + '/fileadmin/user_upload/Icons/04_PRODUKT_ICONS_PALISADEN.svg'
    },
    {
      labelKey: 'categories.mauerBoeschung',
      icon: ASSET + '/fileadmin/user_upload/Icons/04_PRODUKT_ICONS_MAUERN.svg'
    },
    {
      labelKey: 'categories.bordRandsteine',
      icon:
        ASSET +
        '/fileadmin/user_upload/Produktkategorie_Icons_Headerbilder/Bord_Randsteine/KBW_Produkticons_Bord-u-Randsteine_negativ.svg'
    },
    {
      labelKey: 'categories.entwaesserung',
      icon:
        ASSET +
        '/fileadmin/user_upload/Produktkategorie_Icons_Headerbilder/Entwaesserungartikel/KBW_Produkticons_Entwaesserungsartikel_negativ.svg'
    },
    {
      labelKey: 'categories.fertigteile',
      icon:
        ASSET +
        '/fileadmin/user_upload/Produktkategorie_Icons_Headerbilder/Fertigteile/KBW_Produkticons_Fertigteile_negativ.svg'
    },
    {
      labelKey: 'categories.reinigungZubehoer',
      icon: ASSET + '/fileadmin/user_upload/Icons/04_PRODUKT_ICONS_REINIGUNGSMITTEL.svg'
    }
  ];
}
