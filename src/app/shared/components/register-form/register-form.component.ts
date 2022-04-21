import { isPlatformBrowser } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthType } from '@core/enum/auth-type.enum';
import { User } from '@core/models/user.model';
import { AuthService } from '@core/services/auth.service';
import { environment } from '@env/environment';
import { CustomValidators } from '@shared/validators/custom-validators';
import { filter } from 'rxjs/operators';

declare let ga: any;

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
})
export class RegisterFormComponent {
  @Output() loginClickEmitter: EventEmitter<AuthType> = new EventEmitter<AuthType>();
  @Output() reviewDialogOpenEmitter: EventEmitter<AuthType> = new EventEmitter<AuthType>();
  @Input() shouldOpenReviewModal: boolean = false;
  isDialogModal = true;

  registerForm: FormGroup;
  isSubmitting: boolean;
  responseError: string;

  // This will animate the label to feel like material
  isGenderDropDownOpen: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) {
    // Create Form
    this.buildForm();

    // Check For Login Page/Dialog
    const navigationEndEvent = this.router.events.pipe(filter(event => event instanceof NavigationEnd));
    navigationEndEvent.subscribe(() => this.checkIfLoginPage());
  }

  onSubmit() {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.valid) {
      this.isSubmitting = true;
      const loginPayload: User = this.registerForm.getRawValue();
      this.authService.signUp(loginPayload, !this.shouldOpenReviewModal).subscribe(
        () => {
          if (this.shouldOpenReviewModal) {
            this.reviewDialogOpenEmitter.emit(AuthType.REVIEW);
            return;
          }
          this.router.navigateByUrl('/');
          this.isSubmitting = false;
          this.sendGaEvent('REGISTER_SUCCESS', 'submit', 'FORM_SUBMIT');
        },
        error => {
          this.isSubmitting = false;
          this.responseError = error.error.message || 'unable to proceed';
        },
      );
    }
  }

  private buildForm() {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, CustomValidators.emailValidator]],
      gender: [null, Validators.required],
    });
  }

  checkIfLoginPage() {
    if (this.activatedRouter.parent.routeConfig && this.activatedRouter.parent.routeConfig.path === 'sign-up') {
      this.isDialogModal = false;
    }
  }

  onOpenDropDown() {
    this.isGenderDropDownOpen = true;
  }

  onCloseDropDown() {
    if (this.registerForm.get('gender').invalid) {
      this.isGenderDropDownOpen = false;
    }
  }

  openLogin() {
    if (this.isDialogModal) {
      this.loginClickEmitter.emit(AuthType.SIGN_UP);
    } else {
      this.router.navigateByUrl('login');
    }
  }

  sendGaEvent(category: string, action: string, label: string) {
    if (environment.options.GA_ENABLED && isPlatformBrowser(this.platformId)) {
      ga('send', 'event', category, action, label);
    }
  }
}
