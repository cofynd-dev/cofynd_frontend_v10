import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoworkingCityComponent } from './coworking-city/coworking-city.component';
import { CoworkingHomeComponent } from './coworking-home/coworking-home.component';
import { CoworkingLocalityComponent } from './coworking-locality/coworking-locality.component';
import { CoworkingNearMetroComponent } from './coworking-near-metro/coworking-near-metro.component';
import { CoworkingOpenAllDayComponent } from './coworking-open-all-day/coworking-open-all-day.component';
import { CoworkingSundayOpenComponent } from './coworking-sunday-open/coworking-sunday-open.component';
import { CoworkingComponent } from './coworking.component';

const routes: Routes = [
  { path: '', component: CoworkingComponent },
  { path: 'home', component: CoworkingHomeComponent },
  {
    path: 'delhi',
    component: CoworkingCityComponent,
  },
  {
    path: 'jodhpur',
    component: CoworkingCityComponent,
  },
  {
    path: 'faridabad',
    component: CoworkingCityComponent,
  },
  {
    path: 'gurugram',
    component: CoworkingCityComponent,
  },
  {
    path: 'noida',
    component: CoworkingCityComponent,
  },
  {
    path: 'bangalore',
    component: CoworkingCityComponent,
  },
  {
    path: 'hyderabad',
    component: CoworkingCityComponent,
  },
  {
    path: 'pune',
    component: CoworkingCityComponent,
  },
  {
    path: 'mumbai',
    component: CoworkingCityComponent,
  },
  {
    path: 'chennai',
    component: CoworkingCityComponent,
  },
  {
    path: 'ahmedabad',
    component: CoworkingCityComponent,
  },
  {
    path: 'kochi',
    component: CoworkingCityComponent,
  },
  {
    path: 'jaipur',
    component: CoworkingCityComponent,
  },
  {
    path: 'lucknow',
    component: CoworkingCityComponent,
  },
  {
    path: 'chandigarh',
    component: CoworkingCityComponent,
  },
  {
    path: 'indore',
    component: CoworkingCityComponent,
  },
  {
    path: 'kolkata',
    component: CoworkingCityComponent,
  },
  {
    path: 'goa',
    component: CoworkingCityComponent,
  },
  {
    path: 'coimbatore',
    component: CoworkingCityComponent,
  },
  {
    path: 'dehradun',
    component: CoworkingCityComponent,
  },
  {
    path: 'bhubaneswar',
    component: CoworkingCityComponent,
  },
  {
    path: 'patna',
    component: CoworkingCityComponent,
  },
  {
    path: 'trivandrum',
    component: CoworkingCityComponent,
  },
  {
    path: 'tiruchirappalli',
    component: CoworkingCityComponent,
  },
  {
    path: 'guwahati',
    component: CoworkingCityComponent,
  },
  {
    path: 'surat',
    component: CoworkingCityComponent,
  },
  {
    path: 'kanpur',
    component: CoworkingCityComponent,
  },
  {
    path: 'vadodara',
    component: CoworkingCityComponent,
  },
  {
    path: 'dehradun',
    component: CoworkingCityComponent,
  },
  {
    path: 'ghaziabad',
    component: CoworkingCityComponent,
  },
  {
    path: 'patna',
    component: CoworkingCityComponent,
  },
  {
    path: 'kottayam',
    component: CoworkingCityComponent,
  },
  {
    path: 'jammu',
    component: CoworkingCityComponent,
  },
  {
    path: 'ludhiana',
    component: CoworkingCityComponent,
  },
  {
    path: 'faridabad',
    component: CoworkingCityComponent,
  },
  {
    path: 'rajkot',
    component: CoworkingCityComponent,
  },
  {
    path: 'dharamshala',
    component: CoworkingCityComponent,
  },
  {
    path: 'tirunelveli',
    component: CoworkingCityComponent,
  },
  {
    path: 'kozhikode',
    component: CoworkingCityComponent,
  },
  {
    path: 'ranchi',
    component: CoworkingCityComponent,
  },
  {
    path: 'faizabad',
    component: CoworkingCityComponent,
  },
  {
    path: 'raipur',
    component: CoworkingCityComponent,
  },
  {
    path: 'ooty',
    component: CoworkingCityComponent,
  },
  {
    path: 'delhi/:locality',
    component: CoworkingLocalityComponent,
  },
  {
    path: 'faridabad:locality',
    component: CoworkingLocalityComponent,
  },
  {
    path: 'gurugram/:locality',
    component: CoworkingLocalityComponent,
  },
  {
    path: 'noida/:locality',
    component: CoworkingLocalityComponent,
  },
  {
    path: 'bangalore/:locality',
    component: CoworkingLocalityComponent,
  },
  {
    path: 'hyderabad/:locality',
    component: CoworkingLocalityComponent,
  },
  {
    path: 'pune/:locality',
    component: CoworkingLocalityComponent,
  },
  {
    path: 'mumbai/:locality',
    component: CoworkingLocalityComponent,
  },
  {
    path: 'chennai/:locality',
    component: CoworkingLocalityComponent,
  },
  {
    path: 'ahmedabad/:locality',
    component: CoworkingLocalityComponent,
  },
  {
    path: 'kochi/:locality',
    component: CoworkingLocalityComponent,
  },
  {
    path: 'jaipur/:locality',
    component: CoworkingLocalityComponent,
  },
  {
    path: 'lucknow/:locality',
    component: CoworkingLocalityComponent,
  },
  {
    path: 'chandigarh/:locality',
    component: CoworkingLocalityComponent,
  },
  {
    path: 'indore/:locality',
    component: CoworkingLocalityComponent,
  },
  {
    path: 'kolkata/:locality',
    component: CoworkingLocalityComponent,
  },
  {
    path: 'goa/:locality',
    component: CoworkingLocalityComponent,
  },
  {
    path: 'coimbatore/:locality',
    component: CoworkingLocalityComponent,
  },
  {
    path: 'dehradun/:locality',
    component: CoworkingLocalityComponent,
  },
  {
    path: 'bhubaneswar/:locality',
    component: CoworkingLocalityComponent,
  },
  {
    path: 'patna/:locality',
    component: CoworkingLocalityComponent,
  },
  {
    path: '24-hour-open',
    component: CoworkingOpenAllDayComponent,
  },
  {
    path: 'sunday-open',
    component: CoworkingSundayOpenComponent,
  },
  {
    path: 'near-metro',
    component: CoworkingNearMetroComponent,
  },
  {
    path: ':id',
    loadChildren: () => import('./../workspace/workspace.module').then(m => m.WorkSpaceModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoworkingRoutingModule {}
