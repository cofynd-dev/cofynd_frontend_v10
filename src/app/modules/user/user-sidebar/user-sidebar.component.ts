import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-user-sidebar',
  templateUrl: './user-sidebar.component.html',
  styleUrls: ['./user-sidebar.component.scss'],
})
export class UserSidebarComponent implements OnInit {
  menuItems: MenuItem[];

  constructor(private authService: AuthService) {
    this.menuItems = this.getUserMenu();
  }

  ngOnInit() {}

  getUserName() {
    return this.authService.getLoggedInUser() ? this.authService.getLoggedInUser().name.substring(0, 1) : 'C';
  }

  getName() {
    return this.authService.getLoggedInUser() ? this.authService.getLoggedInUser().name : '';
  }

  getUserMenu(): MenuItem[] {
    return [
      {
        title: 'Account Details',
        url: 'account',
        icon: 'account',
      },
      {
        title: 'Bookings',
        url: 'bookings',
        icon: 'booking',
      },
      {
        title: 'Schedule Visits',
        url: 'schedule-visits',
        icon: 'visit',
      },
      {
        title: 'Favourites',
        url: 'favourites',
        icon: 'favourite',
      },
      {
        title: 'Payments',
        url: 'payments',
        icon: 'payment',
      },
    ];
  }
}

interface MenuItem {
  title: string;
  url: string;
  icon?: string;
}
