import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  Component,
  Output,
  EventEmitter,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { DEFAULT_APP_DATA } from '@app/core/config/app-data';
import { AuthService } from '@app/core/services/auth.service';
import { HelperService } from '@app/core/services/helper.service';
import { ENQUIRY_TYPES } from '@app/shared/components/workspace-enquire/workspace-enquire.component';
import { VisibilityState } from '@core/enum/visibility-state.enum';
import { SeoSocialShareData } from '@core/models/seo.model';
import { WorkSpace } from '@core/models/workspace.model';
import { SeoService } from '@core/services/seo.service';
import { environment } from '@env/environment';
import { appAnimations } from '@shared/animations/animation';
import { Builder } from '../builder.model';
import { icon, latLng, Map, marker, point, polyline, tileLayer, Layer, Control } from 'leaflet';
import { Location } from '@angular/common';
import { Review } from '@app/core/models/review.model';
import { AuthType } from '@app/core/enum/auth-type.enum';
import { WorkSpaceService } from '@app/core/services/workspace.service';
import { BuilderService } from '../builder.services';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Enquiry } from '@app/core/models/enquiry.model';
import { UserService } from '@core/services/user.service';
import { ToastrService } from 'ngx-toastr';

export enum ENQUIRY_STEPS {
  ENQUIRY,
  OTP,
  SUCCESS,
}


@Component({
  selector: 'app-builder-detail',
  templateUrl: './builder-detail.component.html',
  styleUrls: ['./builder-detail.component.scss']
})
export class BuilderDetailComponent implements OnInit {
  activeBuilderId: any;
  loading: boolean;
  builder: Builder;
  shareImageUrl: string;

  //locationIq Map code
  options: any;
  markers: Layer[] = [];

  pageUrl: string;
  submitted = false;
  showSuccessMessage: boolean;
  contactUserName: string;
  btnLabel = 'submit';
  ENQUIRY_STEPS: typeof ENQUIRY_STEPS = ENQUIRY_STEPS;
  ENQUIRY_STEP = ENQUIRY_STEPS.ENQUIRY;
  user: any;
  activeCountries: any = [];
  inActiveCountries: any = [];
  showcountry: boolean = false;
  selectedCountry: any = {};

  // resend otp 
  resendDisabled = false;
  resendCounter = 30;
  resendIntervalId: any;

  constructor(private builderService: BuilderService,
    private activatedRoute: ActivatedRoute,
    private seoService: SeoService,
    private router: Router,
    private _formBuilder: FormBuilder,
    private userService: UserService,
    private toastrService: ToastrService,
    private authService: AuthService,
    private workSpaceService: WorkSpaceService,
  ) {
    this.activatedRoute.params.subscribe((param: Params) => {
      this.activeBuilderId = param.buildername;
      if (param.buildername) {
        this.getBuilderDetail(this.activeBuilderId);
      }
    });
    this.pageUrl = this.router.url;
    this.pageUrl = `https://cofynd.com${this.pageUrl}`;
    if (this.isAuthenticated()) {
      this.user = this.authService.getLoggedInUser();
    };
    if (this.user) {
      const { name, email, phone_number } = this.user;
      this.enterpriseFormGroup.patchValue({ name, email, phone_number });
      this.selectedCountry['dial_code'] = this.user.dial_code;
    }
    this.getCountries();
  }
  enterpriseFormGroup: FormGroup = this._formBuilder.group({
    phone_number: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
    email: ['', [Validators.required, Validators.email]],
    name: ['', Validators.required],
    otp: ['']
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

  private isAuthenticated() {
    return this.authService.getToken();
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

  ngOnInit() {
  }

  addValidationOnOtpField() {
    const otpControl = this.enterpriseFormGroup.get('otp');
    otpControl.setValidators([Validators.required, Validators.minLength(4), Validators.maxLength(4)]);
    otpControl.updateValueAndValidity();
  }

  getCountries() {
    this.workSpaceService.getCountry({}).subscribe((res: any) => {
      if (res.data) {
        this.activeCountries = res.data.filter((v) => { return v.for_coWorking === true });
        this.inActiveCountries = res.data.filter((v) => { return v.for_coWorking == false });
        this.selectedCountry = this.activeCountries[0];
      }
    })
  }

  hideCountry(country: any) {
    this.selectedCountry = country;
    this.showcountry = false;
  }

  getBuilderDetail(builderId: string) {
    this.loading = true;
    this.builderService.getBuilderByName(builderId).subscribe(
      workspaceDetail => {
        this.builder = workspaceDetail.data;
        this.loading = false;
        if (this.builder) {
          this.addSeoTags(this.builder);
        }
        if (this.builder && this.builder.geometry) {
          this.options = {
            layers: [
              tileLayer(
                `https://{s}-tiles.locationiq.com/v3/streets/r/{z}/{x}/{y}.png?key=${environment.keys.LOCATIONIQ_MAP}`,
                { maxZoom: 18, attribution: 'Open Cofynd Map' },
              ),
            ],
            zoom: 10,
            attributionControl: false,
            scrollWheelZoom: false,
            dragging: true,
            center: latLng(this.builder.geometry.coordinates[1], this.builder.geometry.coordinates[0]),
          };
          this.addMarker(this.builder.geometry.coordinates[1], this.builder.geometry.coordinates[0]);
        }

        if (this.builder && this.builder.images.length) {
          this.shareImageUrl = this.builder.images[0].image.s3_link;
        }
      },
      error => {
        if (error.status === 404) {
          this.router.navigate(['/404'], { skipLocationChange: true });
        }
      },
    );
  }

  addMarker(latitute, longitute) {
    const newMarker = marker([latitute, longitute], {
      icon: icon({
        iconSize: [25, 41],
        iconAnchor: [13, 41],
        iconUrl: 'assets/images/marker-icon.png',
        iconRetinaUrl: 'assets/images/marker-icon.png',
        // shadowUrl: 'assets/images/marker-icon.png1'
      }),
    });
    this.markers.push(newMarker);
  }

  addSeoTags(builder: Builder) {
    const seoData: SeoSocialShareData = {
      title: builder.seo.title ? builder.seo.title : 'CoFynd - ' + builder.name,
      description: builder.seo.description ? builder.seo.description : builder.description,
      keywords: builder.seo.keywords ? builder.seo.keywords : '',
      url: environment.appUrl + '/co-living/' + builder.slug,
      image: this.shareImageUrl,
      type: 'website',
    };
    this.seoService.setData(seoData);
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

  createEnquiry() {
    this.loading = true;
    this.contactUserName = this.enterpriseFormGroup.controls['name'].value;
    const object = {
      user: {
        phone_number: this.enterpriseFormGroup.controls['phone_number'].value,
        email: this.enterpriseFormGroup.controls['email'].value,
        name: this.enterpriseFormGroup.controls['name'].value,
      },
      mx_Page_Url: this.pageUrl,
      mx_Space_Type: 'Web Builder Space'
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

}
