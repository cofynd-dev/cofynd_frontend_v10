import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoworkingBrandRoutingModule } from './coworking-brand-routing.module';
import { CoworkingBrandComponent } from './coworking-brand/coworking-brand.component';
import { CoworkingBrandDetailComponent } from './coworking-brand-detail/coworking-brand-detail.component';
import { SharedModule } from '@app/shared/shared.module';
import { CoLivingModule } from '../co-living/co-living.module';


@NgModule({
  declarations: [CoworkingBrandComponent, CoworkingBrandDetailComponent],
  imports: [
    CommonModule,
    CoworkingBrandRoutingModule,
    SharedModule,
    CoLivingModule
  ]
})
export class CoworkingBrandModule { }
