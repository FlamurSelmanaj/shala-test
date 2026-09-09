import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';

import { ContentService } from '../../content/content.service';
import { TranslationService } from '../../i18n';

@Component({
  selector: 'app-category-grid',
  imports: [RouterLink],
  templateUrl: './category-grid.html',
  styleUrl: './category-grid.scss'
})
export class CategoryGrid {
  private readonly i18n = inject(TranslationService);
  private readonly route = inject(ActivatedRoute);

  protected readonly t = this.i18n.t;
  protected readonly text = this.i18n.text;
  protected readonly categories = inject(ContentService).categories;

  /** The category currently filtering the product catalogue, from `?category=`. */
  protected readonly selectedSlug = toSignal(
    this.route.queryParamMap.pipe(map((params) => params.get('category'))),
    { initialValue: this.route.snapshot.queryParamMap.get('category') }
  );

  /** Selecting the active category again clears the filter. */
  protected queryParamsFor(slug: string): Record<string, string> {
    return this.selectedSlug() === slug ? {} : { category: slug };
  }
}
