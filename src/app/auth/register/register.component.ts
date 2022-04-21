import { Component, OnDestroy } from '@angular/core';
import { HelperService } from '@app/core/services/helper.service';
import { AppConstant } from '@shared/constants/app.constant';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnDestroy {
  constructor(private helperService: HelperService) {
    this.addClass();
  }

  addClass() {
    this.helperService.addClassToDocument(AppConstant.FULL_HEIGHT_DOCUMENT_CLASS);
  }

  removeClass() {
    this.helperService.removeClassFromDocument(AppConstant.FULL_HEIGHT_DOCUMENT_CLASS);
  }

  ngOnDestroy() {
    this.removeClass();
  }
}
