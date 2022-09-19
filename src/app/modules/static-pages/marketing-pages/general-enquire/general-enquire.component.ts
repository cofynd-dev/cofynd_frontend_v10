import { isPlatformBrowser } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Enquiry } from '@app/core/models/enquiry.model';
import { AuthService } from '@app/core/services/auth.service';
import { CustomValidators } from '@app/shared/validators/custom-validators';
import { DEFAULT_APP_DATA } from '@core/config/app-data';
import { UserService } from '@core/services/user.service';
import { environment } from '@env/environment';
import { ToastrService } from 'ngx-toastr';
export enum ENQUIRY_STEPS {
  ENQUIRY,
  OTP,
  SUCCESS,
}
declare let ga: any;

@Component({
  selector: 'app-general-enquire',
  templateUrl: './general-enquire.component.html',
  styleUrls: ['./general-enquire.component.scss'],
})
export class GeneralEnquireComponent implements OnInit {
  supportPhone = DEFAULT_APP_DATA.contact.phone;
  @Input() isSticky: boolean;
  @Output() backButtonClick: EventEmitter<boolean> = new EventEmitter<boolean>();

  enquiryForm: FormGroup;
  loading: boolean;

  ENQUIRY_STEPS: typeof ENQUIRY_STEPS = ENQUIRY_STEPS;
  ENQUIRY_STEP = ENQUIRY_STEPS.ENQUIRY;
  btnLabel = 'Enquire Now';

  // Mat Select
  isActiveLabel: boolean;

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: any,
    private readonly formBuilder: FormBuilder,
    private readonly userService: UserService,
    private readonly toastrService: ToastrService,
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {
    this.buildForm();
  }

  ngOnInit(): void {}

  onSubmit() {
    this.enquiryForm.markAllAsTouched();

    if (this.enquiryForm.invalid) {
      return;
    }

    if (this.isAuthenticated()) {
      this.createEnquiry();
    } else {
      this.getOtp();
    }
  }

  getOtp() {
    if (this.ENQUIRY_STEP === ENQUIRY_STEPS.ENQUIRY) {
      this.loading = true;
      const formValues: Enquiry = this.enquiryForm.getRawValue();

      this.userService.addUserEnquiry(formValues).subscribe(
        () => {
          this.loading = false;
          this.ENQUIRY_STEP = ENQUIRY_STEPS.OTP;
          this.addValidationOnOtpField();
        },
        error => {
          this.loading = false;
          this.toastrService.error(error.message || 'Something broke the server, Please try latter');
        },
      );
    } else {
      this.validateOtp();
    }
  }

  addValidationOnOtpField() {
    const otpControl = this.enquiryForm.get('otp');
    otpControl.setValidators([Validators.required, Validators.minLength(4), Validators.maxLength(4)]);
    otpControl.updateValueAndValidity();
  }

  validateOtp() {
    const phone = this.enquiryForm.get('phone_number').value;
    const otp = this.enquiryForm.get('otp').value;
    this.loading = true;
    this.authService.verifyOtp(phone, otp).subscribe(
      () => {
        this.btnLabel = 'Verify OTP';
        this.loading = false;
        this.createEnquiry();
      },
      error => {
        this.loading = false;
        this.toastrService.error(error.message || 'Something broke the server, Please try latter');
      },
    );
  }

  createEnquiry() {
    this.loading = true;
    const formValues = this.enquiryForm.getRawValue();
    this.btnLabel = 'Submitting Enquiry...';
    this.userService.createEnquiryNonUser(formValues).subscribe(
      () => {
        this.loading = false;
        this.ENQUIRY_STEP = ENQUIRY_STEPS.SUCCESS;
        this.sendGaEvent('FORM_SUBMIT', 'click', 'FORM_DATA_SUBMIT');
      },
      error => {
        this.loading = false;
        this.toastrService.error(error.message || 'Something broke the server, Please try latter');
      },
    );
  }

  private buildForm() {
    this.enquiryForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, CustomValidators.emailValidator]],
      phone_number: ['', Validators.required],
      interested_in: [''],
      city: [this.router.url.split('-').pop()],
      otp: [''],
    });
  }

  private isAuthenticated() {
    return this.authService.getToken();
  }

  onClose() {
    this.backButtonClick.emit(true);
  }

  sendGaEvent(category: string, action: string, label: string) {
    if (environment.options.GA_ENABLED && isPlatformBrowser(this.platformId)) {
      ga('send', 'event', category, action, label);
    }
  }
}
