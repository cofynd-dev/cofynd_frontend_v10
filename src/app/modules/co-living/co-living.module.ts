import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { CoLivingRoutingModule } from './co-living-routing.module';
import { CoLivingComponent } from './co-living.component';
import { CoLivingCityComponent } from './co-living-city/co-living-city.component';
import { CoLivingCardComponent } from './co-living-card/co-living-card.component';
import { CoLivingDetailComponent } from './co-living-detail/co-living-detail.component';
import { CoLivingSimilarComponent } from './co-living-similar/co-living-similar.component';
import { CoLivingLocalityComponent } from './co-living-locality/co-living-locality.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    CoLivingComponent,
    CoLivingCityComponent,
    CoLivingCardComponent,
    CoLivingDetailComponent,
    CoLivingSimilarComponent,
    CoLivingLocalityComponent,
  ],
  imports: [CommonModule, CoLivingRoutingModule, SharedModule, LeafletModule, NgbModule],
  exports: [CoLivingCardComponent],
})
export class CoLivingModule { }
