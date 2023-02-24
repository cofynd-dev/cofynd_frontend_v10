import { Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { staticPageRoutes as STATIC_ROUTES } from '@app/modules/static-pages/static-pages.routes';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
  },
  ...STATIC_ROUTES,
  {
    path: 'list-your-space',
    loadChildren: () => import('./list-your-space/list-your-space.module').then(m => m.ListYourSpaceModule),
  },
  {
    path: 'coworking',
    loadChildren: () => import('./coworking/coworking.module').then(m => m.CoworkingModule),
  },
  {
    path: 'co-living',
    loadChildren: () => import('./co-living/co-living.module').then(m => m.CoLivingModule),
  },
  {
    path: 'office-space/rent',
    loadChildren: () => import('./office-space/office-space.module').then(m => m.OfficeSpaceModule),
  },

  {
    path: 'search',
    loadChildren: () => import('./search/search.module').then(m => m.SearchModule),
  },
  {
    path: 'brand',
    loadChildren: () => import('./brand/brand.module').then(m => m.BrandModule),
  },
  {
    path: 'coworking-brand',
    loadChildren: () => import('./coworking-brand/coworking-brand.module').then(m => m.CoworkingBrandModule)
  },
  {
    path: 'co-living-brand',
    loadChildren: () => import('./coliving-brand/coliving-brand.module').then(m => m.ColivingBrandModule)
  },
  {
    path: 'career',
    loadChildren: () => import('./career/career.module').then(m => m.CareerModule)
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'booking',
    loadChildren: () => import('./booking/booking.module').then(m => m.BookingModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'transaction-success',
    loadChildren: () =>
      import('./transaction-success/transaction-success.module').then(m => m.TransactionSuccessModule),
    canActivate: [AuthGuard],
  },

  {
    path: 'workation',
    loadChildren: () => import('./workation/workation.module').then(m => m.WorkationModule),
  },
  {
    path: 'virtual-office',
    loadChildren: () => import('./virtual-office/virtual-office.module').then(m => m.VirtualOfficeModule),
  },
  {
    path: ':country',
    loadChildren: () => import('./dynamic-modules/coworking.module').then(m => m.CoworkingModule),
  },
  // {
  //   path: 'hostel',
  //   loadChildren: () => import('./hostel/hostel.module').then(m => m.HostelModule),
  // },
];
