import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'tabs',
    loadChildren: () =>
      import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'terminos',
    loadComponent: () => import('./pages/terminos/terminos.page').then( m => m.TerminosPage)
  },
  {
    path: 'playlist/:id',
    loadComponent: () => import('./pages/playlist-detalle/playlist-detalle.page').then( m => m.PlaylistDetallePage)
  },
    {
    path: 'reproductor',
    loadComponent: () => import('./pages/reproductor/reproductor.page').then(m => m.ReproductorPage)
  },
  {
    path: 'reproductor',
    loadComponent: () => import('./pages/reproductor/reproductor.page').then( m => m.ReproductorPage)
  }

];
