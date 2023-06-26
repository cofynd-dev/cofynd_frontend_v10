import { Component, OnInit } from '@angular/core';
import { Builder } from '../builder.model';
import { BuilderService } from '../builder.services';
import { AppConstant } from '@shared/constants/app.constant';
import { sanitizeParams } from '@app/shared/utils';
import { Observable, forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '@app/core/services/user.service';
import { AuthService } from '@app/core/services/auth.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Enquiry } from '@app/core/models/enquiry.model';
import { WorkSpaceService } from '@app/core/services/workspace.service';

export enum ENQUIRY_STEPS {
  ENQUIRY,
  OTP,
  SUCCESS,
}

@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.scss'],
})
export class BuilderComponent implements OnInit {
  featuredBuilders: Builder[];
  queryParams: { [key: string]: string | number };
  loading: boolean = false;
  mumbaiBuilders: Builder[];
  bangloreBuilders: Builder[];
  gurugramBuilders: Builder[];
  ahmedabadBuilders: Builder[];
  puneBuilders: Builder[];
  ENQUIRY_STEPS: typeof ENQUIRY_STEPS = ENQUIRY_STEPS;
  ENQUIRY_STEP = ENQUIRY_STEPS.ENQUIRY;
  resendDisabled = false;
  resendCounter = 30;
  resendIntervalId: any;
  activeCountries: any = [];
  inActiveCountries: any = [];
  showcountry: boolean = false;
  selectedCountry: any = {};
  submitted = false;
  contactUserName: string;
  showSuccessMessage: boolean;
  coworkingCities: any = [];
  colivingCities: any = [];
  finalCities: any = [];
  user: any;
  pageUrl: string;
  btnLabel = 'submit';

  constructor(
    private builderService: BuilderService,
    private router: Router,
    private toastrService: ToastrService,
    private _formBuilder: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private workSpaceService: WorkSpaceService,
  ) {
    this.queryParams = { ...AppConstant.DEFAULT_SEARCH_PARAMS };
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

  enterpriseFormGroup: FormGroup = this._formBuilder.group({
    phone_number: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
    email: ['', [Validators.required, Validators.email]],
    name: ['', Validators.required],
    city: ['', Validators.required],
    requirements: [''],
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

  ngOnInit() {
    this.getBuilders(this.queryParams);
    this.loading = true;
    const mumbaiqueryParams = { ...this.queryParams, city: '5f5b1f728bbbb85328976417', type: 'location' };
    const bangalorequeryParams = { ...this.queryParams, city: '5f2a4210ecdb5a5d67f0bbbc', type: 'location' };
    const gurugramqueryParams = { ...this.queryParams, city: '5e3eb83c18c88277e81427d9', type: 'location' };
    const ahmedabadqueryParams = { ...this.queryParams, city: '5f7af1c48c4e6961990e620e', type: 'location' };
    const punequeryParams = { ...this.queryParams, city: '5e3eb83c18c88277e8142795', type: 'location' };
    const observables = [
      this.builderService.getBuilders(sanitizeParams(mumbaiqueryParams)),
      this.builderService.getBuilders(sanitizeParams(bangalorequeryParams)),
      this.builderService.getBuilders(sanitizeParams(gurugramqueryParams)),
      this.builderService.getBuilders(sanitizeParams(ahmedabadqueryParams)),
      this.builderService.getBuilders(sanitizeParams(punequeryParams)),
    ];
    forkJoin(observables).subscribe((res: any) => {
      this.mumbaiBuilders = res[0].data;
      this.bangloreBuilders = res[1].data;
      this.gurugramBuilders = res[2].data;
      this.ahmedabadBuilders = res[3].data;
      this.puneBuilders = res[4].data;
      this.loading = false;
    });
    this.getCitiesForCoworking();
    this.getCitiesForColiving();
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
    this.contactUserName = this.enterpriseFormGroup.controls['name'].value;
    const phone = this.enterpriseFormGroup.get('phone_number').value;
    let phoneWithDialCode = `${this.selectedCountry.dial_code}-${phone}`;
    const object = {
      user: {
        phone_number: phoneWithDialCode,
        email: this.enterpriseFormGroup.controls['email'].value,
        name: this.enterpriseFormGroup.controls['name'].value,
        requirements: this.enterpriseFormGroup.controls['requirements'].value,
      },
      city: this.enterpriseFormGroup.controls['city'].value,
      mx_Page_Url: this.pageUrl,
      mx_Space_Type: 'Web Builder',
    };
    this.userService.createLead(object).subscribe(
      () => {
        this.loading = false;
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

  scrollToElement(element: HTMLElement) {
    element.scrollIntoView({ behavior: 'smooth' });
  }

  getBuilders(param: {}) {
    this.loading = true;
    this.builderService.getBuilders(sanitizeParams(param)).subscribe(allBuilders => {
      this.featuredBuilders = allBuilders.data;
      this.loading = false;
    });
  }

  routeToBuilder(slug: any) {
    let url = `/india/builder/${slug}`;
    if (slug) {
      window.open(url, '_blank');
    }
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
}
