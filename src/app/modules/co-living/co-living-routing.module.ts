import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoLivingCityComponent } from './co-living-city/co-living-city.component';
import { CoLivingDetailComponent } from './co-living-detail/co-living-detail.component';
import { CoLivingLocalityComponent } from './co-living-locality/co-living-locality.component';
import { CoLivingComponent } from './co-living.component';

const routes: Routes = [
  {
    path: '',
    component: CoLivingComponent,
  },
  // {
  //   path: 'room-for-rent/gurugram',
  //   component: CoLivingCityComponent,
  // },
  {
    path: 'gurugram',
    component: CoLivingCityComponent,
  },
  {
    path: 'bangalore',
    component: CoLivingCityComponent,
  },
  {
    path: 'hyderabad',
    component: CoLivingCityComponent,
  },
  {
    path: 'mumbai',
    component: CoLivingCityComponent,
  },
  {
    path: 'noida',
    component: CoLivingCityComponent,
  },
  {
    path: 'pune',
    component: CoLivingCityComponent,
  },
  {
    path: 'indore',
    component: CoLivingCityComponent,
  },
  {
    path: 'delhi',
    component: CoLivingCityComponent,
  },
  {
    path: 'chennai',
    component: CoLivingCityComponent,
  },
  {
    path: 'kolkata',
    component: CoLivingCityComponent,
  },
  {
    path: 'jaipur',
    component: CoLivingCityComponent,
  },
  {
    path: 'ahmedabad',
    component: CoLivingCityComponent,
  },
  {
    path: 'coimbatore',
    component: CoLivingCityComponent,
  },
  {
    path: 'bhubaneswar',
    component: CoLivingCityComponent,
  },
  {
    path: 'dehradun',
    component: CoLivingCityComponent,
  },
  {
    path: 'kochi',
    component: CoLivingCityComponent,
  },
  {
    path: 'goa',
    component: CoLivingCityComponent,
  },
  {
    path: 'chandigarh',
    component: CoLivingCityComponent,
  },
  {
    path: 'lucknow',
    component: CoLivingCityComponent,
  },
  // {
  //   path: 'room-for-rent/gurugram/:locality',
  //   component: CoLivingLocalityComponent,
  // },
  {
    path: 'gurugram/:locality',
    component: CoLivingLocalityComponent,
  },
  {
    path: 'bangalore/:locality',
    component: CoLivingLocalityComponent,
  },
  {
    path: 'hyderabad/:locality',
    component: CoLivingLocalityComponent,
  },
  {
    path: 'mumbai/:locality',
    component: CoLivingLocalityComponent,
  },
  {
    path: 'noida/:locality',
    component: CoLivingLocalityComponent,
  },
  {
    path: 'pune/:locality',
    component: CoLivingLocalityComponent,
  },
  {
    path: 'indore/:locality',
    component: CoLivingLocalityComponent,
  },
  {
    path: 'delhi/:locality',
    component: CoLivingLocalityComponent,
  },
  {
    path: 'chennai/:locality',
    component: CoLivingLocalityComponent,
  },
  {
    path: 'kolkata/:locality',
    component: CoLivingLocalityComponent,
  },
  {
    path: 'jaipur/:locality',
    component: CoLivingLocalityComponent,
  },
  {
    path: 'ahmedabad/:locality',
    component: CoLivingLocalityComponent,
  },
  {
    path: 'coimbatore/:locality',
    component: CoLivingLocalityComponent,
  },
  {
    path: 'bhubaneswar/:locality',
    component: CoLivingLocalityComponent,
  },
  {
    path: 'dehradun/:locality',
    component: CoLivingLocalityComponent,
  },
  {
    path: 'kochi/:locality',
    component: CoLivingLocalityComponent,
  },
  {
    path: 'goa/:locality',
    component: CoLivingLocalityComponent,
  },
  {
    path: 'chandigarh/:locality',
    component: CoLivingLocalityComponent,
  },
  {
    path: 'lucknow/:locality',
    component: CoLivingLocalityComponent,
  },
  {
    path: ':id',
    component: CoLivingDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoLivingRoutingModule {}
