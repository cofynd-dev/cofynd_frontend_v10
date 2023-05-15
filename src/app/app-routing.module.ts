import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marketingRoutes } from './modules/static-pages/marketing-pages/marketing-pages.routes';

const routes: Routes = [
  ...marketingRoutes,
  {
    path: '',
    loadChildren: () => import('./layouts/main/main.module').then(m => m.MainModule),
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then(m => m.LoginModule),
  },
  {
    path: 'sign-up',
    loadChildren: () => import('./auth/register/register.module').then(m => m.RegisterModule),
  },
  {
    path: 'coworking-space-gurgaon',
    loadChildren: () =>
      import('./modules/static-pages/marketing-pages/marketing-pages.module').then(m => m.MarketingPagesModule),
  },
  {
    path: '**',
    loadChildren: () =>
      import('./modules/static-pages/page-not-found/page-not-found.module').then(m => m.PageNotFoundModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
