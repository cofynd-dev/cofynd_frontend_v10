import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoworkingBrandComponent } from './coworking-brand/coworking-brand.component';
import { CoworkingBrandDetailComponent } from './coworking-brand-detail/coworking-brand-detail.component';


const routes: Routes = [
  {
    path: '',
    component: CoworkingBrandComponent,
  },
  {
    path: ':slug',
    component: CoworkingBrandDetailComponent,
  },
  {
    path: ':slug/:city',
    component: CoworkingBrandDetailComponent,
  },
  {
    path: ':category/:slug/:city',
    component: CoworkingBrandDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoworkingBrandRoutingModule { }
