import { Component, Input, OnInit } from '@angular/core';
import { AVAILABLE_CITY } from '@app/core/config/cities';
import { City } from '@app/core/models/city.model';
import { Router } from '@angular/router';
import { UserService } from '@app/core/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { WorkSpaceService } from '@app/core/services/workspace.service';
import { AuthService } from '@app/core/services/auth.service';
import { Enquiry } from '@app/core/models/enquiry.model';

export enum ENQUIRY_STEPS {
  ENQUIRY,
  OTP,
  SUCCESS,
}

@Component({
  selector: 'app-search-no-result',
  templateUrl: './search-no-result.component.html',
  styleUrls: ['./search-no-result.component.scss'],
})
export class SearchNoResultComponent implements OnInit {
  @Input() title: string;
  @Input() url: string;
  @Input() shouldShowContactForm: boolean = false;
  availableCities: City[] = AVAILABLE_CITY;
  @Input() type: string = 'for_office';
  city: string;
  submitted = false;
  loading: boolean = true;
  showSuccessMessage: boolean;
  contactUserName: string;
  coworkingCities: any = [];
  colivingCities: any = [];
  finalCities: any = [];
  pageUrl: string;
  activeCountries: any = [];
  inActiveCountries: any = [];
  showcountry: boolean = false;
  selectedCountry: any = {};
  ENQUIRY_STEPS: typeof ENQUIRY_STEPS = ENQUIRY_STEPS;
  ENQUIRY_STEP = ENQUIRY_STEPS.ENQUIRY;
  resendDisabled = false;
  resendCounter = 30;
  resendIntervalId: any;
  // pageTitle: string;

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

  VirtualOfficeType = [
    { label: 'Dedicated Desk', value: 'Dedicated-Desk' },
    { label: 'Private Cabin', value: 'Private-Cabin' },
    { label: 'Virtual Office', value: 'Virtual-Office' },
    { label: 'Office Suite', value: 'Office-Suite' },
    { label: 'Custom Buildout', value: 'Custom-Buildout' },
  ];

  coworkingNoOfSeats = [
    { label: '1-10', value: '1-10' },
    { label: `11-20`, value: '11-20' },
    { label: '21-50', value: '21-50' },
    { label: '51-100', value: '51-100' },
    { label: '100+', value: '100+' },
  ];

  virtualType = [{ label: 'Virtual Office', value: 'virtual-office' }];

  virtualPlans = [
    { label: 'GST Registration', value: 'gst-registration' },
    { label: 'Business Registration', value: 'business-registration' },
    { label: 'Mailing Address', value: 'mailing-address' },
    { label: `Any Other`, value: 'any-other' },
  ];

  user: any;
  btnLabel: string;

  constructor(
    private router: Router,
    private userService: UserService,
    private toastrService: ToastrService,
    private _formBuilder: FormBuilder,
    private workSpaceService: WorkSpaceService,
    private authService: AuthService,
  ) {
    let url = this.router.url;
    this.pageUrl = `https://cofynd.com${url}`;
    var parts = url.split('/');
    this.city = parts[parts.length - 1];
    this.getCitiesForCoworking();
    this.getCitiesForColiving();
    this.loading = false;
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

  enterpriseFormGroup: FormGroup = this._formBuilder.group({
    phone_number: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
    email: ['', [Validators.required, Validators.email]],
    name: ['', Validators.required],
    requirements: [''],
  });

  private isAuthenticated() {
    return this.authService.getToken();
  }

  ngOnInit(): void {
    this.getCitiesForCoworking();
    this.getCitiesForColiving();
    if (this.title == 'Office') {
      let form = {
        phone_number: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
        email: ['', [Validators.required, Validators.email]],
        name: ['', Validators.required],
        requirements: [''],
        otp: [''],
      };
      form['mx_BudgetPrice'] = ['', Validators.required];
      form['mx_Furnishing_Type'] = ['', Validators.required];
      this.enterpriseFormGroup = this._formBuilder.group(form);
    }
    if (this.title == 'Virtual') {
      let form = {
        phone_number: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
        email: ['', [Validators.required, Validators.email]],
        name: ['', Validators.required],
        requirements: [''],
        otp: [''],
        mx_Space_Type: ['virtual-office'],
        interested_in: ['', Validators.required],
      };
      this.enterpriseFormGroup = this._formBuilder.group(form);
    }
    if (this.user) {
      const { name, email, phone_number } = this.user;
      this.enterpriseFormGroup.patchValue({ name, email, phone_number });
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.enterpriseFormGroup.controls;
  }

  get emailid() {
    return this.enterpriseFormGroup.controls;
  }

  get mobno() {
    return this.enterpriseFormGroup.controls;
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

  scrollToElement(element: HTMLElement) {
    element.scrollIntoView({ behavior: 'smooth' });
  }

  // setSubName() {
  //   let name = 'Virtual Office in ';
  //   if (this.title === 'gurugram') {
  //     name += ' ' + this.capitalize('gurgaon');
  //   } else {
  //     name += ' ' + this.capitalize(this.title);
  //   }
  //   return name;
  // }

  // capitalize = str => {
  //   if (typeof str !== 'string') return '';
  //   str = str.split(' ');
  //   for (let i = 0, x = str.length; i < x; i++) {
  //     str[i] = str[i][0].toUpperCase() + str[i].substr(1);
  //   }
  //   return str.join(' ');
  // };

  createEnquiry() {
    this.loading = true;
    this.contactUserName = this.enterpriseFormGroup.controls['name'].value;
    const phone = this.enterpriseFormGroup.get('phone_number').value;
    let phoneWithDialCode = `${this.selectedCountry.dial_code}-${phone}`;
    let object = {};
    if (this.title == 'Office') {
      object = {
        user: {
          phone_number: phoneWithDialCode,
          email: this.enterpriseFormGroup.controls['email'].value,
          name: this.enterpriseFormGroup.controls['name'].value,
          requirements: this.enterpriseFormGroup.controls['requirements'].value,
        },
        mx_Furnishing_Type: this.enterpriseFormGroup.controls['mx_Furnishing_Type'].value,
        mx_BudgetPrice: this.enterpriseFormGroup.controls['mx_BudgetPrice'].value,
        city: this.city,
        interested_in: 'Office Space',
        mx_Page_Url: this.pageUrl,
        mx_Space_Type: 'Web Office Space',
      };
    }
    if (this.title == 'Virtual') {
      object = {
        user: {
          phone_number: phoneWithDialCode,
          email: this.enterpriseFormGroup.controls['email'].value,
          name: this.enterpriseFormGroup.controls['name'].value,
          requirements: this.enterpriseFormGroup.controls['requirements'].value,
        },
        interested_in: this.enterpriseFormGroup.controls['interested_in'].value,
        city: this.city,
        mx_Page_Url: this.pageUrl,
        mx_Space_Type: 'Web Virtual Office',
      };
    }
    this.userService.createLead(object).subscribe(
      () => {
        this.router.navigate(['/thank-you']);
        this.loading = false;
        this.showSuccessMessage = true;
        this.enterpriseFormGroup.reset();
        this.submitted = false;
      },
      error => {
        this.loading = false;
        this.toastrService.error(error.message);
      },
    );
  }
}
