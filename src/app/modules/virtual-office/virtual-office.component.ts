import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AVAILABLE_CITY_VIRTUAL_OFFICE } from '@app/core/config/cities';
import { SeoSocialShareData } from '@app/core/models/seo.model';
import { SeoService } from '@app/core/services/seo.service';
import { CuratedCityPopupComponent } from '@app/shared/components/curated-city-popup/curated-city-popup.component';
import { sanitizeParams } from '@app/shared/utils';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { VirtualOfficeModalComponent } from './virtual-office-modal/virtual-office-modal.component';
import { Observable, Subscriber } from 'rxjs';
import { WorkSpaceService } from '@app/core/services/workspace.service';
import { WorkSpace } from '@core/models/workspace.model';
import { environment } from '@env/environment';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UserService } from '@app/core/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Enquiry } from '@app/core/models/enquiry.model';
import { AuthService } from '@app/core/services/auth.service';
import { CityService } from '@app/core/services/city.service';
import { CountryService } from '@app/core/services/country.service';

export enum ENQUIRY_STEPS {
  ENQUIRY,
  OTP,
  SUCCESS,
}

@Component({
  selector: 'app-virtual-office',
  templateUrl: './virtual-office.component.html',
  styleUrls: ['./virtual-office.component.scss'],
})
export class VirtualOfficeComponent implements OnInit {
  menuModalRef: BsModalRef;
  loading: boolean;
  seoData: SeoSocialShareData;
  cities = AVAILABLE_CITY_VIRTUAL_OFFICE.filter(city => city.for_virtualOffice === true);
  service = [
    {
      title: 'Company Registration',
      description: 'Register your company in your desired city without having any physical address there.',
      icon: 'workspace/day-pass.svg',
    },
    {
      title: 'GST Registration',
      description: 'Get a GST number for your company with all documents like NOC, Signage, Electricity Bill & more.',
      icon: 'workspace/hot-desk.svg',
    },
    {
      title: 'Business Address',
      description:
        'Get your business address in the prestigious location and mention it on your visiting card and website.',
      icon: 'workspace/private-cabin.svg',
    },
    {
      title: 'Mailing Address',
      description:
        'Collect all couriers at your virtual office address and forwarded them to the address given by you.',
      icon: 'workspace/dedicated-desk.svg',
    },
    {
      title: 'Reception Services',
      description: 'Get reception services for client handling, guest greeting and customer support.',
      icon: 'amenities/reception.svg',
    },
    {
      title: 'Meeting Room Access',
      description: 'Get free complimentary hours of meeting rooms every month for client meetings.',
      icon: 'amenities/meeting-room.svg',
    },
  ];

  chooseVirtual = [
    {
      icon: 'icons/hassle-icon.svg',
      title: 'Hassle free experience. No follow-ups',
      description: '100% digital process with no running around for compliances',
    },
    {
      icon: 'icons/fasted-icon.svg',
      title: 'Fastest Document Delivery',
      description: 'Our average document delivery time is less than 3 working days',
    },
    {
      icon: 'icons/pan-india-icon.svg',
      title: 'PAN India Coverage',
      description: 'We cover India like no one else, Virtual Office across all major Indian Cities',
    },
  ];

  popularVirtualOffice = [
    {
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/8d5c421e7cb218a73798507ddaeb27964e7e3df9.jpg',
      name: 'Delhi',
      price: '15,000',
      slug: 'virtual-office/delhi',
    },
    {
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/e38aba6f636873daba5d3562f2705583cba27839.jpg',
      name: 'Gurugram',
      price: '14,000',
      slug: 'virtual-office/gurugram',
    },
    {
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/b8dffaef4e7bc6d43b24af2ce95def9ac5769631.jpg',
      name: 'Noida',
      price: '15,000',
      slug: 'virtual-office/noida',
    },
    {
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/6fc88348b18f4e1ccd4c276f339fcd34db5760ad.jpg',
      name: 'Bangalore',
      price: '15,000',
      slug: 'virtual-office/bangalore',
    },
    {
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/3bb526e232c21916cbe79664eb0acc86ef2a83c0.jpg',
      name: 'Hyderabad',
      price: '16,000',
      slug: 'virtual-office/hyderabad',
    },
    {
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/8069d9d3d68c32e73896f3c40b62ab34c87f5a9d.jpg',
      name: 'Mumbai',
      price: '24,000',
      slug: 'virtual-office/mumbai',
    },
    {
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/59fc8cbecde3c4a14320ab01a12b1c43945a7dea.jpg',
      name: 'Chennai',
      price: '16,000',
      slug: 'virtual-office/chennai',
    },
  ];

  latitute: any;
  longitute: any;
  workSpaces: WorkSpace[];
  submitted = false;
  finalCities: any = [];
  btnLabel = 'submit';
  ENQUIRY_STEPS: typeof ENQUIRY_STEPS = ENQUIRY_STEPS;
  ENQUIRY_STEP = ENQUIRY_STEPS.ENQUIRY;
  user: any;
  pageUrl: string;
  activeCountries: any = [];
  showcountry: boolean = false;
  selectedCountry: any = {};

  resendDisabled = false;
  resendCounter = 30;
  resendIntervalId: any;

  constructor(
    private bsModalService: BsModalService,
    private workSpaceService: WorkSpaceService,
    private seoService: SeoService,
    private router: Router,
    private _formBuilder: FormBuilder,
    private userService: UserService,
    private toastrService: ToastrService,
    private authService: AuthService,
    private cityService: CityService,
    private countryService: CountryService,
  ) {
    this.loading = true;
    this.getCurrentPosition().subscribe((position: any) => {
      this.latitute = position.latitude;
      this.longitute = position.longitude;
      let queryParams = {
        limit: 20,
        latitude: this.latitute,
        longitude: this.longitute,
      };
      this.loadWorkSpacesByLatLong(queryParams);
    });
    this.pageUrl = this.router.url;
    this.pageUrl = `https://cofynd.com${this.pageUrl}`;
    if (this.isAuthenticated()) {
      this.user = this.authService.getLoggedInUser();
    }
    if (this.user) {
      const { name, email, phone_number } = this.user;
      this.queryFormGroup.patchValue({ name, email, phone_number });
      this.selectedCountry['dial_code'] = this.user.dial_code;
    }
  }

  queryFormGroup: FormGroup = this._formBuilder.group({
    phone_number: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
    email: ['', [Validators.required, Validators.email]],
    name: ['', Validators.required],
    city: ['', Validators.required],
    requirements: [''],
    otp: [''],
  });

  get f(): { [key: string]: AbstractControl } {
    return this.queryFormGroup.controls;
  }

  get emailid() {
    return this.queryFormGroup.controls;
  }

  get mobno() {
    return this.queryFormGroup.controls;
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
    obj['phone_number'] = this.queryFormGroup.controls['phone_number'].value;
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
    this.addSeoTags();
  }

  getCurrentPosition(): any {
    return new Observable((observer: Subscriber<any>) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position: any) => {
          observer.next({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          observer.complete();
        });
      } else {
        observer.error();
      }
    });
  }

  loadWorkSpacesByLatLong(param: {}) {
    this.loading = true;
    this.workSpaceService.getWorkspaces(sanitizeParams(param)).subscribe(allWorkSpaces => {
      this.workSpaces = allWorkSpaces.data.filter(
        cat => cat.plans.filter(p => p.category === '6231bca42a52af3ddaa73ab1').length,
      );
      this.loading = false;
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.queryFormGroup.invalid) {
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
      const formValues: Enquiry = this.queryFormGroup.getRawValue();
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
    const phone = this.queryFormGroup.get('phone_number').value;
    const otp = this.queryFormGroup.get('otp').value;
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
    const otpControl = this.queryFormGroup.get('otp');
    otpControl.setValidators([Validators.required, Validators.minLength(4), Validators.maxLength(4)]);
    otpControl.updateValueAndValidity();
  }

  createEnquiry() {
    const phone = this.queryFormGroup.get('phone_number').value;
    let phoneWithDialCode = `${this.selectedCountry.dial_code}-${phone}`;
    const object = {
      user: {
        phone_number: phoneWithDialCode,
        email: this.queryFormGroup.controls['email'].value,
        name: this.queryFormGroup.controls['name'].value,
        requirements: this.queryFormGroup.controls['requirements'].value,
      },
      city: this.queryFormGroup.controls['city'].value,
      mx_Page_Url: this.pageUrl,
      mx_Space_Type: 'Web Virtual Office',
    };
    this.userService.createLead(object).subscribe(
      () => {
        this.loading = false;
        this.queryFormGroup.reset();
        this.submitted = false;
        this.router.navigate(['/thank-you']);
      },
      error => {
        this.loading = false;
      },
    );
  }

  removedash(name: string) {
    return name.replace(/-/, ' ');
  }

  openOfficeSpace(slug: string) {
    this.router.navigate([`/office-space/rent/${slug}`]);
  }

  openWithFreeSlug(slug: string) {
    this.router.navigate([`${slug}`]);
  }

  routeTodetail(slug: string) {
    this.router.navigate([`/coworking/${slug}`]);
  }

  openModal(price) {
    this.bsModalService.show(CuratedCityPopupComponent, {
      class: 'modal-dialog-centered',
      initialState: {
        price,
      },
    });
  }

  addSeoTags() {
    this.loading = true;
    this.seoService.getMeta('virtual-office').subscribe(seoMeta => {
      if (seoMeta) {
        this.seoData = {
          title: seoMeta.title,
          image: 'https://cofynd.com/assets/images/meta/cofynd-facebook.jpg',
          description: seoMeta.description,
          url: environment.appUrl + this.router.url,
          type: 'website',
          footer_title: seoMeta.footer_title,
          footer_description: seoMeta.footer_description,
        };
        this.seoService.setData(this.seoData);
      }
      this.loading = false;
    });
  }

  openModalWithComponent(spaceType: string) {
    const initialState = {
      class: 'modal-dialog-centered',
    };
    initialState['enabledForm'] = true;
    initialState['space'] = spaceType;
    initialState['Interested_in'] = spaceType;
    this.menuModalRef = this.bsModalService.show(VirtualOfficeModalComponent, {
      initialState,
    });
  }

  openWorkSpace(slug: string) {
    this.router.navigate([`/virtual-office/${slug.toLowerCase().trim()}`]);
  }

  scrollToElement(element: HTMLElement) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}
