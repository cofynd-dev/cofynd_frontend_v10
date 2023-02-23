import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoworkingBrandRoutingModule } from './coworking-brand-routing.module';
import { CoworkingBrandComponent } from './coworking-brand/coworking-brand.component';
import { CoworkingBrandDetailComponent } from './coworking-brand-detail/coworking-brand-detail.component';
import { SharedModule } from '@app/shared/shared.module';
import { CoLivingModule } from '../co-living/co-living.module';
import { CoworkingBrandTitleComponent } from './coworking-brand-title/coworking-brand-title.component';


@NgModule({
  declarations: [CoworkingBrandComponent, CoworkingBrandDetailComponent, CoworkingBrandTitleComponent],
  imports: [
    CommonModule,
    CoworkingBrandRoutingModule,
    SharedModule,
    CoLivingModule
  ]
})
export class CoworkingBrandModule { }
