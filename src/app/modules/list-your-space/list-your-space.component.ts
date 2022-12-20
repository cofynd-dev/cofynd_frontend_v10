import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { Component, OnInit } from '@angular/core';
import { SeoService } from '@core/services/seo.service';
import { AccordionConfig } from 'ngx-bootstrap/accordion';

export function getAccordionConfig(): AccordionConfig {
  return Object.assign(new AccordionConfig(), { closeOthers: true });
}

@Component({
  selector: 'app-list-your-space',
  templateUrl: './list-your-space.component.html',
  styleUrls: ['./list-your-space.component.scss'],
  providers: [{ provide: AccordionConfig, useFactory: getAccordionConfig }],
})
export class ListYourSpaceComponent implements OnInit {
  constructor(private seoService: SeoService, private router: Router) {
    this.addSeoTags();
  }

  ngOnInit() { }

  addSeoTags() {
    const metaInfo = {
      title: 'List your Office Space with CoFynd for Free ',
      image: 'https://cofynd.com/assets/images/meta/cofynd-facebook.jpg',
      description:
        // tslint:disable-next-line: max-line-length
        'List your Office Space for Rent with CoFynd and get quality tenants. Advertise your space to thousands of businesses every month for free.',
      url: environment.appUrl + this.router.url,
      type: 'website',
      keywords: 'List your Space, List your Office Space, List your Office Space for Rent, List your event space',
    };
    this.seoService.setData(metaInfo);
  }

}