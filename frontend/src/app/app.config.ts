import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners
} from '@angular/core';
import { TitleStrategy, provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { ContentService } from './content/content.service';
import { TranslatedTitleStrategy } from './i18n';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAppInitializer(() => inject(ContentService).load()),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' })
    ),
    { provide: TitleStrategy, useClass: TranslatedTitleStrategy }
  ]
};
