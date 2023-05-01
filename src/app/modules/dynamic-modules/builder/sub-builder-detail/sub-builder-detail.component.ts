import {
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { SeoSocialShareData } from '@core/models/seo.model';
import { SeoService } from '@core/services/seo.service';
import { environment } from '@env/environment';
import { SubBuilder } from '../subbuilder.model';
import { WorkSpaceService } from '@app/core/services/workspace.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Enquiry } from '@app/core/models/enquiry.model';
import { UserService } from '@core/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { sanitizeParams } from '@app/shared/utils';
import { AppConstant } from '@shared/constants/app.constant';
import { SubBuilderService } from '../subbuilder.service'
import { BuilderService } from '../builder.services';
import { icon, latLng, Map, marker, point, polyline, tileLayer, Layer, Control } from 'leaflet';


export enum ENQUIRY_STEPS {
  ENQUIRY,
  OTP,
  SUCCESS,
}

@Component({
  selector: 'app-sub-builder-detail',
  templateUrl: './sub-builder-detail.component.html',
  styleUrls: ['./sub-builder-detail.component.scss']
})

export class SubBuilderDetailComponent implements OnInit {
  activeSubBuilderId: any;
  loading: boolean;
  SubBuilder: SubBuilder;
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
  sanitizedUrl: any;
  videoUrl: string;
  safeVideoUrl: SafeResourceUrl;
  commQueryParams: { [key: string]: string | number | boolean };
  resiQueryParams: { [key: string]: string | number | boolean };
  moreProjects: any = [];
  seoData: SeoSocialShareData;
  planId: any;
  floorPlan: any = [];
  builderLogoUrl: string;
  builderId: any;

  constructor(private SubBuilderService: SubBuilderService,
    private activatedRoute: ActivatedRoute,
    private seoService: SeoService,
    private router: Router,
    private _formBuilder: FormBuilder,
    private userService: UserService,
    private toastrService: ToastrService,
    private authService: AuthService,
    private workSpaceService: WorkSpaceService,
    private sanitizer: DomSanitizer,
    private builderService: BuilderService,
  ) {
    this.activatedRoute.params.subscribe((param: Params) => {
      this.activeSubBuilderId = param.subuildername;
      if (param.subuildername) {
        this.getSubBuilderDetail(this.activeSubBuilderId);
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

  getMorePropertiesByBuilder(param) {
    this.loading = true;
    this.builderService.getBuilderComResiProjects(sanitizeParams(param)).subscribe((allCommProjects: any) => {
      this.moreProjects = allCommProjects.data.subbuilders;
      this.loading = false;
    })
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

  getSubBuilderDetail(SubBuilderId: string) {
    this.loading = true;
    this.SubBuilderService.getSubBuilderByName(SubBuilderId).subscribe(
      workspaceDetail => {
        this.SubBuilder = workspaceDetail.data;
        this.builderId = this.SubBuilder.builder.id;
        this.builderService.getBuilderByName(this.builderId).subscribe(
          workspaceDetail => {
            this.builderLogoUrl = workspaceDetail.data.builder_logo.s3_link;
          })
        if (!this.SubBuilder) {
          this.router.navigate(['/404'], { skipLocationChange: true });
        }
        this.loading = false;
        if (this.SubBuilder) {
          this.videoUrl = this.SubBuilder.builder.video_link ? this.SubBuilder.builder.video_link : 'https://www.youtube.com/watch?v=Qs4g_87jTuI';
          if (this.SubBuilder.plans.length > 0) {
            this.planId = this.SubBuilder.plans[0].planId['id'];
            this.floorPlanClick(this.planId)
          }
          this.addSeoTags(this.SubBuilder);
          this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.videoUrl.replace('watch?v=', 'embed/'));
          this.commQueryParams = {
            ...AppConstant.DEFAULT_SEARCH_PARAMS,
            builder: this.SubBuilder.builder.id,
            shouldApprove: true
          };
          this.getMorePropertiesByBuilder(this.commQueryParams);
        }
        if (this.SubBuilder.geometry) {
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
            center: latLng(this.SubBuilder.geometry.coordinates[1], this.SubBuilder.geometry.coordinates[0]),
          };
          if (this.SubBuilder.geometry.coordinates.length > 0) {
            this.addMarker(this.SubBuilder.geometry.coordinates[1], this.SubBuilder.geometry.coordinates[0]);
          }
        }
        if (this.SubBuilder && this.SubBuilder.images.length) {
          this.shareImageUrl = this.SubBuilder.images[0].image.s3_link;
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

  floorPlanClick(plan) {
    this.planId = plan;
    this.floorPlan = this.SubBuilder.plans.filter((x: any) => x.planId.id == plan);
    if (this.floorPlan.length > 0) {
      this.floorPlan = this.floorPlan[0]['floor_plans'];
    }
  }

  addSpecialCharacter(text: string) {
    if (text == 'Veg & Non-Veg') {
      return 'veg-non-veg';
    }
    if (text == 'Netflix/Amazon') {
      return 'ott-subscription';
    }
    return text
      .toLocaleLowerCase()
      .split(' ')
      .join('-');
  }

  removeSpecialCharacter(text: string) {
    return text.replace('-', ' ');
  }

  haftAmenities: boolean = true;

  toggleAmenitiesDiv() {
    this.haftAmenities = !this.haftAmenities;
  }

  addSeoTags(SubBuilder: SubBuilder) {
    this.seoData = {
      title: SubBuilder.seo.title ? SubBuilder.seo.title : 'CoFynd - ' + SubBuilder.name,
      description: SubBuilder.seo.description ? SubBuilder.seo.description : SubBuilder.description,
      keywords: SubBuilder.seo.keywords ? SubBuilder.seo.keywords : '',
      url: environment.appUrl + '/india/SubBuilder/' + SubBuilder.slug,
      image: this.shareImageUrl,
      type: 'website',
      footer_title: SubBuilder.seo.footer_title ? SubBuilder.seo.footer_title : '',
      footer_description: SubBuilder.seo.footer_description ? SubBuilder.seo.footer_description : '',
    };
    this.seoService.setData(this.seoData);
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
      mx_Space_Type: 'Web SubBuilder Space'
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
