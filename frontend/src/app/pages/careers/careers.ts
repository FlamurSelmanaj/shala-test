import { Component } from '@angular/core';

import { CareerCta } from '../../components/career-cta/career-cta';
import { ASSET } from '../../shared/asset';
import { PageHero } from '../../shared/page-hero/page-hero';

@Component({
  selector: 'app-careers-page',
  imports: [PageHero, CareerCta],
  templateUrl: './careers.html',
  styleUrl: './careers.scss'
})
export class CareersPage {
  protected readonly heroImage =
    ASSET +
    '/fileadmin/_processed_/c/8/csm_02_KREATION_ARBEITGEBERMARKE_BANNER_START_1900x990px_220204_d482f6d740.jpg';
}
