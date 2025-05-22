import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },

      {
        path: 'users/:id/edit',
        loadComponent: () =>
          import('./pages/form/form.component').then((m) => m.FormComponent),
      },
      {
        path: 'users/create',
        loadComponent: () =>
          import('./pages/create/create.component').then(
            (m) => m.CreateComponent
          ),
      },
      {
        path: 'users/:id',
        loadComponent: () =>
          import('./pages/profile/profile.component').then(
            (m) => m.ProfileComponent
          ),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./pages/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: '**',
        loadComponent: () =>
          import('./pages/error404/error404.component').then(
            (m) => m.Error404Component
          ),
      },
    ],
  },
];
