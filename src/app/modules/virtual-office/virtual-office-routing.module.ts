import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VirtualOfficeCityComponent } from './virtual-office-city/virtual-office-city.component';
import { VirtualOfficeComponent } from './virtual-office.component';

const routes: Routes = [
  {
    path: '',
    component: VirtualOfficeComponent,
  },
  {
    path: 'delhi',
    component: VirtualOfficeCityComponent,
  },
  {
    path: 'gurugram',
    component: VirtualOfficeCityComponent,
  },
  {
    path: 'noida',
    component: VirtualOfficeCityComponent,
  },
  {
    path: 'bangalore',
    component: VirtualOfficeCityComponent,
  },
  {
    path: 'hyderabad',
    component: VirtualOfficeCityComponent,
  },
  {
    path: 'pune',
    component: VirtualOfficeCityComponent,
  },
  {
    path: 'mumbai',
    component: VirtualOfficeCityComponent,
  },
  {
    path: 'indore',
    component: VirtualOfficeCityComponent,
  },
  {
    path: 'ahmedabad',
    component: VirtualOfficeCityComponent,
  },
  {
    path: 'kochi',
    component: VirtualOfficeCityComponent,
  },
  {
    path: 'chennai',
    component: VirtualOfficeCityComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VirtualOfficeRoutingModule {}
