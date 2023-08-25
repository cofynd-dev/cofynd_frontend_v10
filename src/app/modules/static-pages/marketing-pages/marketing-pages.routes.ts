export const marketingRoutes = [
  {
    path: 'coworking-space-gurgaon',
    loadChildren: () => import('./marketing-pages.module').then(m => m.MarketingPagesModule),
  },
  // {
  //   path: 'coworking-space-delhi',
  //   loadChildren: () => import('./marketing-pages.module').then(m => m.MarketingPagesModule),
  // },
  // {
  //   path: 'coworking-space-noida',
  //   loadChildren: () => import('./marketing-pages.module').then(m => m.MarketingPagesModule),
  // },
  // {
  //   path: 'coworking-space-bangalore',
  //   loadChildren: () => import('./marketing-pages.module').then(m => m.MarketingPagesModule),
  // },
  // {
  //   path: 'coworking-space-hyderabad',
  //   loadChildren: () => import('./marketing-pages.module').then(m => m.MarketingPagesModule),
  // },
  // {
  //   path: 'coworking-space-pune',
  //   loadChildren: () => import('./marketing-pages.module').then(m => m.MarketingPagesModule),
  // },
  {
    path: 'coworking-space-mumbai',
    loadChildren: () => import('./mumbai-marketing/mumbai-marketing.module').then(m => m.MumbaiMarketingModule),
  },
];
