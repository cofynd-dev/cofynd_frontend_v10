import { AuthService } from './../../../core/services/auth.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '@core/models/user.model';
import { UserService } from '@core/services/user.service';
import { CustomValidators } from '@shared/validators/custom-validators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-search-contact-us-text',
  templateUrl: './search-contact-us-text.component.html',
  styleUrls: ['./search-contact-us-text.component.scss'],
})
export class SearchContactUsTextComponent implements OnInit {
  @Input() cities: any;
  @Input() microlocations: any;
  @Input() type: string;
  user: User;
  contactForm: FormGroup;
  loading: boolean;
  showSuccessMessage: boolean;
  contactUserName: string;
  showEnquireForm: boolean;
  showOtpField: boolean;
  isOtpError: boolean;
  otpErrorMessage: string;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private authService: AuthService,
  ) {
    this.buildForm();
  }

  ngOnInit() {
    console.log(this.microlocations);
  }

  onSubmit() {
    this.contactForm.markAllAsTouched();
    if (this.contactForm.invalid) {
      return;
    }

    if (!this.showOtpField) {
      this.getOtp();
    } else {
      this.verifyOtp();
    }
  }

  getOtp() {
    const phoneControl = this.contactForm.get('phone_number');
    this.loading = true;

    this.authService.signInWithOtp(phoneControl.value).subscribe(
      () => {
        this.toastrService.success(`Verification code sent to ${phoneControl.value}`);
        this.loading = false;
        this.showOtpField = true;
      },
      error => {
        this.isOtpError = true;
        this.otpErrorMessage = error.message;
        this.loading = false;
      },
    );
  }

  verifyOtp() {
    const otpControl = this.contactForm.get('otp');
    const phoneControl = this.contactForm.get('phone_number');

    if (otpControl.value === '') {
      this.isOtpError = true;
      this.otpErrorMessage = 'Please enter OTP';
      return;
    }

    this.loading = true;

    this.authService.verifyOtpForContact(phoneControl.value, otpControl.value).subscribe(
      () => {
        this.isOtpError = false;
        this.otpErrorMessage = '';
        this.submitEnquiry();
      },
      error => {
        this.isOtpError = true;
        this.otpErrorMessage = error.error.message;
        this.loading = false;
      },
    );
  }

  submitEnquiry() {
    this.loading = true;
    const formValues = this.contactForm.getRawValue();
    formValues.message = this.contactForm.get('city').value + ' - ' + this.type;
    this.contactUserName = formValues.name;
    this.userService.addToContact(formValues).subscribe(
      () => {
        this.loading = false;
        this.showSuccessMessage = true;
        this.createEnquiry(formValues);
        this.contactForm.reset();
      },
      error => {
        this.loading = false;
        this.toastrService.error(error.message);
      },
    );
  }

  createEnquiry(formValues) {
    this.loading = true;
    switch (this.type) {
      case 'for_coLiving':
        formValues.interested_in = 'Co Living';
        break;
      case 'for_coWorking':
        formValues.interested_in = 'Co Working';
        break;
      case 'for_office':
        formValues.interested_in = 'office Space';
        break;
      default:
        formValues.interested_in = this.type || 'Random Enquiry';
        break;
    }
    this.userService.createEnquiryNonUser(formValues).subscribe(
      () => {
        this.loading = false;
        this.contactForm.reset();
      },
      error => {
        this.loading = false;
        this.toastrService.error(error.message || 'Something broke the server, Please try latter');
      },
    );
  }

  onCityChange(cityName: string) { }

  private buildForm() {
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, CustomValidators.emailValidator]],
      phone_number: ['', [Validators.required, CustomValidators.phoneValidator]],
      city: [null, Validators.required],
      source: ['Organic'],
      otp: '',
    });
  }
}
