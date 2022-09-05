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
  ],
  entryComponents: [CitySelectorModalComponent],
  imports: [CommonModule, SharedModule, CoworkingRoutingModule, HomeModule],
})
export class CoworkingModule { }
