import { inject } from '@angular/core';
import { type CanMatchFn } from '@angular/router';

import { ContentService } from './content.service';

/**
 * Lets the `:slug` route match only when a page with that slug exists in the
 * loaded content. Unknown slugs fall through to the wildcard 404 route.
 * `localdb.json` is loaded by the app initializer before any route is matched.
 */
export const pageExists: CanMatchFn = (_route, segments) => {
  const slug = segments[0]?.path ?? '';
  return inject(ContentService)
    .pages()
    .some((page) => page.slug === slug);
};
