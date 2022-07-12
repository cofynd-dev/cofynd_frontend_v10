import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthType } from '@app/core/enum/auth-type.enum';
import { HelperService } from '@app/core/services/helper.service';
import { Plan, WorkSpacePlan, WorkSpacePlanType } from '@core/models/workspace.model';
import { AuthService } from '@core/services/auth.service';

enum WorkSpacePlanDescription {
  'hot-desk' = 'Choose and work at any desk within the community area.',
  'day-pass' = 'Book and experience the un-conventional work culture.',
  'private-cabin' = 'Private office space dedicated to you and your team.',
  'dedicated-desk' = 'A fixed desk in a shared coworking space.',
  'dedicated-pass' = 'A fixed desk in a shared coworking space.',
  'virtual-office' = 'Build your company presence with virtual office',
}

@Component({
  selector: 'app-workspace-plan',
  templateUrl: './workspace-plan.component.html',
  styleUrls: ['./workspace-plan.component.scss'],
})
export class WorkspacePlanComponent {
  @Input() plans: Plan[];
  @Input() workspaceId: string;
  @Input() currency_code: any;
  @Output() enquireButtonClick: EventEmitter<boolean> = new EventEmitter<boolean>();

  PLAN_TYPE: typeof WorkSpacePlan = WorkSpacePlan;
  planCategory = WorkSpacePlanType;
  workSpacePlanDescription = WorkSpacePlanDescription;

  constructor(private router: Router, private authService: AuthService, private helperService: HelperService) {
    console.log("plans", this.plans);
  }

  onBooking(interestedIn) {
    if (this.authService.getToken()) {
      this.router.navigate(['/booking'], { queryParams: { workspace: this.workspaceId, interestedIn } });
    } else {
      this.authService.setLoginRedirectUrl('booking?workspace=' + this.workspaceId);
      this.authService.openAuthDialog(AuthType.LOGIN);
    }
  }

  onEnquire() {
    this.helperService.notifyEnquiryFormToAnimate();
    this.enquireButtonClick.emit(true);
  }
}
