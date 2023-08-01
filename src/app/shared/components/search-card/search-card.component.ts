import { NguCarousel, NguCarouselConfig, NguCarouselStore } from '@ngu/carousel';
import { environment } from '@env/environment';
import { AuthService } from '@core/services/auth.service';
import {
  Component,
  Input,
  ChangeDetectorRef,
  AfterViewInit,
  ChangeDetectionStrategy,
  ViewChild,
  HostListener,
  Inject,
  PLATFORM_ID,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { WorkSpace } from '@app/core/models/workspace.model';
import { UserService } from '@core/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { AuthType } from '@app/core/enum/auth-type.enum';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Enquiry } from '@app/core/models/enquiry.model';
import { CountryService } from '@app/core/services/country.service';
declare var $: any;
declare let ga: any;

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

interface ImageGallery {
  id: number;
  name?: string;
  extension?: string;
  label?: string;
  category?: string;
  title?: string;
}

@Component({
  selector: 'app-search-card',
  templateUrl: './search-card.component.html',
  styleUrls: ['./search-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchCardComponent implements OnInit, AfterViewInit {
  S3_URL = environment.images.S3_URL;
  @Input() workspace: WorkSpace;
  @Input() city: string;
  @Input() locality: string;
  @Input() forAll: boolean;

  @ViewChild('imageGalleryCarousel', { static: true })
  imageGalleryCarousel: NguCarousel<ImageGallery>;

  carouselTile: NguCarouselConfig = {
    grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
    slide: 1,
    speed: 600,
    point: {
      visible: true,
    },
    load: 5,
    velocity: 0,
    touch: true,
    loop: true,
    easing: 'cubic-bezier(0, 0, 0.2, 1)',
  };

  showcountry: boolean = false;
  selectedCountry: any = {};
  activeCountries: any = [];
  resendDisabled = false;
  resendCounter = 30;
  resendIntervalId: any;
  ENQUIRY_STEPS: typeof ENQUIRY_STEPS = ENQUIRY_STEPS;
  ENQUIRY_TYPES: typeof ENQUIRY_TYPES = ENQUIRY_TYPES;
  ENQUIRY_STEP = ENQUIRY_STEPS.ENQUIRY;
  btnLabel = 'submit';
  enquiryForm: FormGroup;
  user: any;
  pageName: string;
  loading: boolean;
  isMobileResolution: boolean;
  activeSliderItem: number;

  coworkingPlans = [
    { label: 'Hot Desk', value: 'hot-desk' },
    { label: 'Dedicated Desk', value: 'dedicated-desk' },
    { label: 'Private Cabin', value: 'private-cabin' },
    { label: 'Virtual Office', value: 'virtual-office' },
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

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private userService: UserService,
    private authService: AuthService,
    private toastrService: ToastrService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private countryService: CountryService,
  ) {
    // initial set activeSliderItem to 0 otherwise not work because of undefined value
    this.activeSliderItem = 0;
    this.buildForm();
    if (this.isAuthenticated()) {
      this.user = this.authService.getLoggedInUser();
    }
    if (this.user) {
      const { name, email, phone_number } = this.user;
      this.enquiryForm.patchValue({ name, email, phone_number });
      this.selectedCountry['dial_code'] = this.user.dial_code;
    }
    let url = this.router.url.split('/');
    var parts = url;
    this.city = parts[parts.length - 1];
    this.pageName = url[1];
  }

  ngOnInit(): void {
    this.countryService.getCountryList().subscribe(countryList => {
      this.activeCountries = countryList;
      if (this.activeCountries && this.activeCountries.length > 0) {
        this.selectedCountry = this.activeCountries[0];
      }
    });
    if (window.innerWidth < 768) {
      this.isMobileResolution = true;
    } else {
      this.isMobileResolution = false;
    }
  }

  dismissModal(): void {
    $('#exampleModal').modal('hide');
  }

  private resetForm() {
    this.enquiryForm.reset();
  }

  private isAuthenticated() {
    return this.authService.getToken();
  }

  getQuote(slug: any) {
    localStorage.setItem('property_url', `https://cofynd.com/coworking/${slug}`);
  }

  hideCountry(country: any) {
    this.selectedCountry = country;
    this.showcountry = false;
  }

  @HostListener('window:resize', ['$event'])
  onResize($event: Event): void {
    this.ngOnInit();
  }

  private buildForm() {
    const form = {
      name: ['', Validators.required],
      email: ['', Validators.required],
      phone_number: ['', Validators.required],
      otp: [''],
      mx_Page_Url: ['City Page'],
    };
    form['mx_Space_Type'] = ['Web Coliving'];
    form['mx_Move_In_Date'] = [null, Validators.required];
    form['no_of_person'] = [null, Validators.required];
    form['interested_in'] = [null, Validators.required];
    this.enquiryForm = this.formBuilder.group(form);
  }

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

  async createEnquiry() {
    try {
      this.loading = true;
      const formValues: Enquiry = this.enquiryForm.getRawValue();
      const phone = this.enquiryForm.get('phone_number').value;
      formValues['phone_number'] = `${this.selectedCountry.dial_code}-${phone}`;
      formValues['mx_Space_Type'] = 'Web Coworking';
      formValues['mx_Page_Url'] = localStorage.getItem('property_url');
      formValues['city'] = this.city;
      this.btnLabel = 'Submitting...';
      this.userService.createEnquiry(formValues).subscribe(
        () => {
          this.loading = false;
          this.ENQUIRY_STEP = ENQUIRY_STEPS.SUCCESS;
          this.sendGaEvent('ENQUIRY_FORM_SUBMIT', 'click', 'FORM_SUBMIT');
          this.resetForm();
          this.dismissModal();
          localStorage.removeItem('property_url');
          this.router.navigate(['/thank-you']);
        },
        error => {
          this.loading = false;
          this.toastrService.error(error.message || 'Something broke the server, Please try latter');
        },
      );
    } catch (error) {
      this.loading = false;
      this.toastrService.error(error.message || 'Something broke the server, Please try again later');
    }
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

  sendGaEvent(category: string, action: string, label: string) {
    if (environment.options.GA_ENABLED && isPlatformBrowser(this.platformId)) {
      ga('send', 'event', category, action, label);
    }
  }

  openWorkSpace(workspace) {
    localStorage.setItem('country_name', workspace.country_dbname);
    localStorage.setItem('country_id', workspace.location.country);
    if (
      (workspace.country_dbname == 'india' ||
        workspace.country_dbname == 'India' ||
        workspace.country_dbname == 'INDIA' ||
        workspace.location.country.name == 'India') &&
      workspace.plans
    ) {
      const url = this.router.serializeUrl(this.router.createUrlTree([`/coworking/${workspace.slug}`]));
      if (this.isMobileResolution) {
        this.router.navigate([url]);
      } else {
        window.open(url, '_blank');
      }
    }
    if (
      workspace.country_dbname !== 'india' &&
      workspace.country_dbname !== 'India' &&
      workspace.country_dbname !== 'INDIA' &&
      workspace.location.country.name !== 'India' &&
      workspace.plans
    ) {
      let country_name;
      if (workspace.country_dbname) {
        country_name = workspace.country_dbname;
      } else {
        country_name = workspace.location.country.name;
      }
      var url = `/${country_name.toLowerCase().trim()}/coworking-details/${workspace.slug.toLowerCase().trim()}`;
      if (this.isMobileResolution) {
        this.router.navigate([url]);
      } else {
        window.open(url, '_blank');
      }
    }

    if (
      (workspace.country_dbname == 'india' ||
        workspace.country_dbname == 'India' ||
        workspace.country_dbname == 'INDIA' ||
        workspace.location.country.name == 'India') &&
      workspace.coliving_plans
    ) {
      const url = this.router.serializeUrl(this.router.createUrlTree([`/co-living/${workspace.slug}`]));
      if (this.isMobileResolution) {
        this.router.navigate([url]);
      } else {
        window.open(url, '_blank');
      }
    }

    if (
      workspace.country_dbname !== 'india' &&
      workspace.country_dbname !== 'India' &&
      workspace.country_dbname !== 'INDIA' &&
      workspace.location.country.name !== 'India' &&
      workspace.coliving_plans
    ) {
      let country_name;
      if (workspace.country_dbname) {
        country_name = workspace.country_dbname;
      } else {
        country_name = workspace.location.country.name;
      }
      var url = `/${country_name.toLowerCase().trim()}/co-living-details/${workspace.slug.toLowerCase().trim()}`;
      if (this.isMobileResolution) {
        this.router.navigate([url]);
      } else {
        window.open(url, '_blank');
      }
    }
  }

  openDetailsPage(workspace) {
    localStorage.setItem('country_name', workspace.country_dbname);
    localStorage.setItem('country_id', workspace.location.country);
    if (
      workspace.country_dbname == 'india' ||
      workspace.country_dbname == 'India' ||
      workspace.country_dbname == 'INDIA'
    ) {
      this.router.navigate([`/coworking/${workspace.slug.toLowerCase().trim()}`]);
    } else {
      var url = `/${workspace.country_dbname
        .toLowerCase()
        .trim()}/coworking-details/${workspace.slug.toLowerCase().trim()}`;
      this.router.navigate([url]);
    }
  }

  markAsFavorite(isFavorite: boolean) {
    if (!this.authService.getToken()) {
      this.authService.openAuthDialog(AuthType.LOGIN);
      return;
    }

    this.loading = true;
    this.userService.addToFavorite(this.workspace.id, !isFavorite).subscribe(
      () => {
        this.loading = false;
        this.workspace.is_favorite = !isFavorite;
        this.toastrService.success(
          `${this.workspace.name} is ${!isFavorite ? 'added to' : 'removed from'} your favorites list`,
          'Favorites Updated',
        );
      },
      error => {
        this.loading = false;
      },
    );
  }

  onSliderMove(slideData: NguCarouselStore) {
    this.activeSliderItem = slideData.currentSlide;
  }

  goToPrev() {
    this.imageGalleryCarousel.moveTo(this.activeSliderItem - 1);
  }

  goToNext() {
    this.imageGalleryCarousel.moveTo(this.activeSliderItem + 1);
  }

  onChangeSliderCategory(id: number) {
    this.imageGalleryCarousel.moveTo(id);
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }
}
