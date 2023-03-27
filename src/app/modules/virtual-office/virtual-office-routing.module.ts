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
  {
    path: 'jaipur',
    component: VirtualOfficeCityComponent,
  },
  {
    path: 'faridabad',
    component: VirtualOfficeCityComponent,
  },
  {
    path: 'bhubaneswar',
    component: VirtualOfficeCityComponent,
  },
  {
    path: 'coimbatore',
    component: VirtualOfficeCityComponent,
  },
  {
    path: 'chandigarh',
    component: VirtualOfficeCityComponent,
  },

  {
    path: 'goa',
    component: VirtualOfficeCityComponent,
  },
  {
    path: 'kolkata',
    component: VirtualOfficeCityComponent,
  },
  {
    path: 'lucknow',
    component: VirtualOfficeCityComponent,
  },
  {
    path: 'guwahati',
    component: VirtualOfficeCityComponent,
  },
  {
    path: 'bhopal',
    component: VirtualOfficeCityComponent,
  },
  {
    path: 'dehradun',
    component: VirtualOfficeCityComponent,
  },
  {
    path: 'ernakulam',
    component: VirtualOfficeCityComponent,
  },
  {
    path: 'calicut',
    component: VirtualOfficeCityComponent,
  },
  {
    path: 'ludhiana',
    component: VirtualOfficeCityComponent,
  },
  {
    path: 'mohali',
    component: VirtualOfficeCityComponent,
  },
  {
    path: 'nagpur',
    component: VirtualOfficeCityComponent,
  },
  {
    path: 'patna',
    component: VirtualOfficeCityComponent,
  },
  {
    path: 'raipur',
    component: VirtualOfficeCityComponent,
  },
  {
    path: 'surat',
    component: VirtualOfficeCityComponent,
  },
  {
    path: 'trivandrum',
    component: VirtualOfficeCityComponent,
  },
  {
    path: 'vadodara',
    component: VirtualOfficeCityComponent,
  },
  {
    path: 'visakhapatnam',
    component: VirtualOfficeCityComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VirtualOfficeRoutingModule { }
