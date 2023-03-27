import { isPlatformBrowser } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { environment } from '@env/environment';
import { AuthService } from '@app/core/services/auth.service';
import { WorkSpaceService } from '@app/core/services/workspace.service';
import { Review } from '@app/core/models/review.model';
import { Router } from '@angular/router';
import { WorkSpace } from '@app/core/models/workspace.model';
import { ToastrService } from 'ngx-toastr';
declare let ga: any;

@Component({
  selector: 'app-review-submission-form',
  templateUrl: './review-submission-form.component.html',
  styleUrls: ['./review-submission-form.component.scss'],
})
export class ReviewSubmissionFormComponent implements OnInit {
  @Input() review: Review = new Review();
  @Output() onClose = new EventEmitter<any>();
  @Input() space: WorkSpace;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private router: Router,
    public toasterService: ToastrService,
    private readonly authService: AuthService,
    private readonly workSpaceService: WorkSpaceService,
  ) {}

  ngOnInit() {
    this.getLoggedInUser();
  }

  getLoggedInUser() {
    this.review.user = this.authService.getLoggedInUser();
  }

  closeReviewPopup() {
    this.onClose.emit(true);
  }

  update(event) {}

  authAddReview() {
    const request = this.workSpaceService.checkReviewSpace(this.router.url, this.review, this.space.id);
    this.workSpaceService.saveReview(request).subscribe(res => {
      this.workSpaceService.setProfileReviewByUser(res);
      this.toasterService.success('Thanks! Review will be posted after Admin Approval');
      this.closeReviewPopup();
    });
  }

  sendGaEvent(category: string, action: string, label: string) {
    if (environment.options.GA_ENABLED && isPlatformBrowser(this.platformId)) {
      ga('send', 'event', category, action, label);
    }
  }

  getUserName(name) {
    return name && name.substring(0, 1);
  }
}
