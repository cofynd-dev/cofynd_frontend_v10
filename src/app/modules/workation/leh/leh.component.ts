import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoSteps_Center_Details } from '@app/core/config/gostep-center-details';
import { SeoService } from '@app/core/services/seo.service';

@Component({
  selector: 'app-leh',
  templateUrl: './leh.component.html',
  styleUrls: ['./leh.component.scss'],
})
export class LehComponent implements OnInit {
  constructor(private seoService: SeoService, private router: Router) {}

  ngOnInit() {
    this.seoService.setData(this.seoData);
  }
  centerData = GoSteps_Center_Details[14];
  seoData = this.centerData.seo;

  contactRedirect() {
    this.router.navigate(['/contact-us']);
  }
}
