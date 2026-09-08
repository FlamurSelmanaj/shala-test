import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.HomePage),
    title: 'KANN Baustoffwerke'
  },
  {
    path: 'inspiration',
    loadComponent: () => import('./pages/inspiration/inspiration').then((m) => m.InspirationPage),
    title: 'Inspiration | KANN'
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products').then((m) => m.ProductsPage),
    title: 'Alle Produkte | KANN'
  },
  {
    path: 'public-space',
    loadComponent: () => import('./pages/public-space/public-space').then((m) => m.PublicSpacePage),
    title: 'Öffentlicher Raum | KANN'
  },
  {
    path: 'service',
    loadComponent: () => import('./pages/service/service').then((m) => m.ServicePage),
    title: 'Service | KANN'
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about').then((m) => m.AboutPage),
    title: 'KANN'
  },
  {
    path: 'careers',
    loadComponent: () => import('./pages/careers/careers').then((m) => m.CareersPage),
    title: 'Karriere | KANN'
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFoundPage),
    title: 'Seite nicht gefunden | KANN'
  }
];
