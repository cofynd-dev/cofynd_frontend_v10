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
import { LocationIqImportComponent } from './location-iq-import/location-iq-import.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { FlatSpaceCardComponent } from './flat-space/flat-space-card/flat-space-card.component';
import { FlatSpaceCityComponent } from './flat-space/flat-space-city/flat-space-city.component';
import { FlatSpaceDetailComponent } from './flat-space/flat-space-detail/flat-space-detail.component';
import { FlatSpaceLocalityComponent } from './flat-space/flat-space-locality/flat-space-locality.component';
import { FlatSpaceSimilarComponent } from './flat-space/flat-space-similar/flat-space-similar.component';
import { FlatSpaceComponent } from './flat-space/flat-space.component';
import { BuilderComponent } from './builder/builder/builder.component';
import { BuilderDetailComponent } from './builder/builder-detail/builder-detail.component';
import { ResidentialBuilderComponent } from './builder/residential-builder/residential-builder.component';
import { CommercialBuilderComponent } from './builder/commercial-builder/commercial-builder.component';
import { SubBuilderDetailComponent } from './builder/sub-builder-detail/sub-builder-detail.component';
import { SubBuilderSaleComponent } from './builder/sub-builder-sale/sub-builder-sale.component';
import { SubBuilderRentComponent } from './builder/sub-builder-rent/sub-builder-rent.component';
import { BuilderResiComCardComponent } from './builder/builder-resi-com-card/builder-resi-com-card.component';
import { BuiderCityComponent } from './builder/buider-city/buider-city.component';

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
    HomeCityPopupComponent,
    LocationIqImportComponent,
    FlatSpaceCardComponent,
    FlatSpaceCityComponent,
    FlatSpaceDetailComponent,
    FlatSpaceLocalityComponent,
    FlatSpaceSimilarComponent,
    FlatSpaceComponent,
    BuilderComponent,
    BuilderDetailComponent,
    ResidentialBuilderComponent,
    CommercialBuilderComponent,
    SubBuilderDetailComponent,
    SubBuilderSaleComponent,
    SubBuilderRentComponent,
    BuilderResiComCardComponent,
    BuiderCityComponent,
  ],
  entryComponents: [HomeCitiesComponent, CitySelectorModalComponent, HomeCityPopupComponent],
  imports: [CommonModule, SharedModule, CoworkingRoutingModule, LeafletModule],
})
export class CoworkingModule { }
