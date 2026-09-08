import { Component } from '@angular/core';

import { Resorb } from '../../components/resorb/resorb';
import { Service } from '../../components/service/service';
import { ASSET } from '../../shared/asset';
import { PageHero } from '../../shared/page-hero/page-hero';

@Component({
  selector: 'app-public-space-page',
  imports: [PageHero, Resorb, Service],
  templateUrl: './public-space.html',
  styleUrl: './public-space.scss'
})
export class PublicSpacePage {
  protected readonly heroImage =
    ASSET + '/fileadmin/_processed_/6/3/csm_Solarmodulhalter_Montage_KI-RET_d2bb95308f.jpg';
}
