import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoworkingCityComponent } from './coworking-city/coworking-city.component';
import { CoworkingHomeComponent } from './coworking-home/coworking-home.component';
import { CoworkingLocalityComponent } from './coworking-locality/coworking-locality.component';
import { CoworkingNearMetroComponent } from './coworking-near-metro/coworking-near-metro.component';
import { CoworkingOpenAllDayComponent } from './coworking-open-all-day/coworking-open-all-day.component';
import { CoworkingSundayOpenComponent } from './coworking-sunday-open/coworking-sunday-open.component';
import { CoworkingComponent } from '../dynamic-modules/coworking.component';
import { CountryVerticalPageComponent } from './country-vertical-page/country-vertical-page.component';
import { CoLivingCityComponent } from './co-living-city/co-living-city.component';
import { CoLivingLocalityComponent } from './co-living-locality/co-living-locality.component';
import { CoLivingDetailComponent } from './co-living-detail/co-living-detail.component';
import { CountryColivingVerticalPageComponent } from './country-coliving-vertical-page/country-coliving-vertical-page.component';
import { LocationIqImportComponent } from './location-iq-import/location-iq-import.component';
import { FlatSpaceComponent } from './flat-space/flat-space.component';
import { FlatSpaceCityComponent } from './flat-space/flat-space-city/flat-space-city.component';
import { FlatSpaceLocalityComponent } from './flat-space/flat-space-locality/flat-space-locality.component';
import { FlatSpaceDetailComponent } from './flat-space/flat-space-detail/flat-space-detail.component';
import { BuilderComponent } from './builder/builder/builder.component';
import { BuilderDetailComponent } from './builder/builder-detail/builder-detail.component';
import { ResidentialBuilderComponent } from './builder/residential-builder/residential-builder.component';
import { CommercialBuilderComponent } from './builder/commercial-builder/commercial-builder.component';
import { SubBuilderDetailComponent } from './builder/sub-builder-detail/sub-builder-detail.component';
import { SubBuilderRentComponent } from './builder/sub-builder-rent/sub-builder-rent.component';
import { SubBuilderSaleComponent } from './builder/sub-builder-sale/sub-builder-sale.component';
import { BuiderCityComponent } from './builder/buider-city/buider-city.component';


const routes: Routes = [
  { path: '', component: CoworkingComponent },
  { path: 'home', component: CoworkingHomeComponent },
  {
    path: 'locationIqMap',
    component: LocationIqImportComponent,
  },
  {
    path: 'coworking',
    component: CountryVerticalPageComponent,
  },
  {
    path: 'co-living',
    component: CountryColivingVerticalPageComponent,
  },
  {
    path: 'coworking/:city',
    component: CoworkingCityComponent,
  },
  {
    path: 'coworking/:city/:microlocation',
    component: CoworkingLocalityComponent,
  },
  {
    path: 'co-living/:city',
    component: CoLivingCityComponent,
  },
  {
    path: 'co-living/:city/:microlocation',
    component: CoLivingLocalityComponent,
  },
  {
    path: 'flat-space',
    component: FlatSpaceComponent,
  },
  {
    path: 'flat-space/:city',
    component: FlatSpaceCityComponent,
  },
  {
    path: 'flat-space/:city/:microlocation',
    component: FlatSpaceLocalityComponent,
  },
  {
    path: 'flat-space-details/:workspacename',
    component: FlatSpaceDetailComponent,
  },
  {
    path: 'details/:workspacename',
    loadChildren: () => import('./../workspace/workspace.module').then(m => m.WorkSpaceModule),
  },
  {
    path: 'coworking-details/:workspacename',
    loadChildren: () => import('./../workspace/workspace.module').then(m => m.WorkSpaceModule),
  },
  {
    path: 'co-living-details/:workspacename',
    component: CoLivingDetailComponent,
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
    path: 'builder',
    component: BuilderComponent
  },
  {
    path: 'builder/:buildername',
    component: BuilderDetailComponent
  },
  {
    path: 'builder/city/:city',
    component: BuiderCityComponent
  },
  {
    path: ':buildername/residential',
    component: ResidentialBuilderComponent
  },
  {
    path: ':buildername/commercial',
    component: CommercialBuilderComponent
  },
  {
    path: ':buildername/:subuildername',
    component: SubBuilderDetailComponent
  },
  {
    path: ':buildername/:subuildername/rent',
    component: SubBuilderRentComponent
  },
  {
    path: ':buildername/:subuildername/sale',
    component: SubBuilderSaleComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoworkingRoutingModule { }
