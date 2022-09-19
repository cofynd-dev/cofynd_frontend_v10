import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-home-city-popup',
  templateUrl: './home-city-popup.component.html',
  styleUrls: ['./home-city-popup.component.scss'],
})
export class HomeCityPopupComponent implements OnInit {
  constructor(private bsModalRef: BsModalRef) {}

  city: string;

  ngOnInit() {}

  closeModal() {
    this.bsModalRef.hide();
  }
}
