import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { BookingFormComponent } from './booking-form/booking-form.component';
import { BookingRoutingModule } from './booking-routing.module';
import { BookingComponent } from './booking.component';
import { PaymentLoaderComponent } from './payment-loader/payment-loader.component';

@NgModule({
  declarations: [BookingComponent, PaymentLoaderComponent, BookingFormComponent],
  imports: [CommonModule, BookingRoutingModule, SharedModule],
})
export class BookingModule {}
