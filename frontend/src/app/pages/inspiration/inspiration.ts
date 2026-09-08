import { Component } from '@angular/core';

import { Magazine } from '../../components/magazine/magazine';
import { Welcome } from '../../components/welcome/welcome';
import { ASSET } from '../../shared/asset';
import { PageHero } from '../../shared/page-hero/page-hero';

@Component({
  selector: 'app-inspiration-page',
  imports: [PageHero, Welcome, Magazine],
  templateUrl: './inspiration.html',
  styleUrl: './inspiration.scss'
})
export class InspirationPage {
  protected readonly heroImage =
    ASSET + '/fileadmin/_processed_/0/d/csm_Stolberg_Vios_08_grauRET_5df309f21c.jpg';
}
