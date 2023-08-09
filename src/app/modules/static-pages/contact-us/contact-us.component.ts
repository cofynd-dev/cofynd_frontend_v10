import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@app/core/services/auth.service';
import { HelperService } from '@app/core/services/helper.service';
import { DEFAULT_APP_DATA } from '@core/config/app-data';
import { AVAILABLE_CITY } from '@core/config/cities';
import { City } from '@core/models/city.model';
import { SeoSocialShareData } from '@core/models/seo.model';
import { ConfigService } from '@core/services/config.service';
import { SeoService } from '@core/services/seo.service';
import { UserService } from '@core/services/user.service';
import { environment } from '@env/environment';
import { AppConstant } from '@shared/constants/app.constant';
import { CustomValidators } from '@shared/validators/custom-validators';
import { ToastrService } from 'ngx-toastr';
import { AuthType } from '@app/core/enum/auth-type.enum';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Enquiry } from '@app/core/models/enquiry.model';
import { CountryService } from '@app/core/services/country.service';
import { CityService } from '@app/core/services/city.service';

export enum ENQUIRY_STEPS {
  ENQUIRY,
  OTP,
  SUCCESS,
}

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
})
export class ContactUsComponent implements OnInit, OnDestroy {
  user: any;
  contactForm: FormGroup;
  loading: boolean;
  contactInfo = DEFAULT_APP_DATA.contact;
  showSuccessMessage: boolean;
  contactUserName: string;
  cities: City[] = AVAILABLE_CITY;
  submitted = false;
  finalCities: any = [];
  btnLabel = 'submit';
  ENQUIRY_STEPS: typeof ENQUIRY_STEPS = ENQUIRY_STEPS;
  ENQUIRY_STEP = ENQUIRY_STEPS.ENQUIRY;
  pageUrl: string;
  activeCountries: any = [];
  showcountry: boolean = false;
  selectedCountry: any = {};

  resendDisabled = false;
  resendCounter = 30;
  resendIntervalId: any;

  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private helperService: HelperService,
    private toastrService: ToastrService,
    private seoService: SeoService,
    private authService: AuthService,
    private router: Router,
    private countryService: CountryService,
    private cityService: CityService,
  ) {
    this.configService.configs.footer = false;
    this.addClass();
    this.buildForm();
    this.addSeoTags();
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
  }

  hideCountry(country: any) {
    this.selectedCountry = country;
    this.showcountry = false;
  }

  ngOnInit() {
    this.countryService.getCountryList().subscribe(countryList => {
      this.activeCountries = countryList;
      if (this.activeCountries && this.activeCountries.length > 0) {
        this.selectedCountry = this.activeCountries[0];
      }
    });
    this.cityService.getCityList().subscribe(cityList => {
      this.finalCities = cityList;
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

  addSeoTags() {
    const seoData: SeoSocialShareData = {
      title: 'Contact Us - CoFynd',
      image: 'https://cofynd.com/assets/images/meta/cofynd-facebook.jpg',
      description:
        // tslint:disable-next-line: max-line-length
        'CoFynd: Find the Right Workspace in Delhi, Noida, Gurugram . Get in touch with us to enquire a co working space.',
      url: environment.appUrl + '/contact-us',
      type: 'website',
    };
    this.seoService.setData(seoData);
  }

  onSubmit() {
    this.contactForm.markAllAsTouched();
    if (this.contactForm.invalid) {
      return;
    }
    if (!this.authService.getToken()) {
      this.authService.openAuthDialog(AuthType.LOGIN);
      return;
    }

    this.createContactEnquiry();
  }

  createContactEnquiry() {
    this.loading = true;
    const formValues = this.contactForm.getRawValue();
    this.contactUserName = formValues.name;
    formValues.message = `I am interested in ${formValues.interest} in ${formValues.city}. ${formValues.message}`;
    const object = {
      user: {
        phone_number: formValues.phone_number,
        email: formValues.email,
        name: formValues.name,
      },
      interested_in: formValues.interest,
      city: formValues.city,
    };
    this.userService.createLead(object).subscribe(
      () => {
        this.loading = false;
        this.showSuccessMessage = true;
        this.contactForm.reset();
      },
      error => {
        this.loading = false;
        this.toastrService.error(error.message);
      },
    );
  }

  private buildForm() {
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, CustomValidators.emailValidator]],
      phone_number: ['', [Validators.required, CustomValidators.phoneValidator]],
      message: ['', Validators.required],
      interest: ['', Validators.required],
      city: ['', Validators.required],
    });
  }

  enterpriseFormGroup: FormGroup = this.formBuilder.group({
    phone_number: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
    email: ['', [Validators.required, Validators.email]],
    name: ['', Validators.required],
    city: ['', Validators.required],
    interested_in: ['', Validators.required],
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

  onSubmit1() {
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
    let mx_Space_Type = '';
    if (this.enterpriseFormGroup.controls['interested_in'].value === 'Coworking Space') {
      mx_Space_Type = 'Web Coworking';
    }
    if (this.enterpriseFormGroup.controls['interested_in'].value === 'Coliving') {
      mx_Space_Type = 'Web Coliving';
    }
    if (this.enterpriseFormGroup.controls['interested_in'].value === 'Private Office') {
      mx_Space_Type = 'Web Office Space';
    }
    if (this.enterpriseFormGroup.controls['interested_in'].value === 'Customise Office') {
      mx_Space_Type = 'Web Office Space';
    }
    if (this.enterpriseFormGroup.controls['interested_in'].value === 'CoFynd of Landlords') {
      mx_Space_Type = 'List Coliving';
    }
    if (this.enterpriseFormGroup.controls['interested_in'].value === 'Broker Partnership Program') {
      mx_Space_Type = 'Web Coworking';
    }
    if (this.enterpriseFormGroup.controls['interested_in'].value === 'List Your Property') {
      mx_Space_Type = 'List Coliving';
    }
    if (this.enterpriseFormGroup.controls['interested_in'].value === 'Any/Other Query') {
      mx_Space_Type = 'Web Coworking';
    }
    const phone = this.enterpriseFormGroup.get('phone_number').value;
    let phoneWithDialCode = `${this.selectedCountry.dial_code}-${phone}`;
    const object = {
      user: {
        phone_number: phoneWithDialCode,
        email: this.enterpriseFormGroup.controls['email'].value,
        name: this.enterpriseFormGroup.controls['name'].value,
        requirements: this.enterpriseFormGroup.controls['requirements'].value,
      },
      interested_in: this.enterpriseFormGroup.controls['interested_in'].value,
      city: this.enterpriseFormGroup.controls['city'].value,
      mx_Page_Url: this.pageUrl,
      mx_Space_Type: mx_Space_Type,
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

  addClass() {
    this.helperService.addClassToDocument(AppConstant.FULL_HEIGHT_DOCUMENT_CLASS);
  }

  removeClass() {
    this.helperService.removeClassFromDocument(AppConstant.FULL_HEIGHT_DOCUMENT_CLASS);
  }

  ngOnDestroy() {
    this.removeClass();
    this.configService.setDefaultConfigs();
  }
}
