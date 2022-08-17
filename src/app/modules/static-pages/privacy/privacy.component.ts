import { Component } from '@angular/core';
import { SeoSocialShareData } from '@core/models/seo.model';
import { environment } from '@env/environment';
import { SeoService } from '@core/services/seo.service';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss'],
})
export class PrivacyComponent {
  constructor(private seoService: SeoService) {
    this.addSeoTags();
  }

  addSeoTags() {
    const seoData: SeoSocialShareData = {
      title: 'Privacy Policy - CoFynd',
      image: 'https://cofynd.com/assets/images/meta/cofynd-facebook.jpg',
      description:
        // tslint:disable-next-line: max-line-length
        'CoFynd: Find the Right Workspace in Delhi, Noida, Gurugram . Get in touch with us to enquire a co working space.',
      url: environment.appUrl + '/privacy-policy',
      type: 'website',
    };
    this.seoService.setData(seoData);
  }
}
