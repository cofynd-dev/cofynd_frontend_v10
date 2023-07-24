import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { OfficeSpace } from '@core/models/office-space.model';
import { NguCarousel, NguCarouselConfig, NguCarouselStore } from '@ngu/carousel';
import { intToOrdinalNumberString } from '@app/shared/utils';
import { Enquiry } from '@core/models/enquiry.model';
import { UserService } from '@app/core/services/user.service';
import { AuthService } from '@app/core/services/auth.service';
import { WorkSpaceService } from '@app/core/services/workspace.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '@env/environment';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  selector: 'app-office-card',
  templateUrl: './office-card.component.html',
  styleUrls: ['./office-card.component.scss'],
})
export class OfficeCardComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() office: OfficeSpace;
  @Input() loading: boolean;
  isMobileResolution: boolean;
  activeSliderItem: number;
  @ViewChild('myModal', { static: false }) myModal: ElementRef;
  @ViewChild('imageGalleryCarousel', { static: true })
  imageGalleryCarousel: NguCarousel<ImageGallery>;
  carouselTile: NguCarouselConfig = {
    grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
    slide: 1,
    speed: 700, // Increase for slower slide transition
    easing: 'ease-in-out', // Use a different easing function
    point: {
      visible: true,
    },
    load: 3,
    velocity: 0,
    touch: true,
    loop: true,
  };
  spaceName: string;
  pageName: string;
  city: string;
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

  OfficePlans = [
    { label: `Raw`, value: 'Raw' },
    { label: `Semi-Furnished`, value: 'Semi-Furnished' },
    { label: `Fully-Furnished`, value: 'Fully-Furnished' },
    { label: `Built to Suit/Customized`, value: 'Built to Suit/Customized' },
  ];

  OfficeBudgets = [
    { label: 'Upto 1 Lac', value: 'Upto 1 Lac' },
    { label: `1 Lac - 2 Lac`, value: '1 Lac - 2 Lac' },
    { label: '2 Lac - 5 Lac', value: '2 Lac - 5 Lac' },
    { label: '5 Lac - 10 Lac', value: '5 Lac - 10 Lac' },
    { label: '10 Lac +', value: '10 Lac +' },
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
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private workSpaceService: WorkSpaceService,
    private toastrService: ToastrService,
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
    this.getCountries();
  }

  ngOnInit() {
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
    localStorage.setItem('property_url', `https://cofynd.com/office-space/rent/${slug}`);
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
    form['mx_BudgetPrice'] = [null, Validators.required];
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
      // formValues.work_space = this.workSpaceId;
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
      formValues['mx_Space_Type'] = 'Web Office Space';
      formValues['mx_Page_Url'] = localStorage.getItem('property_url');
      formValues['city'] = this.city;
      this.btnLabel = 'Submitting...';
      this.userService.createEnquiry(formValues).subscribe(
        () => {
          this.loading = false;
          this.ENQUIRY_STEP = ENQUIRY_STEPS.SUCCESS;
          this.sendGaEvent('ENQUIRY_FORM_SUBMIT', 'click', 'FORM_SUBMIT');
          /** 
          Will open it after discussion 
          const interestedIn = this.enquiryForm.get('interested_in').value;
          if (this.payementModeOnList.indexOf(interestedIn) >= 0) {
            this.router.navigate(['/booking'], {
              queryParams: { workspace: this.workSpaceId, interestedIn },
            });
          }
        */
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

  ngOnChanges(): void {
    if (this.office.location && this.office.location.city && this.office.location.city.name) {
      this.spaceName = `Office Space for Rent in ${this.office.location.city.name}`;
    }
    if (
      this.office.location &&
      this.office.location.micro_location &&
      this.office.location.micro_location.name &&
      this.office.location.city &&
      this.office.location.city.name
    ) {
      this.spaceName = `Office Space for Rent in ${this.office.location.micro_location.name}, ${this.office.location.city.name}`;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize($event: Event): void {
    this.ngOnInit();
    // this.getScreenWidth = window.innerWidth;
    // this.getScreenHeight = window.innerHeight;
  }

  openoffice(slug: string) {
    const url = this.router.serializeUrl(this.router.createUrlTree([`/office-space/rent/${slug}`]));
    // window.open(url, '_blank');
    if (this.isMobileResolution) {
      this.router.navigate([url]);
    } else {
      window.open(url, '_blank');
    }
  }

  getFloorSuffix(floor: number) {
    return !isNaN(floor) ? intToOrdinalNumberString(floor) : floor;
  }

  getoffceType(type: string) {
    let stringToReplace = type;
    var desired = stringToReplace.replace(/[^\w\s]/gi, ' ');
    return desired;
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
