import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { CareerRoutingModule } from './career-routing.module';
import { CareerComponent } from './career/career.component';
import { CareerDetailsComponent } from './career-details/career-details.component';


@NgModule({
  declarations: [CareerComponent, CareerDetailsComponent],
  imports: [
    CommonModule,
    CareerRoutingModule, SharedModule
  ]
})
export class CareerModule { }
