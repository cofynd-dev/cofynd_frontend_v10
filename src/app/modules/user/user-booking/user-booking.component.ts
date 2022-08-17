import { Component, OnInit } from '@angular/core';
import { UserBooking } from '@core/models/booking.model';
import { WorkSpacePlanType } from '@core/models/workspace.model';
import { UserService } from '@core/services/user.service';

@Component({
  selector: 'app-user-booking',
  templateUrl: './user-booking.component.html',
  styleUrls: ['./user-booking.component.scss'],
})
export class UserBookingComponent implements OnInit {
  bookings: UserBooking[];
  loading: boolean;
  planCategory = WorkSpacePlanType;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.loading = true;
    this.userService.getBookings().subscribe(allBookings => {
      this.loading = false;
      this.bookings = allBookings;
    });
  }
}
