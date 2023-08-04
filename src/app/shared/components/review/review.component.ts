import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnInit, Renderer2 } from '@angular/core';
import { AuthType } from '@app/core/enum/auth-type.enum';
import { User } from '@app/core/models/user.model';
import { WorkSpace } from '@app/core/models/workspace.model';
import { AuthService } from '@app/core/services/auth.service';
import { WorkSpaceService } from '@app/core/services/workspace.service';
import { sanitizeParams } from '@app/shared/utils';
import { Review } from '../../../core/models/review.model';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
})
export class ReviewComponent implements OnInit {
  @Input() space: WorkSpace;
  @Input() averageRating: number;
  reviews: Review[] = [];
  show: boolean = false;
  @Input() userReview: Review;
  userDetail: User;

  constructor(
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document,
    private readonly authService: AuthService,
    private readonly workSpaceService: WorkSpaceService,
  ) {}

  ngOnInit() {
    this.getReviewsBySpace({});
    this.getUserDetail();
  }

  getReviewsBySpace(param) {
    this.workSpaceService.getReviewsBySpace(this.space.id, sanitizeParams(param)).subscribe(res => {
      this.reviews = res;
      if (this.averageRating && this.reviews.length) {
        this.setScript();
      }
    });
  }

  setScript() {
    let script = this._renderer2.createElement('script');
    script.type = `application/ld+json`;
    script.text = `{
              "@context": "https://schema.org",
              "@type": "AggregateRating",
              "itemReviewed": {
                "@type": "LocalBusiness",
                "name": "${this.space.seo.title ? this.space.seo.title : 'CoFynd - ' + this.space.name}",
                "description": "${this.space.seo.description ? this.space.seo.description : this.space.description}",
                "image": "${this.space.images[0].image.s3_link}"
              },
              "ratingValue": "${this.averageRating}",
              "bestRating": "5",
              "reviewCount": "${this.reviews.length}"
          }`;
    this._renderer2.appendChild(this._document.body, script);
  }

  isAuthenticated() {
    return this.authService.getToken() ? true : false;
  }

  getUserDetail() {
    if (this.isAuthenticated()) {
      this.userDetail = this.authService.getLoggedInUser();
    }
  }

  getUserName(name) {
    return name && name.substring(0, 1);
  }

  openModal(review = null) {
    let dialogType = AuthType.LOGIN;
    if (this.isAuthenticated()) {
      dialogType = AuthType.REVIEW;
    }
    const param = Object.assign({
      space: this.space,
      review: review ? JSON.parse(JSON.stringify(review)) : new Review(),
      authType: dialogType,
      shouldOpenReviewModal: dialogType === AuthType.LOGIN,
    });
    this.authService.openReviewDialog(param);
  }

  toggleCommentDiv(review: Review) {
    review.shouldReadMore = !review.shouldReadMore;
  }
}
