import { Component } from '@angular/core';

import { FooterColumn } from '../../shared/content.model';

@Component({
  selector: 'app-site-footer',
  imports: [],
  templateUrl: './site-footer.html',
  styleUrl: './site-footer.scss'
})
export class SiteFooter {
  protected readonly footerColumns: FooterColumn[] = [
    {
      title: 'Inspiration',
      links: [
        'Stilwelten',
        'Naturgarten',
        'Urbaner Garten',
        'Magazin',
        'Mustergärten',
        'Inspirationsgalerie',
        'Oberflächen'
      ]
    },
    {
      title: 'Alle Produkte',
      links: [
        'Produktneuheiten 2026',
        'Produktkategorien',
        'Systemfamilien',
        'Klimalieblinge',
        'Solarmodulhalter'
      ]
    },
    {
      title: 'Öffentlicher Raum',
      links: [
        'Projekte und Inspiration',
        'Individuelle Lösungen',
        'Klimalieblinge',
        'Ausschreibungstexte',
        'Oberflächentexturen',
        'Mediaportal'
      ]
    },
    {
      title: 'Service',
      links: [
        'Technische Hilfe',
        'Häufig gestellte Fragen',
        'Händlersuche',
        'Broschüren & Kataloge',
        'Planungstools',
        'Mustergärten',
        'KANN-Shop'
      ]
    },
    {
      title: 'KANN',
      links: ['Klimalieblinge', 'Nachhaltigkeit', 'Karriere', 'Über uns', 'Presse', 'Kontakt']
    }
  ];

  protected readonly complianceLinks = [
    'Impressum',
    'Verhaltenskodex',
    'AGB',
    'Lieferantenverhaltenskodex',
    'AEB',
    'Datenschutz',
    'Allgemeine Hinweise'
  ];

  protected readonly socialLinks = ['Facebook', 'Instagram', 'Pinterest'];
}
