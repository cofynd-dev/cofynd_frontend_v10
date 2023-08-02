import { HomeMenuModalComponent } from './home-menu-modal/home-menu-modal.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { SeoSocialShareData } from '@core/models/seo.model';
import { SeoService } from '@core/services/seo.service';
import { environment } from '@env/environment';
import { Router } from '@angular/router';
import { BrandService } from '@core/services/brand.service';
import { DOCUMENT } from '@angular/common';
import { NguCarousel, NguCarouselConfig, NguCarouselStore } from '@ngu/carousel';
import { CuratedCityPopupComponent } from '@app/shared/components/curated-city-popup/curated-city-popup.component';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UserService } from '@app/core/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '@app/core/services/auth.service';
import { Enquiry } from '@app/core/models/enquiry.model';
import { CityService } from '@app/core/services/city.service';
import { CountryService } from '@app/core/services/country.service';

interface PopularSpace {
  name: string;
  address: string;
  image: string;
  id: string;
  slug?: string;
}

export enum ENQUIRY_STEPS {
  ENQUIRY,
  OTP,
  SUCCESS,
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  menuModalRef: BsModalRef;
  seoData: SeoSocialShareData;
  coworkingImages: any = [];
  colivingImages: any = [];
  coworkingBrandAdsImages: any = [];
  colivingBrandAdsImages: any = [];
  finalCities: any = [];
  popularSpaceCarousel: NguCarousel<PopularSpace>;
  active = 0;
  submitted = false;
  btnLabel = 'submit';
  ENQUIRY_STEPS: typeof ENQUIRY_STEPS = ENQUIRY_STEPS;
  ENQUIRY_STEP = ENQUIRY_STEPS.ENQUIRY;

  carouselConfig: NguCarouselConfig = {
    grid: { xs: 1.4, sm: 1.4, md: 3, lg: 4, all: 0 },
    slide: 1,
    speed: 250,
    point: {
      visible: true,
    },
    interval: { timing: 4000, initialDelay: 1000 },
    load: 4,
    velocity: 0,
    touch: true,
    easing: 'cubic-bezier(0, 0, 0.2, 1)',
  };
  loading: boolean = true;
  contactUserName: any;
  showSuccessMessage: boolean;
  user: any;
  pageUrl: string;
  activeCountries: any = [];
  showcountry: boolean = false;
  selectedCountry: any = {};

  resendDisabled = false;
  resendCounter = 30;
  resendIntervalId: any;

  constructor(
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document,
    private brandService: BrandService,
    private seoService: SeoService,
    private bsModalService: BsModalService,
    private router: Router,
    private _formBuilder: FormBuilder,
    private userService: UserService,
    private toastrService: ToastrService,
    private authService: AuthService,
    private cityService: CityService,
    private countryService: CountryService,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.addSeoTags();
    this.setScript();
    this.getFeaturedImages();
    this.getBrandAdsImages();
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

  ngOnInit(): void {
    this.countryService.getCountryList().subscribe(countryList => {
      this.activeCountries = countryList;
      if (this.activeCountries && this.activeCountries.length > 0) {
        this.selectedCountry = this.activeCountries[0];
      }
    });
    this.cityService.getCityList().subscribe(cityList => {
      this.finalCities = cityList;
    });
    this.loopColivingSliders();
  }

  hideCountry(country: any) {
    this.selectedCountry = country;
    this.showcountry = false;
  }

  onSliderMove(slideData: NguCarouselStore) {
    this.active = slideData.currentSlide;
  }

  goToPrev() {
    this.popularSpaceCarousel.moveTo(this.active - 1);
  }

  goToNext() {
    this.popularSpaceCarousel.moveTo(this.active + 1);
  }

  removedash(name: string) {
    return name.replace(/-/, ' ');
  }

  openCoLivingSpace(slug: string) {
    this.router.navigate([`/co-living/${slug}`]);
  }

  openWorkSpace(slug: string) {
    this.router.navigate([`/coworking/${slug.toLowerCase().trim()}`]);
  }

  popularCoLivingSpaces = [
    {
      name: 'Bangalore',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/f81fe9b1a46d8fd9658cd5b0dcb3bd0939a2d280.jpg',
      slug: 'bangalore',
      address: "India's Silicon Valley",
    },
    {
      name: 'Hyderabad',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/982cbdfd30aa937b17c1c2e78d004f762e2eba3b.jpg',
      slug: 'hyderabad',
      address: 'A City of Nawabs',
    },
    {
      name: 'Gurugram',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/8bca176f399f5a9323ba86cd37a0466e81e74b49.jpg',
      slug: 'gurugram',
      address: 'A Millennium City',
    },
    {
      name: 'Pune',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/a1898ea4ba525ab2083d5a65fc029c30b4f9b16d.jpg',
      slug: 'pune',
      address: 'Queen of the Deccan',
    },

    {
      name: 'Mumbai',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/9b5dc544341221b96035907ff7c60710f0c2ba13.jpg',
      slug: 'mumbai',
      address: 'A City of Dreams',
    },

    {
      name: 'Delhi',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/6e985d7ed0a199d4c7d6f08e3562c2329365c403.jpg',
      slug: 'delhi',
      address: 'The Nation Capital',
    },

    {
      name: 'Noida',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/5d5bccbd166e278cdc3200d4ec12a8af9fa4b5ec.jpg',
      slug: 'noida',
      address: 'The Hitech City',
    },
  ];

  enterpriseFormGroup: FormGroup = this._formBuilder.group({
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

  loopColivingSliders() {
    let combinedArray = [];
    for (let index = 0; index < this.popularCoLivingSpaces.length * 4; index++) {
      combinedArray.push(this.popularCoLivingSpaces);
    }
    this.popularCoLivingSpaces = [].concat.apply([], combinedArray);
  }

  getFeaturedImages() {
    this.brandService.getFeaturedImages().subscribe((res: any) => {
      this.coworkingImages = res.filter(city => city.for_coWorking === true);
      this.colivingImages = res.filter(city => city.for_coLiving === true);
    });
  }

  getBrandAdsImages() {
    this.brandService.getBrandAdsImages().subscribe((res: any) => {
      this.coworkingBrandAdsImages = res.filter(city => city.for_coWorking === true);
      this.colivingBrandAdsImages = res.filter(city => city.for_coLiving === true);
    });
  }

  setScript() {
    let script = this._renderer2.createElement('script');
    script.type = `application/ld+json`;
    script.text = `{
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "CoFynd",
      "url": "https://cofynd.com/",
      "logo": "https://cofynd.com/assets/images/logo.svg",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "9355489999",
        "contactType": "sales",
        "areaServed": "IN",
        "availableLanguage": "en"
      },
      "sameAs": [
        "https://facebook.com/cofynd",
        "https://instagram.com/cofynd",
        "https://linkedin.com/company/cofynd1",
        "https://www.youtube.com/channel/UCnr7dufMlNHG5o7X7tJMVWA",
        "https://en.wikipedia.org/wiki/CoFynd",
        "https://cofynd.com/"
      ]
    }`;
    this._renderer2.appendChild(this._document.body, script);
  }

  openModal(price) {
    this.bsModalService.show(CuratedCityPopupComponent, {
      class: 'modal-dialog-centered',
      initialState: {
        price,
      },
    });
  }

  openModalWithComponent(openForDayPass = false) {
    if (openForDayPass) {
      const initialState = {
        dayPassPopUp: true,
        class: 'modal-dialog-centered',
      };
      this.menuModalRef = this.bsModalService.show(HomeMenuModalComponent, {
        initialState,
      });
      return;
    }

    this.menuModalRef = this.bsModalService.show(HomeMenuModalComponent, {
      class: 'modal-dialog-centered',
    });
  }

  openModalWithComponent2(spaceType: string) {
    const initialState = {
      class: 'modal-dialog-centered',
    };
    // will disable
    initialState['enabledForCustomizeOffice'] = false;
    initialState['virArtShoot'] = false;
    //

    initialState['enabledForm'] = true;
    initialState['space'] = spaceType;
    initialState['Interested_in'] = spaceType;

    this.menuModalRef = this.bsModalService.show(HomeMenuModalComponent, {
      initialState,
    });
  }

  addSeoTags() {
    this.seoService.getMeta('home').subscribe(seoMeta => {
      this.seoData = {
        title: seoMeta.title,
        image: 'https://cofynd.com/assets/images/meta/cofynd-facebook.jpg',
        description: seoMeta.description,
        url: environment.appUrl,
        type: 'website',
        footer_description: seoMeta.footer_description,
      };
      this.seoService.setData(this.seoData);
    });
  }

  openAdd() {
    this.router.navigate([`enterprise`]);
  }
}
