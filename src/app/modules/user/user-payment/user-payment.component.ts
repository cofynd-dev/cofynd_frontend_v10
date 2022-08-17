import { Component, OnInit } from '@angular/core';
import { WorkSpacePlanType } from '@core/models/workspace.model';
import { UserService } from '@core/services/user.service';
import { PaymentDetail } from '@core/models/booking.model';
@Component({
  selector: 'app-user-payment',
  templateUrl: './user-payment.component.html',
  styleUrls: ['./user-payment.component.scss'],
})
export class UserPaymentComponent implements OnInit {
  payments: PaymentDetail[];
  loading: boolean;
  planCategory = WorkSpacePlanType;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.loading = true;
    this.userService.getPayments().subscribe(allPayments => {
      this.loading = false;
      this.payments = allPayments;
    });
  }
}
