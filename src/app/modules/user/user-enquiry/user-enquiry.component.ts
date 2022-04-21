import { Component, OnInit } from '@angular/core';
import { UserEnquiry } from '@core/models/enquiry.model';
import { WorkSpacePlanType } from '@core/models/workspace.model';
import { UserService } from '@core/services/user.service';

@Component({
  selector: 'app-user-enquiry',
  templateUrl: './user-enquiry.component.html',
  styleUrls: ['./user-enquiry.component.scss'],
})
export class UserEnquiryComponent implements OnInit {
  enquires: UserEnquiry[];
  loading: boolean;
  planCategory = WorkSpacePlanType;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.loading = true;
    this.userService.getEnquires().subscribe(allEnquires => {
      this.loading = false;
      this.enquires = allEnquires;
    });
  }
}
