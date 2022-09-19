import { Component, OnInit } from '@angular/core';
import { SeoService } from '@core/services/seo.service';
import { GoSteps_Center_Details } from '@app/core/config/gostep-center-details';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bir',
  templateUrl: './bir.component.html',
  styleUrls: ['./bir.component.scss'],
})
export class BirComponent implements OnInit {
  constructor(private seoService: SeoService, private router: Router) {}

  ngOnInit() {
    this.seoService.setData(this.seoData);
  }
  centerData = GoSteps_Center_Details[0];
  seoData = this.centerData.seo;

  contactRedirect() {
    this.router.navigate(['/contact-us']);
  }
}
