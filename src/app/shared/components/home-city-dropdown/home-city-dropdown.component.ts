import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { UserService } from '@app/core/services/user.service';
import { WorkSpaceService } from '@app/core/services/workspace.service';
import { AVAILABLE_CITY } from '@core/config/cities';
import { City } from '@core/models/city.model';
import { ToastrService } from 'ngx-toastr';

export enum ENQUIRY_STEPS {
  ENQUIRY,
  OTP,
  SUCCESS,
}

@Component({
  selector: 'app-home-city-dropdown',
  templateUrl: './home-city-dropdown.component.html',
  styleUrls: ['./home-city-dropdown.component.scss'],
})
export class HomeCityDropdownComponent {
  @Input() isModalView: boolean;
  @Input() typeLabel: string;
  @Input() cityLabel: string;
  @Input() isCoworking: boolean;
  @Input() isOffice: boolean;
  @Input() isCoLiving: boolean;
  @Input() enabledForm: boolean;
  @Input() Spaces: string;
  @Input() isCountryLandingPage: boolean;
  @Output() modalClose: EventEmitter<boolean> = new EventEmitter<boolean>();

  // not useable
  @Input() enabledForCustomizeOffice: boolean;
  @Input() virArtShoot: boolean = true;
  @Input() other: boolean = true;


  // new deco
  @Input() spaces: string = 'Spaces';
  @Input() isCityVisible: boolean = true;
  @Input() interested_in: string;
  allCity = [
    'Delhi',
    'Gurugram',
    'Noida',
    'Bangalore',
    'Hyderabad',
    'Mumbai',
    'Pune',
    'Indore',
    'Chennai',
    'Ahmedabad',
    'Kochi',
    'Chandigarh',
    'Jaipur',
    'Lucknow',
    'Kolkata',
    'Coimbatore',
    'Goa',
    'Dehradun',
    'Bhubaneswar',
  ]

  cities: City[];
  navigationUrl: string;
  enquiryForm: FormGroup;
  ENQUIRY_STEPS: typeof ENQUIRY_STEPS = ENQUIRY_STEPS;
  ENQUIRY_STEP = ENQUIRY_STEPS.ENQUIRY;
  loading: boolean;
  btnLabel = 'Submit';
  otpVerified: boolean;
  cityName: string;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastrService: ToastrService,
    private authService: AuthService,
    private workSpaceService: WorkSpaceService,

  ) { }

  ngOnInit(): void {
    if (this.enabledForm) {
      this.buildForm();
    }
  }

  private buildForm() {
    const form = {
      name: ['', Validators.required],
      email: ['', Validators.required],
      phone_number: ['', Validators.required],
      otp: [''],
    };

    // if (this.enabledForCustomizeOffice) {
    //   (form['area_sqft'] = ['', Validators.required]), (form['org_name'] = ['', Validators.required]);
    // }

    this.enquiryForm = this.formBuilder.group(form);
  }

  onTypeChange(interested_in: string) {
    this.interested_in = interested_in;
    if (this.isCoworking && (this.interested_in === 'coworking' || this.interested_in === 'day pass')) {
      if (this.isCountryLandingPage == true) {
        this.workSpaceService.getCity(localStorage.getItem('country_id')).subscribe((res: any) => {
          this.cities = res.data.filter(city => city.for_coWorking === true);
          this.navigationUrl = '/coworking/';
        });
      }
      if (this.isCountryLandingPage == false) {
        this.cities = AVAILABLE_CITY.filter(city => city.for_coWorking === true);
        this.navigationUrl = '/coworking/';
      }
    }
    if (this.isOffice && this.interested_in === 'offices') {
      this.cities = AVAILABLE_CITY.filter(city => city.for_office === true);
      this.navigationUrl = '/office-space/rent/';
    }
    if (this.isCoLiving && this.interested_in === 'coliving') {
      if (this.isCountryLandingPage == true) {
        this.workSpaceService.getCity(localStorage.getItem('country_id')).subscribe((res: any) => {
          this.cities = res.data.filter(city => city.for_coLiving === true);
          this.navigationUrl = '/co-living/';
        });
      };
      if (this.isCountryLandingPage == false) {
        this.cities = AVAILABLE_CITY.filter(city => city.for_coLiving === true);
        this.navigationUrl = '/co-living/';
      }
    }
  }

  onCityChange(city) {
    let city_name = city['name'];
    if (city.Country) {
      let dbcountry_name = city['Country']['name'];
      let country_id = city['Country']['id'];
      localStorage.setItem('country_name', dbcountry_name);
      localStorage.setItem('country_id', country_id);
      if (dbcountry_name != 'india' && dbcountry_name != 'India' && dbcountry_name != 'INDIA' && this.interested_in === 'coworking') {
        this.router.navigate([`/${dbcountry_name.toLowerCase().trim()}/coworking/${city_name.toLowerCase().trim()}`]);
      }
      if (dbcountry_name != 'india' && dbcountry_name != 'India' && dbcountry_name != 'INDIA' && this.interested_in === 'coliving') {
        this.router.navigate([`/${dbcountry_name.toLowerCase().trim()}/co-living/${city_name.toLowerCase().trim()}`]);
      }
      if (dbcountry_name === 'india' || dbcountry_name === 'India' || dbcountry_name === 'INDIA') {
        this.navigationUrl = this.navigationUrl + city_name;
        this.router.navigate([`${this.navigationUrl.toLowerCase().trim()}`]);
      }
    } else {
      this.navigationUrl = this.navigationUrl + city_name;
      this.router.navigate([`${this.navigationUrl.toLowerCase().trim()}`]);
    }
    if (!this.isModalView && !city.Country) {
      // this.navigationUrl = this.navigationUrl + city_name;
      this.router.navigateByUrl(this.navigationUrl);
    }
  }
  removedash(name: string) {
    return name.replace(/-/, ' ')
  }

  onSearch() {
    if (this.enabledForm) {
      this.enquiryForm.markAllAsTouched();

      if (this.enquiryForm.invalid) {
        return;
      }

      if (!this.otpVerified) {
        this.getOtp();
      } else {
        this.onCloseEvent();
      }
    } else {
      this.onCloseEvent();
    }
  }

  onCloseEvent() {
    this.router.navigateByUrl(this.navigationUrl);
    this.closeModal();
  }

  getOtp() {
    if (this.ENQUIRY_STEP === ENQUIRY_STEPS.ENQUIRY) {
      this.loading = true;
      const formValues = this.enquiryForm.getRawValue();

      this.userService.addUserEnquiry(formValues).subscribe(
        () => {
          this.loading = false;
          this.ENQUIRY_STEP = ENQUIRY_STEPS.OTP;
          this.btnLabel = 'Verify OTP';
          // this.btnLabel = 'Submitting Enquiry...';
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
        this.loading = false;
        this.createLead();
      },
      error => {
        this.loading = false;
        this.toastrService.error(error.message || 'Something broke the server, Please try latter');
      },
    );
  }

  createLead() {
    const formValues = this.enquiryForm.getRawValue();
    const object = {
      user: {
        phone_number: formValues.phone_number,
        email: formValues.email,
        name: formValues.name,
        // org_name: formValues.org_name || null,
        // area_sqft: formValues.area_sqft || null,
      },
      interested_in: this.interested_in,
      city: this.cityName,
    };

    this.userService.createLead(object).subscribe(res => {
      this.toastrService.success(`Response Captured! We'll contact you in a short`);
      this.closeModal();
      this.router.navigate(['/thank-you'])
    });
  }

  addValidationOnOtpField() {
    const otpControl = this.enquiryForm.get('otp');
    otpControl.setValidators([Validators.required, Validators.minLength(4), Validators.maxLength(4)]);
    otpControl.updateValueAndValidity();
  }

  closeModal() {
    this.modalClose.emit(true);
  }
}
