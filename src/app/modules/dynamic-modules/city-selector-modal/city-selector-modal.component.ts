import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-city-selector-modal',
  templateUrl: './city-selector-modal.component.html',
  styleUrls: ['./city-selector-modal.component.scss'],
})
export class CitySelectorModalComponent {
  constructor(private bsRef: BsModalRef) {}

  closeModal() {
    this.bsRef.hide();
  }
}
