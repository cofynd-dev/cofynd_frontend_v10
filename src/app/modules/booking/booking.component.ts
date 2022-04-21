import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SeoSocialShareData } from '@core/models/seo.model';
import { SeoService } from '@core/services/seo.service';
import { WindowRef } from '@core/services/window-ref.service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
  providers: [WindowRef],
})
export class BookingComponent implements OnDestroy {
  constructor(private seoService: SeoService, private router: Router) {
    this.addSeoTags();
  }

  addSeoTags() {
    const seoData: SeoSocialShareData = {
      title: 'Booking - CoFynd',
      image: 'https://cofynd.com/assets/images/meta/cofynd-facebook.jpg',
      description:
        // tslint:disable-next-line: max-line-length
        'CoFynd: Find the Right Workspace in Delhi, Noida, Gurugram . Get in touch with us to enquire a co working space.',
      url: environment.appUrl + this.router.url,
      type: 'website',
    };

    this.seoService.setData(seoData);
    this.seoService.addNoFollowTag();
  }

  ngOnDestroy() {
    this.seoService.removeNoFollowTag();
  }
}
