import { Component } from '@angular/core';

import { ASSET } from '../../shared/asset';

@Component({
  selector: 'app-resorb',
  imports: [],
  templateUrl: './resorb.html',
  styleUrl: './resorb.scss'
})
export class Resorb {
  protected readonly resorbImage =
    ASSET +
    '/fileadmin/_processed_/5/b/csm_KBW_Steingrafiken_mitSticker_aufGrau_Resorb_1_32627ea3e7.jpg';
}
