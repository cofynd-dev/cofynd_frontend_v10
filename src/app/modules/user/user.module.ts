import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { UserBlankScreenComponent } from './user-blank-screen/user-blank-screen.component';
import { UserBookingComponent } from './user-booking/user-booking.component';
import { UserFavoriteComponent } from './user-favorite/user-favorite.component';
import { UserPaymentComponent } from './user-payment/user-payment.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserRoutingModule } from './user-routing.module';
import { UserSidebarComponent } from './user-sidebar/user-sidebar.component';
import { UserComponent } from './user.component';
import { UserListLoaderComponent } from './user-list-loader/user-list-loader.component';
import { UserEnquiryComponent } from './user-enquiry/user-enquiry.component';

@NgModule({
  declarations: [
    UserComponent,
    UserSidebarComponent,
    UserProfileComponent,
    UserFavoriteComponent,
    UserBlankScreenComponent,
    UserBookingComponent,
    UserPaymentComponent,
    UserListLoaderComponent,
    UserEnquiryComponent,
  ],
  imports: [CommonModule, SharedModule, UserRoutingModule],
})
export class UserModule {}
