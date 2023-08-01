import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DEFAULT_APP_DATA } from '@core/config/app-data';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  contactInfo = DEFAULT_APP_DATA.contact;
  socialLinks = DEFAULT_APP_DATA.socialLinks;
  // footerLinks = DEFAULT_APP_DATA.footerLinks;
  coworkingLinks = DEFAULT_APP_DATA.footerCoworkingLinks;
  colivingLinks = DEFAULT_APP_DATA.footerColivingLinks;
  officeLinks = DEFAULT_APP_DATA.footerOfficeLinks;
  countryId: any;
  pageUrl: string;

  constructor(private router: Router) {
    this.pageUrl = this.router.url;
    if (this.pageUrl.indexOf("/singapore") !== -1) {
      localStorage.setItem('country_name', 'Singapore')
      localStorage.setItem('country_id', '6232b86b2a52af3ddaa74e12')
    } else {
      localStorage.setItem('country_name', 'india')
      localStorage.setItem('country_id', '6231ae062a52af3ddaa73a39')
    }
    if (localStorage.getItem('country_id')) {
      this.countryId = localStorage.getItem('country_id');
    }
  }

  ngOnInit() {
  }

  routeOnPage(page) {
    this.router.navigate([`/${page}`]);
  }
}
