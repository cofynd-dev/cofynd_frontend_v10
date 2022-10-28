import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { EnterpriseComponent } from './enterprise.component';
import { EnterpriseRoutingModule } from './enterprise.routing.module';

@NgModule({
  declarations: [EnterpriseComponent],
  imports: [CommonModule, EnterpriseRoutingModule, SharedModule],
})
export class EnterpriseModule {}
