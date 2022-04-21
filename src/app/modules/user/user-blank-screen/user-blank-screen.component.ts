import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-blank-screen',
  templateUrl: './user-blank-screen.component.html',
  styleUrls: ['./user-blank-screen.component.scss'],
})
export class UserBlankScreenComponent {
  @Input() title: string;
  @Input() type: string;

  ICON_TYPE = {
    payment: '/assets/images/blank/no-payment.png',
    favorite: '/assets/images/blank/no-favourite.png',
    booking: '/assets/images/blank/no-booking.png',
    visit: '/assets/images/blank/no-visit.png',
  };
}
