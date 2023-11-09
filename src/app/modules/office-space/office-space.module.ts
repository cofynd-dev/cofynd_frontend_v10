import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { OfficeCardComponent } from './office-card/office-card.component';
import { OfficeSpaceCityComponent } from './office-space-city/office-space-city.component';
import { OfficeSpaceLocalityComponent } from './office-space-locality/office-space-locality.component';
import { OfficeSpaceRoutingModule } from './office-space-routing.module';
import { OfficeSpaceComponent } from './office-space.component';
import { OfficeSpaceModalComponent } from './office-space-modal/office-space-modal.component';

@NgModule({
  declarations: [
    OfficeSpaceCityComponent,
    OfficeSpaceComponent,
    OfficeCardComponent,
    OfficeSpaceLocalityComponent,
    OfficeSpaceModalComponent,
  ],
  imports: [CommonModule, SharedModule, OfficeSpaceRoutingModule],
  entryComponents: [OfficeSpaceModalComponent],
  exports: [OfficeSpaceModalComponent],
})
export class OfficeSpaceModule { }
