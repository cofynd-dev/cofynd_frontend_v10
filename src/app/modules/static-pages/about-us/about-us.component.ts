import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SeoService } from '@core/services/seo.service';
import { environment } from '@env/environment.uat';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
})
export class AboutUsComponent implements OnInit {
  constructor(private seoService: SeoService, private router: Router) {}

  ngOnInit() {
    this.addSeoTags();
  }

  addSeoTags() {
    this.seoService.getMeta('about-us').subscribe(seoMeta => {
      if (seoMeta) {
        const seoData = {
          title: seoMeta.title,
          image: 'https://cofynd.com/assets/images/meta/cofynd-facebook.jpg',
          description: seoMeta.description,
          url: environment.appUrl + this.router.url,
          type: 'website',
        };
        this.seoService.setData(seoData);
      }
    });
  }
}
