import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MumbaiMarketingRoutingModule } from './mumbai-marketing-routing.module';
import { MumbaiMarketingComponent } from './mumbai-marketing.component';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  declarations: [MumbaiMarketingComponent], // Declare the component here
  imports: [CommonModule, SharedModule, MumbaiMarketingRoutingModule],
})
export class MumbaiMarketingModule {}
