import { Component, OnDestroy } from '@angular/core';
import { SeoSocialShareData } from '@core/models/seo.model';
import { SeoService } from '@core/services/seo.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnDestroy {
  constructor(private seoService: SeoService) {}

  addSeoTags() {
    const seoData: SeoSocialShareData = {
      title: 'User - CoFynd',
      image: 'https://cofynd.com/assets/images/meta/cofynd-facebook.jpg',
      description:
        // tslint:disable-next-line: max-line-length
        'CoFynd: Find the Right Workspace in Delhi, Noida, Gurugram . Get in touch with us to enquire a co working space.',
      url: '',
      type: 'website',
    };

    this.seoService.setData(seoData);
    this.seoService.addNoFollowTag();
  }

  ngOnDestroy() {
    this.seoService.removeNoFollowTag();
  }
}
