import { NgComponentOutlet } from '@angular/common';
import { Component, computed, effect, inject, input } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ContentService } from '../../content/content.service';
import { SECTION_REGISTRY } from '../../content/section-registry';
import { TranslationService } from '../../i18n';
import { PageHero } from '../../shared/page-hero/page-hero';

/**
 * Generic content page: renders `<app-page-hero>` plus the ordered `sections` from
 * the matching {@link ContentService} page record. The `:slug` route only matches
 * known slugs (see `pageExists`), so `record()` is always defined here.
 */
@Component({
  selector: 'app-page',
  imports: [PageHero, NgComponentOutlet],
  template: `
    @let page = record();
    @if (page) {
      <app-page-hero
        [title]="t(page.titleKey)"
        [subtitle]="t(page.subtitleKey)"
        [image]="page.heroImage"
      />
      @for (section of page.sections; track $index) {
        <ng-container *ngComponentOutlet="registry[section]" />
      }
    }
  `,
  styles: ':host { display: block; }'
})
export class PageComponent {
  private readonly content = inject(ContentService);
  private readonly title = inject(Title);

  protected readonly t = inject(TranslationService).t;
  protected readonly registry = SECTION_REGISTRY;

  /** Bound from the `:slug` route param via `withComponentInputBinding()`. */
  readonly slug = input.required<string>();

  protected readonly record = computed(() =>
    this.content.pages().find((page) => page.slug === this.slug())
  );

  constructor() {
    effect(() => {
      const page = this.record();
      if (page) {
        this.title.setTitle(`${this.t(page.titleKey)} | Shalaj`);
      }
    });
  }
}
