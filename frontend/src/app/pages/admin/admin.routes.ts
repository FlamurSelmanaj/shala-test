import { Routes } from '@angular/router';

/**
 * Admin feature routes, mounted lazily at `/admin` (see `app.routes.ts`). A shell
 * with its own `<router-outlet>` wraps the child screens, keeping the admin area
 * a separate subtree from the public site routes.
 */
export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-shell').then((m) => m.AdminShell),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'pages' },
      {
        path: 'pages',
        loadComponent: () => import('./pages-list/pages-list').then((m) => m.AdminPagesList),
        title: 'title.adminPages'
      },
      {
        path: 'pages/new',
        loadComponent: () => import('./page-editor/page-editor').then((m) => m.AdminPageEditor),
        title: 'title.adminPageNew'
      },
      {
        path: 'pages/:id',
        loadComponent: () => import('./page-editor/page-editor').then((m) => m.AdminPageEditor),
        title: 'title.adminPageEdit'
      }
    ]
  }
];
