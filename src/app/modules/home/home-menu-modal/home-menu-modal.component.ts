import { BsModalRef } from 'ngx-bootstrap/modal';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home-menu-modal',
  templateUrl: './home-menu-modal.component.html',
  styleUrls: ['./home-menu-modal.component.scss'],
})
export class HomeMenuModalComponent {
  enabledForm: boolean = false;
  isCoworking: boolean = true;
  isCoLiving: boolean = true;
  isOffice: boolean = true;
  space: string = 'Spaces';
  Interested_in: string;
  constructor(private bsRef: BsModalRef) { }

  closeModal() {
    this.bsRef.hide();
  }
}
