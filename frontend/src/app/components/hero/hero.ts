import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';

import { TranslationService } from '../../i18n';
import { ASSET } from '../../shared/asset';
import { HeroSlide } from '../../shared/content.model';

const ROTATE_MS = 6000;

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.scss'
})
export class Hero implements OnInit, OnDestroy {
  private timer: ReturnType<typeof setInterval> | undefined;

  protected readonly t = inject(TranslationService).t;

  protected readonly activeSlide = signal(0);

  protected readonly heroSlides: HeroSlide[] = [
    {
      titleKey: 'hero.s1.title',
      subtitleKey: 'hero.s1.subtitle',
      image:
        ASSET + '/fileadmin/_processed_/b/0/csm_Vios-Platten__greige__100x100__18__RET_9415a69c34.jpg',
      badge:
        ASSET +
        '/fileadmin/haendleraktion2026/grafiken/KBW_Jahreshighlights_Vios-Pheos_Preisstoerer_00-01.svg'
    },
    {
      titleKey: 'hero.s2.title',
      subtitleKey: 'hero.s2.subtitle',
      image: ASSET + '/fileadmin/_processed_/0/d/csm_Stolberg_Vios_08_grauRET_5df309f21c.jpg',
      badge:
        ASSET +
        '/fileadmin/user_upload/Startseite_NEW/KBW_Klimalieblinge_Sticker_STADTKLIMASTEIN_RGB.svg'
    },
    {
      titleKey: 'hero.s3.title',
      subtitleKey: 'hero.s3.subtitle',
      image: ASSET + '/fileadmin/_processed_/6/3/csm_Solarmodulhalter_Montage_KI-RET_d2bb95308f.jpg'
    },
    {
      titleKey: 'hero.s4.title',
      subtitleKey: 'hero.s4.subtitle',
      image:
        ASSET + '/fileadmin/_processed_/f/a/csm_Pheos-Platten__60x40__anthrazit_plus-1_eaa6f88376.jpeg'
    },
    {
      titleKey: 'hero.s5.title',
      subtitleKey: 'hero.s5.subtitle',
      image:
        ASSET +
        '/fileadmin/_processed_/1/4/csm_Vios__40x20__anthrazit__Vios-Platten__100x100__grau-5_e180a784c7.jpeg'
    },
    {
      titleKey: 'hero.s6.title',
      subtitleKey: 'hero.s6.subtitle',
      image:
        ASSET +
        '/fileadmin/_processed_/1/0/csm_Zentano_Antik__36x12x8__Moonlightschwarz_bb531d96ca.jpg'
    }
  ];

  ngOnInit(): void {
    this.startTimer();
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  protected goToSlide(index: number): void {
    this.activeSlide.set(index);
    this.startTimer();
  }

  protected next(): void {
    this.activeSlide.update((i) => (i + 1) % this.heroSlides.length);
  }

  protected prev(): void {
    this.activeSlide.update((i) => (i - 1 + this.heroSlides.length) % this.heroSlides.length);
    this.startTimer();
  }

  private startTimer(): void {
    this.stopTimer();
    this.timer = setInterval(() => this.next(), ROTATE_MS);
  }

  private stopTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }
}
