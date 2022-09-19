import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VirtualOfficeRoutingModule } from './virtual-office-routing.module';
import { VirtualOfficeComponent } from './virtual-office.component';
import { SharedModule } from '@app/shared/shared.module';
import { VirtualOfficeCityComponent } from './virtual-office-city/virtual-office-city.component';
import { VirtualOfficeModalComponent } from './virtual-office-modal/virtual-office-modal.component';

@NgModule({
  declarations: [VirtualOfficeComponent, VirtualOfficeCityComponent, VirtualOfficeModalComponent],
  imports: [CommonModule, VirtualOfficeRoutingModule, SharedModule],
  entryComponents: [VirtualOfficeModalComponent],
})
export class VirtualOfficeModule {}
