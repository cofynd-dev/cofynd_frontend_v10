import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AVAILABLE_CITY } from '@core/config/cities';
import { City } from '@core/models/city.model';
import { SeoService } from '@core/services/seo.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CitySelectorModalComponent } from './../city-selector-modal/city-selector-modal.component';

interface PopularSpace {
  name: string;
  address: string;
  image: string;
  id: string;
  slug?: string;
}
@Component({
  selector: 'app-coworking-landing',
  templateUrl: './coworking-home.component.html',
  styleUrls: ['./coworking-home.component.scss'],
})
export class CoworkingHomeComponent implements OnInit, AfterViewInit {
  cities: City[];
  modalRef: BsModalRef;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private bsModalService: BsModalService,
    private seoService: SeoService,
  ) {
    this.cities = AVAILABLE_CITY.filter(city => city.for_coWorking === true);
  }

  ngOnInit(): void {
    this.seoService.addNoFollowTag();
  }

  openWorkSpace(slug: string) {
    this.router.navigate([`/coworking/${slug.toLowerCase().trim()}`]);
  }

  openCityListing(city: City) {
    this.router.navigate([`/coworking/${city.name.toLowerCase().trim()}`]);
  }

  openCoLivingSpace(slug: string) {
    this.router.navigate([`/co-living/${slug.toLowerCase().trim()}`]);
  }

  openCitySelectorModal() {
    this.modalRef = this.bsModalService.show(CitySelectorModalComponent, {
      class: 'modal-dialog-centered',
    });
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.seoService.removeNoFollowTag();
  }
}
