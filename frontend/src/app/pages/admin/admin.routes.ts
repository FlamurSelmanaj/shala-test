import { Routes } from '@angular/router';

/**
 * Admin feature routes, mounted lazily at `/admin` (see `app.routes.ts`). The
 * `AdminShell` provides a top nav + `<router-outlet>` for three sections:
 * Pages (edit-only) and Categories / Products (full CRUD).
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
        path: 'pages/:id',
        loadComponent: () => import('./page-editor/page-editor').then((m) => m.AdminPageEditor),
        title: 'title.adminPageEdit'
      },

      {
        path: 'categories',
        loadComponent: () =>
          import('./categories-list/categories-list').then((m) => m.AdminCategoriesList),
        title: 'title.adminCategories'
      },
      {
        path: 'categories/new',
        loadComponent: () =>
          import('./category-editor/category-editor').then((m) => m.AdminCategoryEditor),
        title: 'title.adminCategories'
      },
      {
        path: 'categories/:id',
        loadComponent: () =>
          import('./category-editor/category-editor').then((m) => m.AdminCategoryEditor),
        title: 'title.adminCategories'
      },

      {
        path: 'products',
        loadComponent: () =>
          import('./products-list/products-list').then((m) => m.AdminProductsList),
        title: 'title.adminProducts'
      },
      {
        path: 'products/new',
        loadComponent: () =>
          import('./product-editor/product-editor').then((m) => m.AdminProductEditor),
        title: 'title.adminProducts'
      },
      {
        path: 'products/:id',
        loadComponent: () =>
          import('./product-editor/product-editor').then((m) => m.AdminProductEditor),
        title: 'title.adminProducts'
      }
    ]
  }
];
