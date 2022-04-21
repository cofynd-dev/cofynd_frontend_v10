import { Component, OnInit } from '@angular/core';
import { GoStops_Centers } from '@app/core/config/goStops-centers';
import { SeoService } from '@app/core/services/seo.service';

@Component({
  selector: 'app-brand-gosteps',
  templateUrl: './brand-gosteps.component.html',
  styleUrls: ['./brand-gosteps.component.scss']
})
export class BrandGostepsComponent implements OnInit {
  isMapView: boolean = false
  title: string = "goStops";

  constructor(private seoService: SeoService,) { }

  ngOnInit() {
    this.seoService.setData(this.seoData)
  }

  seoData = {
    description: "goStops",
    title: "goSTOPS",
  }

  breadcrumbs = [
    {
      title: "Brand",
      isActive: false,
      url: "/"
    },
    {
      title: "goStops",
      isActive: true,
      url: "barnd"
    }
  ]

  workSpaces = GoStops_Centers
}
