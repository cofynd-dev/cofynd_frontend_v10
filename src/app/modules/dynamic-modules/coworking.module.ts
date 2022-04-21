import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { CoworkingCityListComponent } from './coworking-city-list/coworking-city-list.component';
import { CoworkingCityComponent } from './coworking-city/coworking-city.component';
import { CoworkingLocalityComponent } from './coworking-locality/coworking-locality.component';
import { CoworkingRoutingModule } from './coworking-routing.module';
import { CoworkingComponent } from './coworking.component';
import { CoworkingNearMetroComponent } from './coworking-near-metro/coworking-near-metro.component';
import { CoworkingSundayOpenComponent } from './coworking-sunday-open/coworking-sunday-open.component';
import { CoworkingOpenAllDayComponent } from './coworking-open-all-day/coworking-open-all-day.component';
import { CoworkingHomeComponent } from './coworking-home/coworking-home.component';
import { CitySelectorModalComponent } from './city-selector-modal/city-selector-modal.component';
import { HomeModule } from '../home/home.module';
import { CountryVerticalPageComponent } from './country-vertical-page/country-vertical-page.component';
import { CoLivingCardComponent } from './co-living-card/co-living-card.component';
import { CoLivingCityComponent } from './co-living-city/co-living-city.component';
import { CoLivingLocalityComponent } from './co-living-locality/co-living-locality.component';
import { CoLivingSimilarComponent } from './co-living-similar/co-living-similar.component';
import { CoLivingDetailComponent } from './co-living-detail/co-living-detail.component';
import { CountryColivingVerticalPageComponent } from './country-coliving-vertical-page/country-coliving-vertical-page.component';
import { HomeCitiesComponent } from './home-cities/home-cities.component';
import { HomeMenuModalComponent } from './home-menu-modal/home-menu-modal.component';
import { HomeCityPopupComponent } from './home-city-popup/home-city-popup.component';

@NgModule({
  declarations: [
    CoworkingComponent,
    CoworkingCityComponent,
    CoworkingLocalityComponent,
    CoworkingCityListComponent,
    CoworkingNearMetroComponent,
    CoworkingSundayOpenComponent,
    CoworkingOpenAllDayComponent,
    CoworkingHomeComponent,
    CitySelectorModalComponent,
    CountryVerticalPageComponent,
    //register dynamic coliving component
    CoLivingCardComponent,
    CoLivingCityComponent,
    CoLivingLocalityComponent,
    CoLivingSimilarComponent,
    CoLivingDetailComponent,
    CountryColivingVerticalPageComponent,
    HomeCitiesComponent,
    HomeMenuModalComponent,
    HomeCityPopupComponent
  ],
  entryComponents: [HomeCitiesComponent, CitySelectorModalComponent, HomeCityPopupComponent],
  imports: [CommonModule, SharedModule, CoworkingRoutingModule],
})
export class CoworkingModule { }
