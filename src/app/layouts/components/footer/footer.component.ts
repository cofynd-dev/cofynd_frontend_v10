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
  footerLinks = DEFAULT_APP_DATA.footerLinks;
  coworkingLinks = DEFAULT_APP_DATA.footerCoworkingLinks;
  colivingLinks = DEFAULT_APP_DATA.footerColivingLinks;
  officeLinks = DEFAULT_APP_DATA.footerOfficeLinks;

  constructor(private router: Router) { }

  ngOnInit() { }

  routeOnPage(page) {
    this.router.navigate([`/${page}`]);
  }
}
