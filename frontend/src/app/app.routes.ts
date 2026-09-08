import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.HomePage),
    title: 'title.home'
  },
  {
    path: 'inspiration',
    loadComponent: () => import('./pages/inspiration/inspiration').then((m) => m.InspirationPage),
    title: 'title.inspiration'
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products').then((m) => m.ProductsPage),
    title: 'title.products'
  },
  {
    path: 'public-space',
    loadComponent: () => import('./pages/public-space/public-space').then((m) => m.PublicSpacePage),
    title: 'title.publicSpace'
  },
  {
    path: 'service',
    loadComponent: () => import('./pages/service/service').then((m) => m.ServicePage),
    title: 'title.service'
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about').then((m) => m.AboutPage),
    title: 'title.about'
  },
  {
    path: 'careers',
    loadComponent: () => import('./pages/careers/careers').then((m) => m.CareersPage),
    title: 'title.careers'
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFoundPage),
    title: 'title.notFound'
  }
];
