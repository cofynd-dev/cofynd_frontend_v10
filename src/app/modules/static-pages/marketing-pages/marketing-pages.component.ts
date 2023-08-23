import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  Component,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { DEFAULT_APP_DATA } from '@core/config/app-data';
import { Brand } from '@core/models/brand.model';
import { BrandService } from '@core/services/brand.service';
import { HelperService } from '@core/services/helper.service';
import { SeoService } from '@core/services/seo.service';
import { NguCarousel, NguCarouselConfig } from '@ngu/carousel';
import { USER_REVIEWS } from '@core/config/reviews';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Enquiry } from '@core/models/enquiry.model';
import { AuthService } from '@core/services/auth.service';
import { UserService } from '@core/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { CityService } from '@app/core/services/city.service';
import { CountryService } from '@app/core/services/country.service';

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

interface MarketingPlan {
  name: string;
  description: string;
  price: number;
  type: 'day' | 'month' | 'hr';
}

interface Review {
  name: string;
  review: string;
  image?: string;
}

@Component({
  selector: 'app-marketing-pages',
  templateUrl: './marketing-pages.component.html',
  styleUrls: ['./marketing-pages.component.scss'],
})
export class MarketingPagesComponent implements OnInit, AfterViewInit, OnDestroy {
  supportPhone = DEFAULT_APP_DATA.contact.phone;
  marketingData: any;
  plans: MarketingPlan[];
  isSticky: boolean;
  isEnquireModal: boolean;
  brands: Brand[] = [];

  reviews: Review[] = USER_REVIEWS;
  active = 0;

  @ViewChild('reviewsCarousel', { static: true })
  reviewsCarousel: NguCarousel<Review>;
  carouselConfig: NguCarouselConfig;

  enquiryForm: FormGroup;
  loading: boolean;
  user: any;
  phoneflag: boolean = true;
  ENQUIRY_STEPS: typeof ENQUIRY_STEPS = ENQUIRY_STEPS;
  ENQUIRY_TYPES: typeof ENQUIRY_TYPES = ENQUIRY_TYPES;
  ENQUIRY_STEP = ENQUIRY_STEPS.ENQUIRY;
  btnLabel = 'submit';

  pageName: string;
  pageUrl: string;
  city: string;
  showcountry: boolean = false;
  selectedCountry: any = {};

  resendDisabled = false;
  resendCounter = 30;
  resendIntervalId: any;
  activeCountries: any = [];
  finalCities: any = [];
  submitted: boolean;
  contactUserName: any;
  showSuccessMessage: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(DOCUMENT) private document: Document,
    private helperService: HelperService,
    private seoService: SeoService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private brandService: BrandService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private toastrService: ToastrService,
    private cityService: CityService,
    private countryService: CountryService,
  ) {
    this.plans = this.getPlans();
    this.carouselConfig = {
      grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
      speed: 500,
      point: {
        visible: true,
      },
      touch: true,
      loop: true,
      interval: { timing: 4000 },
      animation: 'lazy',
    };
    if (DEFAULT_APP_DATA.marketing.coworking) {
      // this.marketingData = DEFAULT_APP_DATA.marketing.coworking.find((X: any) => X.url == url);
    }
    if (router.url.search(/co-living/i) != -1) {
      this.phoneflag = false;
    }
    if (this.isAuthenticated()) {
      this.user = this.authService.getLoggedInUser();
    }
    this.pageUrl = this.router.url;
    let url = this.router.url.split('/');
    var parts = url;
    this.city = parts[parts.length - 1];
    this.pageName = url[1];
    this.pageUrl = `https://cofynd.com${this.pageUrl}`;
  }

  hideCountry(country: any) {
    this.selectedCountry = country;
    this.showcountry = false;
  }

  enterpriseFormGroup: FormGroup = this.formBuilder.group({
    phone_number: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
    email: ['', [Validators.required, Validators.email]],
    name: ['', Validators.required],
    interested_in: ['', Validators.required],
    city: ['', Validators.required],
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
      this.ENQUIRY_STEP = ENQUIRY_STEPS.OTP;
      this.btnLabel = 'Verify OTP';
      this.addValidationOnOtpField();
      const formValues: Enquiry = this.enterpriseFormGroup.getRawValue();
      formValues['dial_code'] = this.selectedCountry.dial_code;
      this.userService.addUserEnquiry(formValues).subscribe(
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
    } else {
      this.validateOtp();
    }
  }

  validateOtp() {
    const phone = this.enterpriseFormGroup.controls['phone_number'].value;
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

  resendOTP() {
    this.resendDisabled = true;
    this.resendIntervalId = setInterval(() => {
      this.resendCounter--;
      if (this.resendCounter === 0) {
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

  addValidationOnOtpField() {
    const otpControl = this.enterpriseFormGroup.get('otp');
    otpControl.setValidators([Validators.required, Validators.minLength(4), Validators.maxLength(4)]);
    otpControl.updateValueAndValidity();
  }

  createEnquiry() {
    this.loading = true;
    let mx_Space_Type = '';
    this.btnLabel = 'Submitting...';
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
        this.router.navigate(['/thank-you']);
      },
      error => {
        this.loading = false;
        this.toastrService.error(error.message);
      },
    );
  }

  primeLocation = [
    {
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/2878c50fff7c1deeb3e6a8a958dce4bdd8cbf142.jpg',
      title: 'Udyog Vihar',
      price: '₹ 5,499*',
      class: 'card_details card-bg1',
    },
    {
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/0a78af7a648f1a981f451a869b24ef51d95a5f0e.jpg',
      title: 'Sohna Road',
      price: '₹ 5,999*',
      class: ' card_details card-bg2',
    },
    {
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/e9a6c707ba63ad6d3a0e0c1f5e7d9e70962ecc77.jpg',
      title: 'Golf Course Road',
      price: '₹ 9,999*',
      class: 'card_details card-bg3',
    },
    {
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/a2c43ad6ad92696e72063cccb3bc97db2860d70d.jpg',
      title: 'MG Road',
      price: '₹ 9,999*',
      class: 'card_details card-bg4',
    },
    {
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/389792781e667952808fc04215d3b1392c628f54.jpg',
      title: 'Golf Course Extension',
      price: '₹ 5,499*',
      class: 'card_details card-bg1',
    },
    {
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/252d462d4b7e583cf6f32608f83216531cfd8b49.jpg',
      title: 'Huda City Sector 44',
      price: '₹ 8,999*',
      class: 'card_details card-bg2',
    },
    {
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/426ce706a0f96b0c0b48956f38a2f142b55ef355.jpg',
      title: 'DLF Cyber City',
      price: '₹ 19,499*',
      class: 'card_details card-bg3',
    },
    {
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/4aef1a1246000187c398e77e0c832ef5fe27b88d.jpg',
      title: 'DLF / Sushant Lok',
      price: '₹ 7,999*',
      class: 'card_details card-bg4',
    },
  ];

  service = [
    {
      title: 'High Speed WiFi',
      description: 'High-Speed Wifi, HDTVs everything you need to do your best work.',
      icon: 'amenities/wifi.svg',
    },
    {
      title: 'Comfy Workstation',
      description: 'Connect with other people and share your skills for better and quick growth.',
      icon: 'amenities/workstation.svg',
    },
    {
      title: 'Meeting Rooms',
      description: 'Come up with great ideas and engage in valuable discussions in meeting rooms.',
      icon: 'amenities/meeting-room.svg',
    },
    {
      title: 'Printer',
      description: 'Printing and scanning facilities available without any extra cost.',
      icon: 'amenities/printer.svg',
    },

    {
      title: 'Pantry',
      description: 'Lounge, kitchen, breakout rooms, and more. mix of both work tables and lounge seating.',
      icon: 'amenities/kitchen.svg',
    },
    {
      title: 'Parking',
      description: 'Avoid morning hassle with easy and convenient parking area availability.',
      icon: 'amenities/parking-icon.svg',
    },
  ];

  solutions = [
    {
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/eae547550aca51cb96290b8ad4a8e8e0fec635c4.jpg',
      title: 'Fixed Desks',
      tagline: 'Your dedicated desk, personalized for productivity',
      class: 'card_details card-bg1',
    },
    {
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/1297819e3de5d392ccca9e3aa84eb5d26b739aed.jpg',
      title: 'Private Cabins',
      tagline: 'Secluded productivity in your own private cabin',
      class: 'card_details card-bg2',
    },
    {
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/411c78d656bd1b4b87aef7b7372ec2a8644bad88.jpg',
      title: 'Virtual Office',
      tagline: 'Elevate your business presence with a virtual office',
      class: 'card_details card-bg3',
    },
    {
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/1763020ba24780f224150cbf93b6846097ef98ec.jpg',
      title: 'Customized Offices',
      tagline: 'Tailored spaces, designed for your unique vision',
      class: 'card_details card-bg4',
    },
  ];

  // coworkingPlan = [
  //   {
  //     icon:
  //       'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/9e7314cec45e4d42fd21a06f7b2d9bbaac8f6723.png',
  //     title: 'Dedicated Desk',
  //     description: 'A fixed desk in a shared coworking space.',
  //     price: '₹5,999/-',
  //   },
  //   {
  //     icon:
  //       'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/49320cf2159712b18c1a11e03dad22cba5f9eeb2.png',
  //     title: 'Private Cabin',
  //     description: 'Private office space dedicated to you and your team.',
  //     price: '₹30,000/-',
  //   },
  //   {
  //     icon:
  //       'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/f662ce1dc8eb619a12b3ccadff954a0a69c74c59.png',
  //     title: 'Virtual Office',
  //     description: 'Build your company presence with virtual office',
  //     price: '₹16,000/-',
  //   },
  // ];

  // coworkingPartners = [
  //   {
  //     image:
  //       'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/93f7fa099b87eccf93812fbff5d13f83a2cc487a.png',
  //     title: 'WeWork',
  //   },
  //   {
  //     image:
  //       'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/24d34a77dafecc24635767dee0ae7fd250cb3649.jpg',
  //     title: 'Awfis',
  //   },
  //   {
  //     image:
  //       'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/9c0c2a58819ef996fd210b7cad122dd15d761ed0.png',
  //     title: 'Innov8',
  //   },
  //   {
  //     image:
  //       'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/17870b28354c41ede388e5c30c67d196cfb05f08.png',
  //     title: 'Insta Office',
  //   },
  //   {
  //     image:
  //       'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/eacb58c29322fa81ce2b6cae4fe680c257bce084.png',
  //     title: 'AltF',
  //   },
  //   {
  //     image:
  //       'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/9d0d32fd1a689722ed5f719d9eab7dbbceeff9f5.png',
  //     title: '91 Springboard',
  //   },
  //   {
  //     image:
  //       'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/757d099b5bf39eeab60401f5a76f8d3c34f875aa.jpg',
  //     title: 'Bhive',
  //   },
  //   {
  //     image:
  //       'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/31965e7c65101640fa945260d7fc2d2430a5b5fd.jpg',
  //     title: 'Indiqube',
  //   },
  // ];

  ngOnInit() {
    this.addSeoTags();
    this.getBrands();
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

  addSeoTags() {
    this.seoService.setData(this.marketingData.seoData);
    this.seoService.addNoFollowTag();
  }

  getBrands() {
    this.brandService.getBrands().subscribe(allBrand => {
      this.brands = allBrand.filter(brand => brand.name !== 'others');
    });
  }

  goToBrandPage(brand: Brand) {
    this.router.navigate([`/brand/${brand.slug}`]);
  }

  getPlans(): MarketingPlan[] {
    return [
      {
        name: 'Day Pass',
        description: 'Book and experience the un-conventional work culture',
        price: 300,
        type: 'day',
      },
      {
        name: 'Open Desk',
        description: 'Choose and work at any desk within the community area',
        price: 4500,
        type: 'month',
      },
      {
        name: 'Dedicated Desk',
        description: 'A fixed desk in a shared coworking space',
        price: 5500,
        type: 'month',
      },
      {
        name: 'Private Cabin',
        description: 'Private office space dedicated to you and your team',
        price: 30000,
        type: 'month',
      },
      {
        name: 'Virtual office',
        description: 'Office space for larger teams with their own reception',
        price: 2000,
        type: 'month',
      },
      {
        name: 'Meeting Rooms',
        description: 'Office space for larger teams with their own reception',
        price: 400,
        type: 'hr',
      },
    ];
  }

  closeEnquireModel() {
    this.isEnquireModal = false;
  }

  openEnquireModal() {
    this.isEnquireModal = true;
  }

  @HostListener('document:scroll', ['$event'])
  onWindowScroll(event): void {
    if (isPlatformBrowser(this.platformId) && !this.helperService.getIsMobileMode()) {
      const windowOffsetTop =
        window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
      if (windowOffsetTop >= 750) {
        this.isSticky = true;
      } else {
        this.isSticky = false;
      }
    }
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.seoService.removeNoFollowTag();
  }

  scrollEnq() {
    document.getElementById('enqBtn').scrollIntoView();
  }
}
