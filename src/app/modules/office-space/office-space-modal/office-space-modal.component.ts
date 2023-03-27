import { BsModalRef } from 'ngx-bootstrap/modal';
import { Component } from '@angular/core';

@Component({
  selector: 'app-office-space-modal',
  templateUrl: './office-space-modal.component.html',
  styleUrls: ['./office-space-modal.component.scss'],
})
export class OfficeSpaceModalComponent {
  constructor(private bsRef: BsModalRef) {}
  space: string;
  Interested_in: string;

  closeModal() {
    this.bsRef.hide();
  }
}
