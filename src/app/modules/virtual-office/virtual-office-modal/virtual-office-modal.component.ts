import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-virtual-office-modal',
  templateUrl: './virtual-office-modal.component.html',
  styleUrls: ['./virtual-office-modal.component.scss'],
})
export class VirtualOfficeModalComponent implements OnInit {
  constructor(private bsRef: BsModalRef) {}

  space: string;
  Interested_in: string;

  ngOnInit() {}

  closeModal() {
    this.bsRef.hide();
  }
}
