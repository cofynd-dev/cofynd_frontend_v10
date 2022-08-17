import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OfficeSpaceCityComponent } from './office-space-city/office-space-city.component';
import { OfficeSpaceLocalityComponent } from './office-space-locality/office-space-locality.component';
import { OfficeSpaceComponent } from './office-space.component';

const routes: Routes = [
  {
    path: '',
    component: OfficeSpaceComponent,
  },
  {
    path: 'gurugram',
    component: OfficeSpaceCityComponent,
  },
  {
    path: 'gurugram/:locality',
    component: OfficeSpaceLocalityComponent,
  },
  {
    path: 'delhi',
    component: OfficeSpaceCityComponent,
  },
  {
    path: 'delhi/:locality',
    component: OfficeSpaceLocalityComponent,
  },
  {
    path: 'noida',
    component: OfficeSpaceCityComponent,
  },
  {
    path: 'noida/:locality',
    component: OfficeSpaceLocalityComponent,
  },
  {
    path: 'bangalore',
    component: OfficeSpaceCityComponent,
  },
  {
    path: 'hyderabad',
    component: OfficeSpaceCityComponent,
  },
  {
    path: 'pune',
    component: OfficeSpaceCityComponent,
  },
  {
    path: 'mumbai',
    component: OfficeSpaceCityComponent,
  },
  {
    path: 'bangalore/:locality',
    component: OfficeSpaceLocalityComponent,
  },
  {
    path: 'hyderabad/:locality',
    component: OfficeSpaceLocalityComponent,
  },
  {
    path: 'pune/:locality',
    component: OfficeSpaceLocalityComponent,
  },
  {
    path: 'mumbai/:locality',
    component: OfficeSpaceLocalityComponent,
  },
  {
    path: ':id',
    loadChildren: () => import('./office-space-detail/office-space-detail.module').then(m => m.OfficeSpaceDetailModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfficeSpaceRoutingModule { }
