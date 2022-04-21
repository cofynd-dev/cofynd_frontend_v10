import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ContactUsRoutingModule } from './contact-us-routing.module';
import { ContactUsComponent } from './contact-us.component';

@NgModule({
  declarations: [ContactUsComponent],
  imports: [CommonModule, ContactUsRoutingModule, SharedModule],
})
export class ContactUsModule {}
