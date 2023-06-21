import { state, style, transition, trigger, useAnimation } from '@angular/animations';
import { isPlatformBrowser } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HelperService } from '@app/core/services/helper.service';
import { WorkSpaceService } from '@app/core/services/workspace.service';
import { DEFAULT_APP_DATA } from '@core/config/app-data';
import { Enquiry } from '@core/models/enquiry.model';
import { AuthService } from '@core/services/auth.service';
import { UserService } from '@core/services/user.service';
import { environment } from '@env/environment';
import { shake } from '@shared/animations/animation';
import { ToastrService } from 'ngx-toastr';

export enum ENQUIRY_STEPS {
  ENQUIRY,
  OTP,
  SUCCESS,
}

declare let ga: any;

@Component({
  selector: 'app-virtual-office-city-page-enquire',
  templateUrl: './virtual-office-city-page-enquire.component.html',
  styleUrls: ['./virtual-office-city-page-enquire.component.scss'],
  animations: [
    trigger('shake', [state('0', style({})), state('1', style({})), transition('0 => 1', useAnimation(shake))]),
  ],
})
export class VirtualOfficeCityPageEnquireComponent implements OnInit, OnChanges {
  supportPhone = DEFAULT_APP_DATA.contact;
  @Input() isSticky: boolean;
  @Input() workSpaceId: string;
  @Input() isOfficeEnquiry: boolean;
  @Input() isColivEnquiry: boolean;
  @Output() backButtonClick: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() enquiryType: number;
  @Input() shouldReload: boolean;
  enquiryForm: FormGroup;
  loading: boolean;
  user: any;
  phoneflag: boolean = true;
  ENQUIRY_STEPS: typeof ENQUIRY_STEPS = ENQUIRY_STEPS;
  ENQUIRY_STEP = ENQUIRY_STEPS.ENQUIRY;
  btnLabel = 'submit';
  minDate = new Date();
  // Mat Select
  isActiveLabel: boolean;
  shakeTheForm: boolean;

  virtualType = [{ label: 'Virtual Office', value: 'virtual-office' }];

  virtualPlans = [
    { label: 'GST Registration', value: 'gst-registration' },
    { label: 'Business Registration', value: 'business-registration' },
    { label: 'Mailing Address', value: 'mailing-address' },
    { label: `Any/All`, value: 'any/all' },
  ];

  MoveIn = [
    { label: 'Immediate', value: 'Immediate' },
    { label: 'Within This Month', value: 'Within This Month' },
    { label: '1-2 Month', value: '1-2 Month' },
    { label: '3-4 Month', value: '3-4 Month' },
    { label: 'After 4 Month', value: 'After 4 Month' },
  ];

  pageName: string;
  pageUrl: string;
  city: string;
  activeCountries: any = [];
  inActiveCountries: any = [];
  showcountry: boolean = false;
  selectedCountry: any = {};
  resendDisabled = false;
  resendCounter = 30;
  resendIntervalId: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private toastrService: ToastrService,
    private workSpaceService: WorkSpaceService,
    private helperService: HelperService,
    private router: Router,
  ) {
    if (router.url.search(/co-living/i) != -1) {
      this.phoneflag = false;
    }
    this.buildForm();
    if (this.isAuthenticated()) {
      this.user = this.authService.getLoggedInUser();
    }
    this.pageUrl = this.router.url;
    let url = this.router.url.split('/');
    var parts = url;
    this.city = parts[parts.length - 1];
    this.pageName = url[1];
    this.pageUrl = `https://cofynd.com${this.pageUrl}`;
    this.getCountries();
    if (this.user) {
      const { name, email, phone_number } = this.user;
      this.enquiryForm.patchValue({ name, email, phone_number });
      this.selectedCountry['dial_code'] = this.user.dial_code;
    }
  }

  getCountries() {
    this.workSpaceService.getCountry({}).subscribe((res: any) => {
      if (res.data) {
        this.activeCountries = res.data.filter(v => {
          return v.for_coWorking === true;
        });
        this.inActiveCountries = res.data.filter(v => {
          return v.for_coWorking == false;
        });
        this.selectedCountry = this.activeCountries[0];
      }
    });
  }

  resendOTP() {
    // Disable the resend button and start the counter
    this.resendDisabled = true;
    this.resendIntervalId = setInterval(() => {
      // Decrement the counter every second
      this.resendCounter--;
      if (this.resendCounter === 0) {
        // If the counter reaches zero, enable the resend button
        clearInterval(this.resendIntervalId);
        this.resendDisabled = false;
        this.resendCounter = 30;
      }
    }, 1000);
    // TODO: Implement OTP resend logic here
    let obj = {};
    obj['dial_code'] = this.selectedCountry.dial_code;
    obj['phone_number'] = this.enquiryForm.controls['phone_number'].value;
    this.userService.resendOtp(obj).subscribe(
      (data: any) => {
        if (data) {
          this.ENQUIRY_STEP = ENQUIRY_STEPS.OTP;
          this.btnLabel = 'Verify OTP';
          this.addValidationOnOtpField();
        }
      },
      error => {
        this.toastrService.error(error.message || 'Something broke the server, Please try latter');
      },
    );
  }

  hideCountry(country: any) {
    this.selectedCountry = country;
    this.showcountry = false;
  }

  ngOnInit(): void {
    this.helperService.animateEnquiryForm$.subscribe(animationState => (this.shakeTheForm = animationState));
  }

  ngOnChanges(changes) {
    if (changes && changes.enquiryType) {
      this.buildForm();
      if (this.user) {
        const { name, email, phone_number } = this.user;
        this.enquiryForm.patchValue({ name, email, phone_number });
        this.selectedCountry['dial_code'] = this.user.dial_code;
      }
    }

    if (changes && changes.shouldReload) {
      if (changes.shouldReload.currentValue) {
        this.resetForm();
      }
    }
  }

  animationChanged(event: any) {
    if (event && event.phaseName === 'done') {
      this.shakeTheForm = false;
    }
  }

  toTitleCase = phrase => {
    return phrase.name
      .toLowerCase()
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  toTitleCaseForColiving = phrase => {
    return phrase
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  toValueCaseForColiving = phrase => {
    return phrase
      .toLowerCase()
      .split('_')
      .join('-');
  };

  onSubmit() {
    this.addValidationOnMobileField();
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
      formValues['dial_code'] = this.selectedCountry.dial_code;
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

  validateOtp() {
    const phone = this.enquiryForm.get('phone_number').value;
    const otp = this.enquiryForm.get('otp').value;
    this.loading = true;
    this.authService.verifyOtp(phone, otp).subscribe(
      () => {
        this.btnLabel = 'Verify OTP';
        this.loading = false;
        this.user = this.authService.getLoggedInUser();
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
    const formValues: Enquiry = this.enquiryForm.getRawValue();
    const phone = this.enquiryForm.get('phone_number').value;
    let phoneWithDialCode = `${this.selectedCountry.dial_code}${phone}`;
    formValues['phone_number'] = phoneWithDialCode;
    if (this.pageName == 'virtual-office') {
      formValues['mx_Space_Type'] = 'Web Virtual Office';
    }
    formValues['mx_Page_Url'] = this.pageUrl;
    formValues['city'] = this.city;
    this.btnLabel = 'Submitting...';
    this.userService.createEnquiry(formValues).subscribe(
      () => {
        this.loading = false;
        this.ENQUIRY_STEP = ENQUIRY_STEPS.SUCCESS;
        this.sendGaEvent('ENQUIRY_FORM_SUBMIT', 'click', 'FORM_SUBMIT');
        /** 
          Will open it after discussion 
          const interestedIn = this.enquiryForm.get('interested_in').value;
          if (this.payementModeOnList.indexOf(interestedIn) >= 0) {
            this.router.navigate(['/booking'], {
              queryParams: { workspace: this.workSpaceId, interestedIn },
            });
          }
        */
        this.resetForm();
        this.router.navigate(['/thank-you']);
      },
      error => {
        this.loading = false;
        this.toastrService.error(error.message || 'Something broke the server, Please try latter');
      },
    );
  }

  addValidationOnOtpField() {
    const otpControl = this.enquiryForm.get('otp');
    otpControl.setValidators([Validators.required, Validators.minLength(4), Validators.maxLength(4)]);
    otpControl.updateValueAndValidity();
  }

  addValidationOnMobileField() {
    const otpControl = this.enquiryForm.get('phone_number');
    otpControl.setValidators([Validators.required, Validators.minLength(10), Validators.maxLength(10)]);
    otpControl.updateValueAndValidity();
  }

  private buildForm() {
    const form = {
      name: ['', Validators.required],
      email: ['', Validators.required],
      phone_number: ['', Validators.required],
      otp: [''],
      mx_Page_Url: [''],
    };
    form['mx_Space_Type'] = ['virtual-office', Validators.required];
    form['mx_Move_In_Date'] = [null, Validators.required];
    form['interested_in'] = [null, Validators.required];
    this.enquiryForm = this.formBuilder.group(form);
  }

  private resetForm() {
    this.enquiryForm.reset();
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
