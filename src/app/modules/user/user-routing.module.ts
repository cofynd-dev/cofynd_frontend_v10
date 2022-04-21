import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserBookingComponent } from './user-booking/user-booking.component';
import { UserEnquiryComponent } from './user-enquiry/user-enquiry.component';
import { UserFavoriteComponent } from './user-favorite/user-favorite.component';
import { UserPaymentComponent } from './user-payment/user-payment.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserComponent } from './user.component';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      {
        path: '',
        redirectTo: 'account',
      },
      {
        path: 'account',
        component: UserProfileComponent,
      },
      {
        path: 'bookings',
        component: UserBookingComponent,
      },
      {
        path: 'schedule-visits',
        component: UserEnquiryComponent,
      },
      {
        path: 'favourites',
        component: UserFavoriteComponent,
      },
      {
        path: 'payments',
        component: UserPaymentComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
