import { AVAILABLE_CITY, AVAILABLE_CITY_CO_LIVING } from './../../../core/config/cities';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { DEFAULT_APP_DATA } from '@core/config/app-data';
import { AuthType } from '@core/enum/auth-type.enum';
import { City } from '@core/models/city.model';
import { AuthService } from '@core/services/auth.service';
import { WorkSpaceService } from '@core/services/workspace.service';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { AppConfig } from '@core/interface/config.interface';
import { ConfigService } from '@core/services/config.service';
import { environment } from '@env/environment';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '@app/core/services/user.service';
import { Enquiry } from '@app/core/models/enquiry.model';
import { CityService } from '@app/core/services/city.service';
import { CountryService } from '@app/core/services/country.service';

export enum ENQUIRY_STEPS {
  ENQUIRY,
  OTP,
  SUCCESS,
}

declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [{ provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true } }],
})
export class HeaderComponent implements AfterViewInit {
  userNameInitial: string;
  contactInfo = DEFAULT_APP_DATA.header_contact;
  phoneflag: boolean = true;
  clearSearchAddressText: string;
  showSearch: boolean;
  country: any;
  isSearchModal: boolean;

  // On layout settings changed handler
  settings: AppConfig;
  onSettingsChanged: Subscription;

  menuPopularCoWorkings: City[];
  menuPopularOffices: City[];
  menuPopularCoLiving: City[];
  countries: any[] = [];
  cities: any[] = [];
  colivingCities: any[] = [];
  virtualOfficeCities: any[] = [];

  isMobileMenuOpen: boolean;

  activeCountries: any = [];
  inActiveCountries: any = [];
  showcountry: boolean = false;
  selectedCountry: any = {};

  resendDisabled = false;
  resendCounter = 30;
  resendIntervalId: any;
  ENQUIRY_STEPS: typeof ENQUIRY_STEPS = ENQUIRY_STEPS;
  ENQUIRY_STEP = ENQUIRY_STEPS.ENQUIRY;
  btnLabel = 'submit';
  enquiryForm: FormGroup;
  user: any;
  submitted = false;
  loading: boolean;
  showSuccessMessage: boolean;
  contactUserName: string;
  finalCities: any = [];
  pageUrl: string;
  checkboxValue: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private location: Location,
    private workSpaceService: WorkSpaceService,
    private configService: ConfigService,
    private cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private userService: UserService,
    private toastrService: ToastrService,
    private cityService: CityService,
    private countryService: CountryService,
  ) {
    this.fetchCityList();
    this.fetchCountryList();
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
    if (router.url.search(/co-living/i) != -1) {
      this.phoneflag = false;
    }
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.menuPopularCoWorkings = AVAILABLE_CITY.filter(
      city => city.for_coWorking === true && city.id !== '5f8d3541c2502350f24feeb6',
    );
    this.menuPopularOffices = AVAILABLE_CITY.filter(city => city.for_office === true);
    this.menuPopularCoLiving = AVAILABLE_CITY_CO_LIVING.filter(city => city.id !== '5f9bf559c2502350f2500152');
    router.events.subscribe(() => {
      if (this.location.path() === '') {
        this.showSearch = false;
      } else {
        this.showSearch = true;
      }
    });
  }

  fetchCityList() {
    this.cityService.fetchCityList().subscribe(
      data => {
        this.finalCities = data.data;
        // Store the city list in the service
        this.cityService.setCityList(data.data);
      },
      error => {
        console.error('Error fetching city list:', error);
      },
    );
  }

  fetchCountryList() {
    this.countryService.fetchCountryList({ for_queryform: true }).subscribe(
      data => {
        this.activeCountries = data.data;
        this.selectedCountry = this.activeCountries[0];
        // Store the country list in the service
        this.countryService.setCountryList(data.data);
      },
      error => {
        console.error('Error fetching city list:', error);
      },
    );
  }

  getCitiesForCoworking() {
    this.workSpaceService.getCityForCoworking('6231ae062a52af3ddaa73a39').subscribe((res: any) => {
      this.cities = res.data;
    });
  }

  getCityForColiving() {
    this.workSpaceService.getCityForColiving('6231ae062a52af3ddaa73a39').subscribe((res: any) => {
      this.colivingCities = res.data;
    });
  }

  getCityForVirtualOffice() {
    this.workSpaceService.getCityForVirtualOffice('6231ae062a52af3ddaa73a39').subscribe((res: any) => {
      this.virtualOfficeCities = res.data;
    });
  }

  isAuthenticated() {
    return this.authService.getToken() ? true : false;
  }

  onLogOut() {
    this.authService.logOut();
    this.closeMobileMenu();
    this.router.navigateByUrl('', { skipLocationChange: true }).then(() => {
      this.router.navigate([this.location.path()]);
    });
  }

  openLoginModal() {
    this.authService.openAuthDialog(AuthType.LOGIN);
    this.closeMobileMenu();
  }

  openSignUpModal() {
    this.authService.openAuthDialog(AuthType.SIGN_UP);
  }

  getUserName() {
    return this.authService.getLoggedInUser() ? this.authService.getLoggedInUser().name.substring(0, 1) : 'C';
  }

  getUser() {
    return this.authService.getLoggedInUser() ? this.authService.getLoggedInUser().name : 'User';
  }

  onCityChange(city: City) {
    this.router.navigateByUrl(`/coworking/${city.name.toLowerCase().trim()}`);
    this.workSpaceService.setSearchAddress(city.name);
  }

  redirectToblog() {
    window.open(`${environment.blogUrl}`, '_blank');
  }

  openMobileSearch() {
    this.isSearchModal = true;
  }

  closeMobileSearch() {
    this.isSearchModal = false;
  }

  openMobileMenu() {
    this.isMobileMenuOpen = true;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  ngAfterViewInit(): void {
    // Subscribe to all the settings change events
    this.onSettingsChanged = this.configService.onAppConfigChanged.subscribe((newSettings: AppConfig) => {
      this.settings = newSettings;
      this.cdr.detectChanges();
    });
  }

  logoClick() {
    localStorage.removeItem('minPrice');
    localStorage.removeItem('maxPrice');
    localStorage.removeItem('featuredColiving');
    localStorage.removeItem('officeType');
    this.workSpaceService.getCountry({ for_coWorking: true }).subscribe((res: any) => {
      this.country = res.data.filter(
        country => country.name === 'India' || country.name === 'india' || country.name === 'INDIA',
      );
      if (this.country.length > 0) {
        localStorage.setItem('country_name', this.country[0].name);
        localStorage.setItem('country_id', this.country[0].id);
      }
    });
  }

  function() {
    // ------------------------------------------------------- //
    // Multi Level dropdowns
    // ------------------------------------------------------ //
    $("ul.dropdown-menu [data-toggle='dropdown']").on('click', function(event) {
      event.preventDefault();
      event.stopPropagation();

      $(this)
        .siblings()
        .toggleClass('show');

      if (
        !$(this)
          .next()
          .hasClass('show')
      ) {
        $(this)
          .parents('.dropdown-menu')
          .first()
          .find('.show')
          .removeClass('show');
      }
      $(this)
        .parents('li.nav-item.dropdown.show')
        .on('hidden.bs.dropdown', function(e) {
          $('.dropdown-submenu .show').removeClass('show');
        });
    });
  }

  enterpriseFormGroup: FormGroup = this._formBuilder.group({
    phone_number: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
    email: ['', [Validators.required, Validators.email]],
    name: ['', Validators.required],
    city: ['', Validators.required],
    interested_in: ['', Validators.required],
    privacy: ['', Validators.required],
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

  hideCountry(country: any) {
    this.selectedCountry = country;
    this.showcountry = false;
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

  dismissModal(): void {
    $('#requestCallBack').modal('hide');
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
      mx_Space_Type: mx_Space_Type,
    };
    this.userService.createLead(object).subscribe(
      () => {
        this.loading = false;
        this.ENQUIRY_STEP = ENQUIRY_STEPS.SUCCESS;
        this.showSuccessMessage = true;
        this.enterpriseFormGroup.reset();
        this.submitted = false;
        this.dismissModal();
        this.router.navigate(['/thank-you']);
      },
      error => {
        this.loading = false;
        this.toastrService.error(error.message);
      },
    );
  }
}
