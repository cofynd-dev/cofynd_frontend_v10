import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-home-city-popup',
  templateUrl: './home-city-popup.component.html',
  styleUrls: ['./home-city-popup.component.scss'],
})
export class HomeCityPopupComponent implements OnInit {
  constructor(private bsModalRef: BsModalRef, private router: Router) {
  }

  city: string;
  country: string;

  ngOnInit() {}

  closeModal() {
    this.router.navigate([
      `${this.country.toLocaleLowerCase().trim()}/coworking/${this.city.toLocaleLowerCase().trim()}`,
    ]);
    this.bsModalRef.hide();
  }
  closeModal1() {
    this.router.navigate([
      `${this.country.toLocaleLowerCase().trim()}/co-living/${this.city.toLocaleLowerCase().trim()}`,
    ]);
    this.bsModalRef.hide();
  }
}
