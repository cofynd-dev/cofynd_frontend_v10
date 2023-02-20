import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ColivingBrandComponent } from './coliving-brand/coliving-brand.component';
import { ColivingBrandDetailComponent } from './coliving-brand-detail/coliving-brand-detail.component';


const routes: Routes = [
  // {
  //   path: '',
  //   component: ColivingBrandComponent,
  // },
  {
    path: ':slug',
    component: ColivingBrandDetailComponent,
  },
  {
    path: ':slug/:city',
    component: ColivingBrandDetailComponent,
  },
  {
    path: ':category/:slug/:city',
    component: ColivingBrandDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ColivingBrandRoutingModule { }
