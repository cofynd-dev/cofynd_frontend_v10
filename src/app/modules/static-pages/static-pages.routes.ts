import { Routes } from '@angular/router';

export const staticPageRoutes: Routes = [
  {
    path: '404',
    loadChildren: () => import('./page-not-found/page-not-found.module').then(m => m.PageNotFoundModule),
  },
  {
    path: 'about-us',
    loadChildren: () => import('./about-us/about-us.module').then(m => m.AboutUsModule),
  },
  {
    path: 'privacy-policy',
    loadChildren: () => import('./privacy/privacy.module').then(m => m.PrivacyModule),
  },
  {
    path: 'contact-us',
    loadChildren: () => import('./contact-us/contact-us.module').then(m => m.ContactUsModule),
  },
  {
    path: 'terms-and-conditions',
    loadChildren: () => import('./terms-condition/terms-condition.module').then(m => m.TermsConditionModule)
  }
];
