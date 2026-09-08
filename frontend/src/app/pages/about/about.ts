import { Component } from '@angular/core';

import { CareerCta } from '../../components/career-cta/career-cta';
import { Welcome } from '../../components/welcome/welcome';
import { ASSET } from '../../shared/asset';
import { PageHero } from '../../shared/page-hero/page-hero';

@Component({
  selector: 'app-about-page',
  imports: [PageHero, Welcome, CareerCta],
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class AboutPage {
  protected readonly heroImage =
    ASSET +
    '/fileadmin/_processed_/1/0/csm_Zentano_Antik__36x12x8__Moonlightschwarz_bb531d96ca.jpg';
}
