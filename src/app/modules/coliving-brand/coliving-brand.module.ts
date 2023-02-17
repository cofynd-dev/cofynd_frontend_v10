import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ColivingBrandRoutingModule } from './coliving-brand-routing.module';
import { ColivingBrandComponent } from './coliving-brand/coliving-brand.component';
import { ColivingBrandDetailComponent } from './coliving-brand-detail/coliving-brand-detail.component';
import { SharedModule } from '@app/shared/shared.module';
import { CoLivingModule } from '../co-living/co-living.module';


@NgModule({
  declarations: [ColivingBrandComponent, ColivingBrandDetailComponent],
  imports: [
    CommonModule,
    ColivingBrandRoutingModule,
    SharedModule,
    CoLivingModule
  ]
})
export class ColivingBrandModule { }
