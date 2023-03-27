import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CareerComponent } from './career/career.component';
import { CareerDetailsComponent } from './career-details/career-details.component';


const routes: Routes = [
  {
    path: '',
    component: CareerComponent,
  },
  {
    path: ':slug',
    component: CareerDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CareerRoutingModule { }
