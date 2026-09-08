import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';

import { ContentService } from '../../content/content.service';
import { TranslationService } from '../../i18n';

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
  protected readonly heroSlides = inject(ContentService).hero;

  protected readonly activeSlide = signal(0);

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
    const count = this.heroSlides().length || 1;
    this.activeSlide.update((i) => (i + 1) % count);
  }

  protected prev(): void {
    const count = this.heroSlides().length || 1;
    this.activeSlide.update((i) => (i - 1 + count) % count);
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
