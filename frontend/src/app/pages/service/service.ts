import { Component } from '@angular/core';

import { Process } from '../../components/process/process';
import { Service } from '../../components/service/service';
import { ASSET } from '../../shared/asset';
import { PageHero } from '../../shared/page-hero/page-hero';

@Component({
  selector: 'app-service-page',
  imports: [PageHero, Service, Process],
  templateUrl: './service.html',
  styleUrl: './service.scss'
})
export class ServicePage {
  protected readonly heroImage =
    ASSET + '/fileadmin/_processed_/f/a/csm_Pheos-Platten__60x40__anthrazit_plus-1_eaa6f88376.jpeg';
}
