import { Routes } from '@angular/router';

import { pageExists } from './content/page.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.HomePage),
    title: 'title.home'
  },
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.routes').then((m) => m.ADMIN_ROUTES)
  },
  {
    path: ':slug',
    canMatch: [pageExists],
    loadComponent: () => import('./pages/page/page').then((m) => m.PageComponent)
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFoundPage),
    title: 'title.notFound'
  }
];
