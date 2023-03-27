import { AbstractControl } from '@angular/forms';
import { AppConstant } from '@shared/constants/app.constant';

export class CustomValidators {
  static emailValidator(control: AbstractControl) {
    if (control.value.length === 0 || control.value.match(AppConstant.EMAIL_PATTERN)) {
      return null;
    } else {
      return { invalidEmailAddress: true };
    }
  }

  static phoneValidator(control: AbstractControl) {
    if (control.value.length === 0 || control.value.match(AppConstant.PHONE_PATTERN)) {
      return null;
    } else {
      return { invalidPhone: true };
    }
  }
}
