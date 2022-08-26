import { state, style, transition, trigger, useAnimation } from '@angular/animations';
import { isPlatformBrowser } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HelperService } from '@app/core/services/helper.service';
import { WorkSpaceService } from '@app/core/services/workspace.service';
import { CoLivingService } from '@app/modules/co-living/co-living.service';
import { DEFAULT_APP_DATA } from '@core/config/app-data';
import { Enquiry } from '@core/models/enquiry.model';
import { User } from '@core/models/user.model';
import { AuthService } from '@core/services/auth.service';
import { UserService } from '@core/services/user.service';
import { environment } from '@env/environment';
import { shake } from '@shared/animations/animation';
import { ToastrService } from 'ngx-toastr';

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

@Component({
  selector: 'app-workspace-enquire',
  templateUrl: './workspace-enquire.component.html',
  styleUrls: ['./workspace-enquire.component.scss'],
  animations: [
    trigger('shake', [state('0', style({})), state('1', style({})), transition('0 => 1', useAnimation(shake))]),
  ],
})
export class WorkspaceEnquireComponent implements OnInit, OnChanges {
  supportPhone = DEFAULT_APP_DATA.contact;
  @Input() isSticky: boolean;
  @Input() workSpaceId: string;
  @Input() isOfficeEnquiry: boolean;
  @Output() backButtonClick: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() enquiryType: number;
  @Input() shouldReload: boolean;

  enquiryForm: FormGroup;
  loading: boolean;
  user: User;
  phoneflag: boolean = true;
  ENQUIRY_STEPS: typeof ENQUIRY_STEPS = ENQUIRY_STEPS;
  ENQUIRY_TYPES: typeof ENQUIRY_TYPES = ENQUIRY_TYPES;
  ENQUIRY_STEP = ENQUIRY_STEPS.ENQUIRY;
  btnLabel = 'submit';

  minDate = new Date();

  // Mat Select
  isActiveLabel: boolean;
  shakeTheForm: boolean;
  payementModeOnList: string[] = [
    'day-pass',
    'hot-desk',
    'dedicated-desk',
    'single-sharing',
    'double-sharing',
    'triple-sharing',
  ];

  coworkingPlans = [
    { label: 'Office Suite', value: 'office-suite' },
    { label: `CXO's Suite`, value: 'cxo-suite' },
    { label: 'Custom Buildout', value: 'custom-buildout' },
  ];

  coLivingPlans = [{ label: `Any Other`, value: 'any-other' }];

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private toastrService: ToastrService,
    private workSpaceService: WorkSpaceService,
    private coLivingService: CoLivingService,
    private helperService: HelperService,
    private router: Router,
  ) {
    if (router.url.search(/co-living/i) != -1) {
      this.phoneflag = false;
    }
    this.buildForm();
    if (this.isAuthenticated()) {
      this.user = this.authService.getLoggedInUser();
    }
  }

  ngOnInit(): void {
    this.helperService.animateEnquiryForm$.subscribe(animationState => (this.shakeTheForm = animationState));
    if (this.enquiryType == ENQUIRY_TYPES.COWORKING) {
      this.loadWorkSpace(this.workSpaceId);
    } else if (this.enquiryType == ENQUIRY_TYPES.COLIVING) {
      this.loadColiving(this.workSpaceId);
    }
  }

  ngOnChanges(changes) {
    if (changes && changes.enquiryType) {
      this.buildForm();
      if (this.user) {
        const { name, email, phone_number } = this.user;
        this.enquiryForm.patchValue({ name, email, phone_number });
      }
    }

    if (changes && changes.shouldReload) {
      if (changes.shouldReload.currentValue) {
        this.resetForm();
      }
    }
  }

  animationChanged(event: any) {
    if (event && event.phaseName === 'done') {
      this.shakeTheForm = false;
    }
  }

  loadWorkSpace(id: string) {
    this.workSpaceService.getWorkspace(id).subscribe(workspaceData => {
      let plans = workspaceData.plans.map(x => x.category);
      plans = [...new Set(plans)];
      plans.forEach(plan => {
        this.coworkingPlans.push({ label: this.toTitleCase(plan), value: plan['name'] });
      });
      var item_order = [
        'day-pass',
        'hot-desk',
        'dedicated-desk',
        'private-cabin',
        'office-suite',
        'cxo-suite',
        'custom-buildout',
      ];

      this.coworkingPlans.sort((a, b) => item_order.indexOf(a.value) - item_order.indexOf(b.value));
      this.coworkingPlans = [...this.coworkingPlans];
    });
  }

  loadColiving(id: string) {
    this.coLivingService.getCoLiving(id).subscribe(coliving => {
      for (const property in coliving.price) {
        if (coliving.price[property]) {
          this.coLivingPlans.push({
            label: this.toTitleCaseForColiving(property),
            value: this.toValueCaseForColiving(property),
          });
        }
      }
      var item_order = ['single-sharing', 'double-sharing', 'triple-sharing', 'studio-apartment', 'any-other'];

      this.coLivingPlans.sort((a, b) => item_order.indexOf(a.value) - item_order.indexOf(b.value));
      this.coLivingPlans = [...this.coLivingPlans];
    });
  }

  toTitleCase = phrase => {
    return phrase.name
      .toLowerCase()
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  toTitleCaseForColiving = phrase => {
    return phrase
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  toValueCaseForColiving = phrase => {
    return phrase
      .toLowerCase()
      .split('_')
      .join('-');
  };

  onSubmit() {
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
      formValues.work_space = this.workSpaceId;
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

  createEnquiry() {
    this.loading = true;
    const formValues: Enquiry = this.enquiryForm.getRawValue();
    switch (this.enquiryType) {
      case ENQUIRY_TYPES.COWORKING:
        formValues.work_space = this.workSpaceId;
        break;
      case ENQUIRY_TYPES.OFFICE:
        formValues.office_space = this.workSpaceId;
        break;
      case ENQUIRY_TYPES.COLIVING:
        formValues.living_space = this.workSpaceId;
        break;
    }
    this.btnLabel = 'Submitting Enquiry...';
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
        this.router.navigate(['/thank-you'])
      },
      error => {
        this.loading = false;
        this.toastrService.error(error.message || 'Something broke the server, Please try latter');
      },
    );
  }

  addValidationOnOtpField() {
    const otpControl = this.enquiryForm.get('otp');
    otpControl.setValidators([Validators.required, Validators.minLength(4), Validators.maxLength(4)]);
    otpControl.updateValueAndValidity();
  }

  private buildForm() {
    const form = {
      name: ['', Validators.required],
      email: ['', Validators.required],
      phone_number: ['', Validators.required],
      otp: [''],
    };

    if (this.enquiryType == ENQUIRY_TYPES.COWORKING || this.enquiryType == ENQUIRY_TYPES.COLIVING) {
      form['interested_in'] = [null, Validators.required];
    }
    if (this.enquiryType == ENQUIRY_TYPES.COWORKING) {
      form['no_of_person'] = ['1-10', Validators.required];
    }
    this.enquiryForm = this.formBuilder.group(form);
  }

  private resetForm() {
    this.enquiryForm.reset();
  }

  private isAuthenticated() {
    return this.authService.getToken();
  }

  onClose() {
    this.backButtonClick.emit(true);
  }

  sendGaEvent(category: string, action: string, label: string) {
    if (environment.options.GA_ENABLED && isPlatformBrowser(this.platformId)) {
      ga('send', 'event', category, action, label);
    }
  }
}
