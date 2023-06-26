import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Enquiry } from '@app/core/models/enquiry.model';
import { AuthService } from '@app/core/services/auth.service';
import { UserService } from '@app/core/services/user.service';
import { WorkSpaceService } from '@app/core/services/workspace.service';
import { ToastrService } from 'ngx-toastr';

export enum ENQUIRY_STEPS {
  ENQUIRY,
  OTP,
  SUCCESS,
}

@Component({
  selector: 'app-search-contact-us-text2',
  templateUrl: './search-contact-us-text2.component.html',
  styleUrls: ['./search-contact-us-text2.component.scss'],
})
export class SearchContactUsText2Component implements OnInit {
  @Input() pageNo: any;
  @Input() microlocation: any;
  btnLabel = 'submit';
  ENQUIRY_STEPS: typeof ENQUIRY_STEPS = ENQUIRY_STEPS;
  ENQUIRY_STEP = ENQUIRY_STEPS.ENQUIRY;
  user: any;
  pageUrl: string;
  activeCountries: any = [];
  inActiveCountries: any = [];
  showcountry: boolean = false;
  selectedCountry: any = {};
  resendDisabled = false;
  resendCounter = 30;
  resendIntervalId: any;

  constructor(
    private _formBuilder: FormBuilder,
    private userService: UserService,
    private toastrService: ToastrService,
    private workSpaceService: WorkSpaceService,
    private router: Router,
    private authService: AuthService,
  ) {
    this.getCitiesForCoworking();
    this.getCitiesForColiving();
    this.pageUrl = this.router.url;
    this.pageUrl = `https://cofynd.com${this.pageUrl}`;
    if (this.isAuthenticated()) {
      this.user = this.authService.getLoggedInUser();
    }
    if (this.user) {
      const { name, email, phone_number } = this.user;
      this.enterpriseFormGroup.patchValue({ name, email, phone_number });
      this.selectedCountry['dial_code'] = this.user.dial_code;
    }
    this.getCountries();
  }

  submitted = false;
  loading: boolean;
  showSuccessMessage: boolean;
  contactUserName: string;
  coworkingCities: any = [];
  colivingCities: any = [];
  finalCities: any = [];

  ngOnInit() {
    this.getCitiesForCoworking();
    this.getCitiesForColiving();
  }

  enterpriseFormGroup: FormGroup = this._formBuilder.group({
    phone_number: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
    email: ['', [Validators.required, Validators.email]],
    name: ['', Validators.required],
    city: ['', Validators.required],
    interested_in: ['', Validators.required],
    otp: [''],
  });

  get f(): { [key: string]: AbstractControl } {
    return this.enterpriseFormGroup.controls;
  }

  get emailid() {
    return this.enterpriseFormGroup.controls;
  }

  get mobno() {
    return this.enterpriseFormGroup.controls;
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

  hideCountry(country: any) {
    this.selectedCountry = country;
    this.showcountry = false;
  }

  getCitiesForCoworking() {
    this.workSpaceService.getCityForCoworking('6231ae062a52af3ddaa73a39').subscribe((res: any) => {
      this.coworkingCities = res.data;
    });
  }

  getCitiesForColiving() {
    this.workSpaceService.getCityForColiving('6231ae062a52af3ddaa73a39').subscribe((res: any) => {
      this.colivingCities = res.data;
      if (this.colivingCities.length) {
        this.removeDuplicateCities();
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
    obj['phone_number'] = this.enterpriseFormGroup.controls['phone_number'].value;
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

  removeDuplicateCities() {
    const key = 'name';
    let allCities = [...this.coworkingCities, ...this.colivingCities];
    this.finalCities = [...new Map(allCities.map(item => [item[key], item])).values()];
  }

  onSubmit() {
    this.submitted = true;
    if (this.enterpriseFormGroup.invalid) {
      return;
    }
    if (this.isAuthenticated()) {
      this.createEnquiry();
    } else {
      this.getOtp();
    }
  }

  private isAuthenticated() {
    return this.authService.getToken();
  }

  getOtp() {
    if (this.ENQUIRY_STEP === ENQUIRY_STEPS.ENQUIRY) {
      this.loading = true;
      const formValues: Enquiry = this.enterpriseFormGroup.getRawValue();
      formValues['dial_code'] = this.selectedCountry.dial_code;
      this.userService.addUserEnquiry(formValues).subscribe(
        () => {
          this.loading = false;
          this.btnLabel = 'Verify OTP';
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
    const phone = this.enterpriseFormGroup.get('phone_number').value;
    const otp = this.enterpriseFormGroup.get('otp').value;
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

  addValidationOnOtpField() {
    const otpControl = this.enterpriseFormGroup.get('otp');
    otpControl.setValidators([Validators.required, Validators.minLength(4), Validators.maxLength(4)]);
    otpControl.updateValueAndValidity();
  }

  createEnquiry() {
    this.loading = true;
    this.btnLabel = 'Submitting...';
    let mx_Space_Type = '';
    this.contactUserName = this.enterpriseFormGroup.controls['name'].value;
    if (this.enterpriseFormGroup.controls['interested_in'].value === 'Coworking') {
      mx_Space_Type = 'Web Coworking';
    }
    if (this.enterpriseFormGroup.controls['interested_in'].value === 'Coliving') {
      mx_Space_Type = 'Web Coliving';
    }
    if (this.enterpriseFormGroup.controls['interested_in'].value === 'Office Space') {
      mx_Space_Type = 'Web Office Space';
    }
    if (this.enterpriseFormGroup.controls['interested_in'].value === 'Virtual Office') {
      mx_Space_Type = 'Web Virtual Office';
    }
    const phone = this.enterpriseFormGroup.get('phone_number').value;
    let phoneWithDialCode = `${this.selectedCountry.dial_code}-${phone}`;
    const object = {
      user: {
        phone_number: phoneWithDialCode,
        email: this.enterpriseFormGroup.controls['email'].value,
        name: this.enterpriseFormGroup.controls['name'].value,
      },
      city: this.enterpriseFormGroup.controls['city'].value,
      interested_in: this.enterpriseFormGroup.controls['interested_in'].value,
      mx_Page_Url: this.pageUrl,
      microlocation: this.microlocation,
      mx_Space_Type: mx_Space_Type,
    };
    this.userService.createLead(object).subscribe(
      () => {
        this.loading = false;
        this.ENQUIRY_STEP = ENQUIRY_STEPS.SUCCESS;
        this.showSuccessMessage = true;
        this.enterpriseFormGroup.reset();
        this.submitted = false;
        this.router.navigate(['/thank-you']);
      },
      error => {
        this.loading = false;
        this.toastrService.error(error.message);
      },
    );
  }
}
