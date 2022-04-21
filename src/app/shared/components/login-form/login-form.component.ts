import { isPlatformBrowser } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthType } from '@core/enum/auth-type.enum';
import { User } from '@core/models/user.model';
import { AuthService } from '@core/services/auth.service';
import { environment } from '@env/environment';
import { AppConstant } from '@shared/constants/app.constant';
import { ToastrService } from 'ngx-toastr';
import { Observable, timer } from 'rxjs';
import { filter, finalize, map, take } from 'rxjs/operators';
import { Location } from '@angular/common';

export enum LOGIN_STEPS {
  PHONE,
  OTP,
}

declare let ga: any;

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent {
  @Output() signUpClickEmitter: EventEmitter<AuthType> = new EventEmitter<AuthType>();
  @Output() reviewDialogOpenEmitter: EventEmitter<AuthType> = new EventEmitter<AuthType>();
  @Input() shouldOpenReviewModal: boolean = false;
  loginForm: FormGroup;

  isDialogModal = true;
  isSubmitting: boolean;

  // OTP
  formSubmit: boolean;
  LOGIN_STEPS: typeof LOGIN_STEPS = LOGIN_STEPS;
  currentLoginStep: LOGIN_STEPS = LOGIN_STEPS.PHONE;
  otpPreviewMessage: string;
  returnUrl: string;

  // OTP Timer
  otpTimer$: Observable<number>;
  otpInterval = AppConstant.OTP_TIME_INTERVAL;
  showOtpTimer = false;

  // show server side error message
  responseError: string;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastrService: ToastrService,
    private location: Location,
  ) {
    // Create Form
    this.buildForm();

    // Check For Login Page/Dialog
    const navigationEndEvent = this.router.events.pipe(filter(event => event instanceof NavigationEnd));
    navigationEndEvent.subscribe(() => this.checkIfLoginPage());

    // get return url from route parameters or default to '/'
    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit(): void {
    if (this.currentLoginStep === LOGIN_STEPS.PHONE) {
      this.getOtp();
    }

    if (this.currentLoginStep === LOGIN_STEPS.OTP && this.loginForm.valid) {
      this.verifyOtp();
    }
  }

  getOtp() {
    const phoneControl = this.loginForm.get('phone_number');
    phoneControl.markAsTouched();
    if (phoneControl.invalid) {
      return;
    }

    this.isSubmitting = true;

    this.authService.signInWithOtp(phoneControl.value).subscribe(
      () => {
        this.currentLoginStep = LOGIN_STEPS.OTP;
        this.toastrService.success(`Verification code sent to ${phoneControl.value}`);
        this.startOtpTimer();
        this.isSubmitting = false;
        this.showOtpField();
      },
      error => {
        this.responseError = error.message;
        this.isSubmitting = false;
      },
    );
  }

  verifyOtp() {
    const otpControl = this.loginForm.get('otp');
    const phoneControl = this.loginForm.get('phone_number');
    if (otpControl.invalid) {
      return;
    }
    this.isSubmitting = true;

    this.authService.verifyOtp(phoneControl.value, otpControl.value, !this.shouldOpenReviewModal).subscribe(
      (user: User) => {
        this.isSubmitting = false;
        if (user && !user.is_profile_updated) {
          // Open register Form
          this.showRegisterForm();
          this.sendGaEvent('OPEN_REGISTER_FORM', 'click', 'FORM_OPEN');
        } else {
          this.onLoginSuccess();
        }
      },
      error => {
        this.responseError = error.message;
        this.isSubmitting = false;
      },
    );
  }

  showRegisterForm() {
    this.signUpClickEmitter.emit(AuthType.SIGN_UP);
  }

  onLoginSuccess() {
    if (this.shouldOpenReviewModal) {
      this.reviewDialogOpenEmitter.emit(AuthType.REVIEW);
      return;
    }
    this.sendGaEvent('LOGIN_SUCCESS', 'submit', 'FORM_SUBMIT');
    this.router.navigateByUrl(this.location.path());
    this.clearForm();
  }

  resetPhoneField() {
    this.stopOtpTimer();
    this.loginForm.get('otp').reset();
    this.responseError = '';
    this.isSubmitting = false;
    this.currentLoginStep = LOGIN_STEPS.PHONE;
  }

  /**
   * Resend OTP Timer
   */
  private startOtpTimer() {
    this.showOtpTimer = true;
    this.otpTimer$ = timer(0, 1000).pipe(
      take(this.otpInterval),
      map(() => --this.otpInterval),
      finalize(() => (this.showOtpTimer = false)),
    );
  }

  private stopOtpTimer() {
    this.showOtpTimer = false;
    this.otpInterval = AppConstant.OTP_TIME_INTERVAL;
  }

  private showOtpField() {
    this.isSubmitting = false;
    // Set Validator
    const otpControl = this.loginForm.get('otp');
    otpControl.setValidators([Validators.required, Validators.minLength(4), Validators.maxLength(4)]);
    otpControl.updateValueAndValidity();
  }

  private buildForm() {
    this.loginForm = this.formBuilder.group({
      phone_number: ['', [Validators.required]],
      otp: '',
    });
  }

  private checkIfLoginPage() {
    if (
      this.activatedRouter.parent &&
      this.activatedRouter.parent.routeConfig &&
      this.activatedRouter.parent.routeConfig.path === 'login'
    ) {
      this.isDialogModal = false;
    }
  }

  clearForm() {
    this.currentLoginStep = LOGIN_STEPS.PHONE;
    this.isSubmitting = false;
    this.loginForm.reset();
    this.resetPhoneField();
  }

  openSignUp() {
    if (this.isDialogModal) {
      this.signUpClickEmitter.emit(AuthType.SIGN_UP);
    } else {
      this.router.navigateByUrl('sign-up');
    }
  }

  sendGaEvent(category: string, action: string, label: string) {
    if (environment.options.GA_ENABLED && isPlatformBrowser(this.platformId)) {
      ga('send', 'event', category, action, label);
    }
  }
}
