import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrandCoworkingComponent } from './brand-coworking/brand-coworking.component';
import { BrandGostepsComponent } from './brand-gosteps/brand-gosteps.component';
import { BrandComponent } from './brand.component';

const routes: Routes = [
  {
    path: '',
    component: BrandComponent,
    children: [
      {
        path: 'gostops',
        component: BrandGostepsComponent,
      },
      {
        path: ':slug',
        component: BrandCoworkingComponent,
      },
      {
        path: ':slug/:city',
        component: BrandCoworkingComponent,
      },
      {
        path: ':category/:slug/:city',
        component: BrandCoworkingComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BrandRoutingModule {}
