import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingFormComponent } from './booking-form/booking-form.component';
import { BookingComponent } from './booking.component';
const routes: Routes = [
  {
    path: '',
    component: BookingComponent,
    children: [
      {
        path: '',
        component: BookingFormComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookingRoutingModule {}
