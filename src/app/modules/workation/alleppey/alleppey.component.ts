import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoSteps_Center_Details } from '@app/core/config/gostep-center-details';
import { SeoService } from '@app/core/services/seo.service';

@Component({
  selector: 'app-alleppey',
  templateUrl: './alleppey.component.html',
  styleUrls: ['./alleppey.component.scss']
})
export class AlleppeyComponent implements OnInit {

  constructor(private seoService: SeoService,
    private router: Router) { }

  ngOnInit() {
    this.seoService.setData(this.seoData)
  }
  centerData = GoSteps_Center_Details[10];
  seoData = this.centerData.seo

  contactRedirect() {
    this.router.navigate(["/contact-us"])
  }

}
