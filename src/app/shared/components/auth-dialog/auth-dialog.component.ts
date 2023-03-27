import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input } from '@angular/core';
import { Review } from '@app/core/models/review.model';
import { AuthType } from '@core/enum/auth-type.enum';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('1', style({ transform: 'translateY(0)' })),
      state('0', style({ transform: 'translateY(50%)' })),
      transition('1 <=> 0', animate('600ms ease-in')),
    ]),
  ],
})
export class AuthDialogComponent {
  AUTH_TYPES = AuthType;
  @Input() authType: AuthType;
  @Input() shouldOpenReviewModal: boolean = false;
  @Input() space: string;
  @Input() review: Review;

  constructor(private modalService: BsModalService, private bsModalRef: BsModalRef) {}

  decline() {
    this.modalService.setDismissReason('false');
    this.bsModalRef.hide();
  }

  accept() {
    this.modalService.setDismissReason('true');
    this.bsModalRef.hide();
  }

  openSignUpForm() {
    this.authType = AuthType.SIGN_UP;
  }

  openLoginForm() {
    this.authType = AuthType.LOGIN;
  }

  openReviewForm() {
    this.authType = AuthType.REVIEW;
  }
}
