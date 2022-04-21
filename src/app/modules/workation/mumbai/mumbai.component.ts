import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoSteps_Center_Details } from '@app/core/config/gostep-center-details';
import { SeoService } from '@app/core/services/seo.service';

@Component({
  selector: 'app-mumbai',
  templateUrl: './mumbai.component.html',
  styleUrls: ['./mumbai.component.scss']
})
export class MumbaiComponent implements OnInit {

  constructor(private seoService: SeoService,
    private router: Router) { }

  ngOnInit() {
    this.seoService.setData(this.seoData)
  }
  centerData = GoSteps_Center_Details[7];
  seoData = this.centerData.seo

  contactRedirect() {
    this.router.navigate(["/contact-us"])
  }
}
