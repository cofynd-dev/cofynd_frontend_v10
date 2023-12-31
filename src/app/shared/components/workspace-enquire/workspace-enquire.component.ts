import { state, style, transition, trigger, useAnimation } from '@angular/animations';
import { isPlatformBrowser } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CountryService } from '@app/core/services/country.service';
import { HelperService } from '@app/core/services/helper.service';
import { WorkSpaceService } from '@app/core/services/workspace.service';
import { CoLivingService } from '@app/modules/co-living/co-living.service';
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

export enum ENQUIRY_TYPES {
  COWORKING,
  OFFICE,
  COLIVING,
}

declare let ga: any;

@Component({
  selector: 'app-workspace-enquire',
  templateUrl: './workspace-enquire.component.html',
  styleUrls: ['./workspace-enquire.component.scss'],
  animations: [
    trigger('shake', [state('0', style({})), state('1', style({})), transition('0 => 1', useAnimation(shake))]),
  ],
})
export class WorkspaceEnquireComponent implements OnInit, OnChanges {
  supportPhone = DEFAULT_APP_DATA.contact;
  forNoColiving = DEFAULT_APP_DATA.allother;
  @Input() isSticky: boolean;
  @Input() workSpaceId: string;
  @Input() workSpaceData: any;
  @Input() isOfficeEnquiry: boolean;
  @Input() isColivEnquiry: boolean;
  @Output() backButtonClick: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() enquiryType: number;
  @Input() shouldReload: boolean;
  @Input() cityName: string;
  @Input() microlocationName: string;

  enquiryForm: FormGroup;
  loading: boolean;
  user: any;
  phoneflag: boolean = true;
  ENQUIRY_STEPS: typeof ENQUIRY_STEPS = ENQUIRY_STEPS;
  ENQUIRY_TYPES: typeof ENQUIRY_TYPES = ENQUIRY_TYPES;
  ENQUIRY_STEP = ENQUIRY_STEPS.ENQUIRY;
  btnLabel = 'Submit';
  showbranddetails: boolean = false;

  minDate = new Date();

  // Mat Select
  isActiveLabel: boolean;
  shakeTheForm: boolean;
  payementModeOnList: string[] = [
    'day-pass',
    'hot-desk',
    'dedicated-desk',
    'single-sharing',
    'double-sharing',
    'triple-sharing',
  ];

  coworkingPlans = [
    { label: 'Office Suite', value: 'office-suite' },
    { label: 'Custom Buildout', value: 'custom-buildout' },
  ];

  coworkingNoOfSeats = [
    { label: '1-10', value: '1-10' },
    { label: `11-20`, value: '11-20' },
    { label: '21-50', value: '21-50' },
    { label: '51-100', value: '51-100' },
    { label: '100+', value: '100+' },
  ];

  MoveIn = [
    { label: 'Immediate', value: 'Immediate' },
    { label: 'Within This Month', value: 'Within This Month' },
    { label: '1-2 Month', value: '1-2 Month' },
    { label: '3-4 Month', value: '3-4 Month' },
    { label: 'After 4 Month', value: 'After 4 Month' },
  ];

  Budgets = [
    { label: 'Above 40k', value: 'Above 40k' },
    { label: '30k to 40k', value: '30k to 40k' },
    { label: '20k to 30k', value: '20k to 30k' },
    { label: '15k to 20k', value: '15k to 20k' },
    { label: '10k to 15k', value: '10k to 15k' },
  ];

  OfficeBudgets = [
    { label: 'Upto 1 Lac', value: 'Upto 1 Lac' },
    { label: '1 Lac - 2 Lac', value: '1 Lac - 2 Lac' },
    { label: '2 Lac - 5 Lac', value: '2 Lac - 5 Lac' },
    { label: '5 Lac - 10 Lac', value: '5 Lac - 10 Lac' },
    { label: '10 Lac +', value: '10 Lac +' },
  ];

  OfficeType = [
    { label: 'Raw', value: 'Raw' },
    { label: 'Semi-Furnished', value: 'Semi-Furnished' },
    { label: 'Fully-Furnished', value: 'Fully-Furnished' },
    { label: 'Built to Suit/Customized', value: 'Built to Suit/Customized' },
  ];

  coLivingPlans = [{ label: `Any Other`, value: 'any-other' }];
  pageUrl: string;
  activeCountries: any = [];
  showcountry: boolean = false;
  selectedCountry: any = {};

  resendDisabled = false;
  resendCounter = 30;
  resendIntervalId: any;
  coliving: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private toastrService: ToastrService,
    private workSpaceService: WorkSpaceService,
    private coLivingService: CoLivingService,
    private helperService: HelperService,
    private router: Router,
    private countryService: CountryService,
  ) {
    if (router.url.search(/co-living/i) != -1) {
      this.phoneflag = false;
    }
    this.buildForm();
    if (this.isAuthenticated()) {
      this.user = this.authService.getLoggedInUser();
    }
    this.pageUrl = this.router.url;
    this.pageUrl = `https://cofynd.com${this.pageUrl}`;
  }

  private buildForm() {
    const form = {
      name: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      phone_number: ['', Validators.required],
      otp: [''],
      mx_Page_Url: ['Space Detail Page'],
    };

    // if (this.enquiryType == ENQUIRY_TYPES.COWORKING || this.enquiryType == ENQUIRY_TYPES.COLIVING) {
    //   form['interested_in'] = [null, Validators.required];
    // }
    if (this.enquiryType == ENQUIRY_TYPES.COWORKING) {
      form['mx_Space_Type'] = ['Web Coworking'];
      form['no_of_person'] = [null, Validators.required];
      form['interested_in'] = [null, Validators.required];
    }
    if (this.enquiryType == ENQUIRY_TYPES.COLIVING) {
      form['mx_Move_In_Date'] = [null, Validators.required];
      form['mx_Space_Type'] = ['Web Coliving'];
      form['mx_BudgetPrice'] = [null, Validators.required];
      form['interested_in'] = [null, Validators.required];
    }
    if (this.enquiryType == ENQUIRY_TYPES.OFFICE) {
      form['mx_Space_Type'] = ['Web Office Space'];
      form['interested_in'] = [null, Validators.required];
      // form['mx_Move_In_Date'] = [null, Validators.required];
      form['mx_BudgetPrice'] = [null, Validators.required];
    }
    this.enquiryForm = this.formBuilder.group(form);
  }

  hideCountry(country: any) {
    this.selectedCountry = country;
    this.showcountry = false;
  }

  ngOnInit(): void {
    this.countryService.getCountryList().subscribe(countryList => {
      this.activeCountries = countryList;
      console.log('hear --------------', this.workSpaceData);
      if (this.activeCountries && this.activeCountries.length > 0) {
        this.selectedCountry = this.activeCountries[0];
      }
    });
    this.helperService.animateEnquiryForm$.subscribe(animationState => (this.shakeTheForm = animationState));
    if (this.enquiryType == ENQUIRY_TYPES.COWORKING) {
      this.loadWorkSpace(this.workSpaceId);
    } else if (this.enquiryType == ENQUIRY_TYPES.COLIVING) {
      this.loadColiving(this.workSpaceId);
    }
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

  loadWorkSpace(id: string) {
    this.workSpaceService.getWorkspace(id).subscribe(workspaceData => {
      let plans = workspaceData.plans.map(x => x.category);
      plans = [...new Set(plans)];
      plans.forEach(plan => {
        this.coworkingPlans.push({ label: this.toTitleCase(plan), value: plan['name'] });
      });
      var item_order = [
        'day-pass',
        'hot-desk',
        'dedicated-desk',
        'private-cabin',
        'office-suite',
        'cxo-suite',
        'custom-buildout',
      ];

      this.coworkingPlans.sort((a, b) => item_order.indexOf(a.value) - item_order.indexOf(b.value));
      this.coworkingPlans = [...this.coworkingPlans];
    });
  }

  loadColiving(id: string) {
    this.coLivingService.getCoLiving(id).subscribe((coliving: any) => {
      this.coliving = coliving;
      let plans = coliving.coliving_plans.map(x => x.planId);
      plans = [...new Set(plans)];
      plans.forEach(plan => {
        this.coLivingPlans.push({ label: this.toTitleCase(plan), value: plan['name'] });
      });
      var item_order = ['single-sharing', 'double-sharing', 'triple-sharing', 'studio-apartment', 'any-other'];
      this.coLivingPlans.sort((a, b) => item_order.indexOf(a.value) - item_order.indexOf(b.value));
      this.coLivingPlans = [...this.coLivingPlans];
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
      formValues.work_space = this.workSpaceId;
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
    switch (this.enquiryType) {
      case ENQUIRY_TYPES.COWORKING:
        formValues.work_space = this.workSpaceId;
        break;
      case ENQUIRY_TYPES.OFFICE:
        formValues.office_space = this.workSpaceId;
        break;
      case ENQUIRY_TYPES.COLIVING:
        formValues.living_space = this.workSpaceId;
        break;
    }

    if (this.enquiryType == ENQUIRY_TYPES.COWORKING) {
      if (formValues['interested_in'] == 'Virtual Office') {
        formValues['mx_Space_Type'] = 'Web Virtual Office';
      } else {
        formValues['mx_Space_Type'] = 'Web Coworking';
      }
    }
    if (this.enquiryType == ENQUIRY_TYPES.COLIVING) {
      formValues['mx_Space_Type'] = 'Web Coliving';
    }
    if (this.enquiryType == ENQUIRY_TYPES.OFFICE) {
      formValues['mx_Space_Type'] = 'Web Office Space';
    }
    formValues['mx_Page_Url'] = this.pageUrl;
    if (this.cityName) {
      formValues['city'] = this.cityName;
    }
    if (this.microlocationName) {
      formValues['microlocation'] = this.microlocationName;
    }
    const phone = this.enquiryForm.get('phone_number').value;
    let phoneWithDialCode = `${this.selectedCountry.dial_code}-${phone}`;
    formValues['phone_number'] = phoneWithDialCode;
    this.btnLabel = 'Submitting...';
    if (this.enquiryType == ENQUIRY_TYPES.COLIVING) {
      if (this.workSpaceData.space_contact_details.show_on_website == true) {
        formValues['google_sheet'] = this.workSpaceData.brand.google_sheet_url;
        formValues['micro_location'] = this.workSpaceData.location.name;
        formValues['property_name'] = this.workSpaceData.name;
      }
    }
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
        if (this.enquiryType == ENQUIRY_TYPES.COLIVING) {
          if (
            this.coliving.space_contact_details.email == '' ||
            this.coliving.space_contact_details.phone == '' ||
            !this.coliving.space_contact_details.show_on_website
          ) {
            this.router.navigate(['/thank-you']);
          } else {
            this.showbranddetails = true;
          }
        } else {
          this.router.navigate(['/thank-you']);
        }
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
