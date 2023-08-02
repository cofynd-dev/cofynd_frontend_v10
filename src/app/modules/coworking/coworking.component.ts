import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { sanitizeParams } from '@app/shared/utils';
import { City } from '@core/models/city.model';
import { SeoSocialShareData } from '@core/models/seo.model';
import { ConfigService } from '@core/services/config.service';
import { SeoService } from '@core/services/seo.service';
import { environment } from '@env/environment';
import { AppConstant } from '@shared/constants/app.constant';
import { AVAILABLE_CITY } from '@core/config/cities';
import { Brand } from '@app/core/models/brand.model';
import { BrandService } from '@app/core/services/brand.service';
import { HomeMenuModalComponent } from '../home/home-menu-modal/home-menu-modal.component';
import { WorkSpaceService } from '@app/core/services/workspace.service';
import { ToastrService } from 'ngx-toastr';
import { CuratedCityPopupComponent } from '@app/shared/components/curated-city-popup/curated-city-popup.component';
import { Observable, Subscriber } from 'rxjs';
import { WorkSpace } from '@core/models/workspace.model';
import { forkJoin } from 'rxjs';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UserService } from '@app/core/services/user.service';
import { Enquiry } from '@app/core/models/enquiry.model';
import { AuthService } from '@app/core/services/auth.service';
import { CityService } from '@app/core/services/city.service';
import { CountryService } from '@app/core/services/country.service';

export enum ENQUIRY_STEPS {
  ENQUIRY,
  OTP,
  SUCCESS,
}

interface PopularSpace {
  name: string;
  address: string;
  image: string;
  id: string;
  slug?: string;
}

@Component({
  selector: 'app-coworking',
  templateUrl: './coworking.component.html',
  styleUrls: ['./coworking.component.scss'],
})
export class CoworkingComponent implements OnInit, OnDestroy {
  btnLabel = 'submit';
  ENQUIRY_STEPS: typeof ENQUIRY_STEPS = ENQUIRY_STEPS;
  ENQUIRY_STEP = ENQUIRY_STEPS.ENQUIRY;
  menuModalRef: BsModalRef;
  availableCities: City[] = AVAILABLE_CITY;
  coworkingBrands: Brand[] = [];
  cities: City[];
  popularCoWorkingSpaces: PopularSpace[] = [];
  loading = true;
  queryParams: { [key: string]: string | number };
  count = 0;
  showLoadMore: boolean;
  page = 1;
  loadMoreLoading: boolean;
  isMapView: boolean;
  scrollCount: number;
  isScrolled: boolean;
  isSearchFooterVisible: boolean;
  // Pagination
  maxSize = 10;
  totalRecords: number;
  seoData: SeoSocialShareData;
  latitute: any;
  longitute: any;
  workSpaces: WorkSpace[];
  pageTitle: string = 'Top CoWorking Spaces in India';
  resendDisabled = false;
  resendCounter = 30;
  resendIntervalId: any;
  gurugramSpaces: any = [];
  bangloreSpaces: any = [];
  hyderabadSpaces: any = [];
  puneSpaces: any = [];
  mumbaiSpaces: any = [];
  noidaSpaces: any = [];
  delhiSpaces: any = [];
  ahmedaSpaces: any = [];
  chennaiSpaces: any = [];
  indoreSpaces: any = [];
  submitted = false;
  contactUserName: string;
  showSuccessMessage: boolean;
  coworkingCities: any = [];
  colivingCities: any = [];
  finalCities: any = [];
  user: any;
  pageUrl: string;
  activeCountries: any = [];
  showcountry: boolean = false;
  selectedCountry: any = {};

  city = [
    {
      name: 'gurugram',
      img: 'gurgaon-ofcc.jpg',
      title: 'A Millennium City',
      seat: '131',
    },
    {
      name: 'bangalore',
      img: 'bangalore-ofcc.jpg',
      title: "India's Silicon Valley",
      seat: '259',
    },
    {
      name: 'delhi',
      img: 'delhi.jpg',
      title: 'The Nation Capital',
      seat: '131',
    },
    {
      name: 'noida',
      img: 'wtc.jpg',
      title: 'The Hitech City',
      seat: '53',
    },
    {
      name: 'hyderabad',
      img: 'hyderbad.jpg',
      title: 'The City of Pearls',
      seat: '79',
    },
    {
      name: 'mumbai',
      img: 'mumbai2.jpg',
      title: 'City of Dreams',
      seat: '90',
    },
    {
      name: 'pune',
      img: 'pune.jpg',
      title: 'Queen of Deccan',
      seat: '74',
    },
    {
      name: 'indore',
      img: 'indore.jpg',
      title: 'The Cleanest City',
      seat: '8',
    },
    {
      name: 'ahmedabad',
      img: 'ahemdabad.jpg',
      title: 'Manchester of India',
      seat: '10',
    },
    {
      name: 'kolkata',
      img: 'kolkata.jpg',
      title: 'City of Joy',
      seat: '14',
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

  chooseCoworking = [
    {
      icon: 'icons/brokerage-icon.svg',
      title: 'Zero Brokerage',
      description: 'Find a space on Cofynd is Fast, simple and Free',
    },
    {
      icon: 'icons/pricing-tag-icon.svg',
      title: 'Exclusive Pricing & Verified Spaces',
      description: 'Spaces Listed on cofynd have been verified by cofynd space team',
    },
    {
      icon: 'icons/pan-india-icon.svg',
      title: 'PAN India Coverage',
      description: 'We cover India like no one else, Office Spaces across all major Indian Cities',
    },
  ];

  coFyndAdvantages = [
    {
      icon: 'home/work-spaces.svg',
      title: '100,000+ Spaces',
      description:
        'Get access to 100,000+ spaces with easy availability and convenience anytime and anywhere. Space Search Made Simple with CoFynd',
    },
    {
      icon: 'icons/brokerage-icon.svg',
      title: 'Zero Brokerage',
      description:
        'CoFynd is India’s fastest growing space discovery platform that doesn’t charge any brokerage from the customers.',
    },
    {
      icon: 'home/support.svg',
      title: '100% Offline Support',
      description:
        'We provide you 100% offline support from giving you the various space options, scheduling the site visit, booking the space to the after-sales support also.',
    },
  ];

  constructor(
    private brandService: BrandService,
    private bsModalService: BsModalService,
    private configService: ConfigService,
    private seoService: SeoService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private workSpaceService: WorkSpaceService,
    private cdr: ChangeDetectorRef,
    private toastrService: ToastrService,
    private _formBuilder: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private cityService: CityService,
    private countryService: CountryService,
  ) {
    this.queryParams = { ...AppConstant.DEFAULT_SEARCH_PARAMS };
    this.isMapView = true;
    this.cities = AVAILABLE_CITY.filter(city => city.for_coWorking === true);
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
      this.enterpriseFormGroup.patchValue({ name, email, phone_number });
      this.selectedCountry['dial_code'] = this.user.dial_code;
    }
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
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.queryParams = { ...this.queryParams, ...params };
      this.page = params['page'] ? +params['page'] : 1;
      this.addSeoTags();
      this.getBrands();
    });
    this.getPopularWorSpacesAsCountry();
    let gurugramQueryParams = {
      limit: 8,
      city: '5e3eb83c18c88277e81427d9',
    };
    let bangaloreQueryParams = {
      limit: 8,
      city: '5f2a4210ecdb5a5d67f0bbbc',
    };
    let hyderabadQueryParams = {
      limit: 8,
      city: '5f338a5f59d5584617676837',
    };
    let puneQueryParams = {
      limit: 8,
      city: '5e3eb83c18c88277e8142795',
    };
    let mumbaiQueryParams = {
      limit: 8,
      city: '5f5b1f728bbbb85328976417',
    };
    let noidaQueryParams = {
      limit: 8,
      city: '5e3e77de936bc06de1f9a5e2',
    };
    let delhiQueryParams = {
      limit: 8,
      city: '5e3e77c6936bc06de1f9a2d9',
    };
    let ahmedabadQueryParams = {
      limit: 8,
      city: '5f7af1c48c4e6961990e620e',
    };
    let chennaiQueryParams = {
      limit: 8,
      city: '5f7410348c4e6961990e5a21',
    };
    let indoreQueryParams = {
      limit: 8,
      city: '5f60926926e9e64d7b61b41b',
    };
    const observables = [
      this.workSpaceService.getWorkspaces(sanitizeParams(gurugramQueryParams)),
      this.workSpaceService.getWorkspaces(sanitizeParams(bangaloreQueryParams)),
      this.workSpaceService.getWorkspaces(sanitizeParams(hyderabadQueryParams)),
      this.workSpaceService.getWorkspaces(sanitizeParams(puneQueryParams)),
      this.workSpaceService.getWorkspaces(sanitizeParams(mumbaiQueryParams)),
      this.workSpaceService.getWorkspaces(sanitizeParams(noidaQueryParams)),
      this.workSpaceService.getWorkspaces(sanitizeParams(delhiQueryParams)),
      this.workSpaceService.getWorkspaces(sanitizeParams(ahmedabadQueryParams)),
      this.workSpaceService.getWorkspaces(sanitizeParams(chennaiQueryParams)),
      this.workSpaceService.getWorkspaces(sanitizeParams(indoreQueryParams)),
    ];
    forkJoin(observables).subscribe((res: any) => {
      let gurugramData = res[0].data;
      let bangloreData = res[1].data;
      let hyderData = res[2].data;
      let puneData = res[3].data;
      let mumData = res[4].data;
      let noidaData = res[5].data;
      let delhiData = res[6].data;
      let ahmedaData = res[7].data;
      let chennaiData = res[8].data;
      let indoreData = res[9].data;
      this.gurugramSpaces = this.formatSpaces(gurugramData);
      this.bangloreSpaces = this.formatSpaces(bangloreData);
      this.hyderabadSpaces = this.formatSpaces(hyderData);
      this.puneSpaces = this.formatSpaces(puneData);
      this.mumbaiSpaces = this.formatSpaces(mumData);
      this.noidaSpaces = this.formatSpaces(noidaData);
      this.delhiSpaces = this.formatSpaces(delhiData);
      this.ahmedaSpaces = this.formatSpaces(ahmedaData);
      this.chennaiSpaces = this.formatSpaces(chennaiData);
      this.indoreSpaces = this.formatSpaces(indoreData);
    });
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
      mx_Space_Type: 'Web Coworking',
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

  formatSpaces(data) {
    let formattedData = [];
    for (let index = 0; index < data.length; index++) {
      let obj = {
        name: `${data[index].name} ${data[index].location.name}`,
        address: data[index].location.address1,
        image: data[index]['images'][0]['image']['s3_link'],
        slug: data[index]['slug'],
        starting: data[index]['starting_price'],
      };
      formattedData.push(obj);
    }
    return formattedData;
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
      this.workSpaces = allWorkSpaces.data;
      this.loading = false;
    });
  }

  routeTodetail(slug: string) {
    this.router.navigate([`/coworking/${slug}`]);
  }

  getBrands() {
    this.brandService.getBrands(sanitizeParams({ type: 'coworking' })).subscribe(res => {
      this.coworkingBrands = res.filter(
        brand => brand.name !== 'others' && brand.name !== 'AltF' && brand.name !== 'The Office Pass',
      );
    });
  }

  openWorkSpace(slug: string) {
    this.router.navigate([`/coworking/${slug.toLowerCase().trim()}`]);
  }

  addSeoTags() {
    this.seoService.getMeta('coworking').subscribe(seoMeta => {
      this.pageTitle = seoMeta.page_title;
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
    });
  }

  openModal(price) {
    this.bsModalService.show(CuratedCityPopupComponent, {
      class: 'modal-dialog-centered',
      initialState: {
        price,
      },
    });
  }

  openModalWithComponent(spaceType: string) {
    const initialState = {
      class: 'modal-dialog-centered',
    };
    initialState['enabledForm'] = true;
    initialState['space'] = spaceType;
    initialState['Interested_in'] = spaceType;
    this.menuModalRef = this.bsModalService.show(HomeMenuModalComponent, {
      initialState,
    });
  }

  searchCoworking() {
    this.getCurrentPosition().subscribe((position: any) => {
      this.router.navigateByUrl(`/search?coworking-latitude=${position.latitude}&longitude=${position.longitude}`);
    });
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  getPopularWorSpacesAsCountry() {
    this.workSpaceService
      .popularWorkSpacesCountryWise({ countryId: localStorage.getItem('country_id') })
      .subscribe(spaces => {
        this.popularCoWorkingSpaces = spaces;
        this.cdr.detectChanges();
      });
  }

  openCityListing(slug: any) {
    this.router.navigate(['coworking/' + slug.name]);
  }

  goToBrandPage(brand: Brand, isColiving = false) {
    if (isColiving) {
      this.router.navigate([`/brand/co-living/${brand.slug}`]);
      return;
    }
    this.router.navigate([`/brand/${brand.slug}`]);
  }

  ngOnDestroy() {
    this.configService.setDefaultConfigs();
  }

  scrollToElement(element: HTMLElement) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}
