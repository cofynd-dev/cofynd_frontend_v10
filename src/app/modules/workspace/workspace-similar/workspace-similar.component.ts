import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  HostListener,
  Inject,
  Input,
  OnInit,
  PLATFORM_ID,
  Pipe,
  PipeTransform,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Enquiry } from '@app/core/models/enquiry.model';
import { AuthService } from '@app/core/services/auth.service';
import { CountryService } from '@app/core/services/country.service';
import { UserService } from '@app/core/services/user.service';
import { sanitizeParams } from '@app/shared/utils';
import { WorkSpace } from '@core/models/workspace.model';
import { WorkSpaceService } from '@core/services/workspace.service';
import { environment } from '@env/environment';
import { NguCarousel, NguCarouselConfig, NguCarouselStore } from '@ngu/carousel';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';

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

@Component({
  selector: 'app-workspace-similar',
  templateUrl: './workspace-similar.component.html',
  styleUrls: ['./workspace-similar.component.scss'],
})
export class WorkspaceSimilarComponent implements OnInit {
  loading: boolean;
  @Input() address: string;
  @Input() workSpaceId: string;

  workSpaces: WorkSpace[] = [];

  @ViewChild('similarCarousel', { static: false })
  similarCarousel: NguCarousel<WorkSpace>;
  active = 0;

  carouselConfig: NguCarouselConfig = {
    grid: { xs: 1.2, sm: 2.6, md: 3, lg: 3, all: 0 },
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
  minPrice: string;
  maxPrice: string;

  activeCountries: any = [];
  inActiveCountries: any = [];
  showcountry: boolean = false;
  selectedCountry: any = {};

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
  city: string;

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
    private workSpaceService: WorkSpaceService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder,
    private countryService: CountryService,
  ) {
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
    this.pageName = url[1];
  }

  ngOnInit() {
    this.countryService.getCountryList().subscribe(countryList => {
      this.activeCountries = countryList;
    });
    this.minPrice = localStorage.getItem('minPrice');
    this.maxPrice = localStorage.getItem('maxPrice');
    this.loadWorkSpaces();
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

  getQuote(workspace: any) {
    localStorage.setItem('property_url', `https://cofynd.com/coworking/${workspace.slug}`);
    if (workspace.location.city.name) {
      this.city = workspace.location.city.name;
    }
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
    form['mx_Space_Type'] = ['Web Office Space'];
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

  openDetailsPage(slug) {
    let country = localStorage.getItem('country_name');
    if (country == 'india' || country == 'India' || country == 'INDIA') {
      this.router.navigate([`/coworking/${slug.toLowerCase().trim()}`]);
    } else {
      var url = `/${country}/coworking-details/${slug.toLowerCase().trim()}`;
      this.router.navigate([url]);
      // window.open(url, "_blank")
    }
  }

  loadWorkSpaces() {
    const address = this.address.replace('#', '');
    this.loading = true;
    var queryParam = {};
    if (this.minPrice && this.maxPrice) {
      queryParam = {
        limit: 9,
        key: address,
        minPrice: +this.minPrice,
        maxPrice: +this.maxPrice,
      };
    } else {
      queryParam = { limit: 9, key: address };
    }
    this.workSpaceService
      .getWorSpacesByAddress(sanitizeParams(queryParam))
      .pipe(
        map(workspaces => {
          return workspaces.data.filter(workspace => workspace.id !== this.workSpaceId);
        }),
      )
      .subscribe(filteredWorkspaces => {
        this.workSpaces = filteredWorkspaces;
        this.loading = false;
        this.cdr.detectChanges();
      });
  }

  onSliderMove(slideData: NguCarouselStore) {
    this.active = slideData.currentSlide;
  }

  goToPrev() {
    this.similarCarousel.moveTo(this.active - 1);
  }

  goToNext() {
    this.similarCarousel.moveTo(this.active + 1);
  }

  sendGaEvent(category: string, action: string, label: string) {
    if (environment.options.GA_ENABLED && isPlatformBrowser(this.platformId)) {
      ga('send', 'event', category, action, label);
    }
  }
}

// custom Pipe for eliminate city name from address
@Pipe({ name: 'microLocation' })
export class MicroLocationPipe implements PipeTransform {
  transform(value): string {
    let splitData = value.split(',');
    splitData.splice(-1);
    return splitData;
  }
}
