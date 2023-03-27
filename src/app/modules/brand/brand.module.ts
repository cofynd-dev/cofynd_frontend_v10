import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { CoLivingModule } from '../co-living/co-living.module';
import { BrandCoworkingComponent } from './brand-coworking/brand-coworking.component';
import { BrandRoutingModule } from './brand-routing.module';
import { BrandTitleComponent } from './brand-title/brand-title.component';
import { BrandComponent } from './brand.component';
import { BrandGostepsComponent } from './brand-gosteps/brand-gosteps.component';
import { GostepsCardComponent } from './brand-gosteps/gosteps-card/gosteps-card.component';
@NgModule({
  declarations: [
    BrandComponent,
    BrandTitleComponent,
    BrandCoworkingComponent,
    BrandGostepsComponent,
    GostepsCardComponent,
  ],
  imports: [CommonModule, SharedModule, BrandRoutingModule, CoLivingModule],
})
export class BrandModule { }
