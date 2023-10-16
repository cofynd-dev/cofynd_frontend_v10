import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input-validation',
  templateUrl: './input-validation.component.html',
  styleUrls: ['./input-validation.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class InputValidationComponent {
  @Input() control: FormControl;

  get errorMessage() {
    if (!this.control.errors) {
      return null;
    }
    for (const propertyName in this.control.errors) {
      if (this.control.errors.hasOwnProperty(propertyName) && (this.control.dirty || this.control.touched)) {
        return this.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
      }
    }

    return null;
  }

  getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    console.log(validatorName, validatorValue);
    const config = {
      required: 'This field can not be blank.',
      invalidNumber: 'Input should be an integer value',
      invalidPhone: 'Invalid phone number',
      invalidEmailAddress: 'Invalid email address',
      email: 'Please enter valide email id.',
      numericAllowed: 'Only numeric values are allowed',
      emailTaken: 'Email id already taken',
      minlength: `Minimum length should be ${validatorValue.requiredLength} characters`,
      maxlength: `Maximum length should be ${validatorValue.requiredLength} characters`,
    };

    return config[validatorName];
  }
}
