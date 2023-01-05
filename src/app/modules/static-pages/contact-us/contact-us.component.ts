import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '@app/core/services/auth.service';
import { HelperService } from '@app/core/services/helper.service';
import { DEFAULT_APP_DATA } from '@core/config/app-data';
import { AVAILABLE_CITY } from '@core/config/cities';
import { City } from '@core/models/city.model';
import { SeoSocialShareData } from '@core/models/seo.model';
import { User } from '@core/models/user.model';
import { ConfigService } from '@core/services/config.service';
import { SeoService } from '@core/services/seo.service';
import { UserService } from '@core/services/user.service';
import { environment } from '@env/environment';
import { AppConstant } from '@shared/constants/app.constant';
import { CustomValidators } from '@shared/validators/custom-validators';
import { ToastrService } from 'ngx-toastr';
import { AuthType } from '@app/core/enum/auth-type.enum';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
})
export class ContactUsComponent implements OnDestroy {
  user: User;
  contactForm: FormGroup;
  loading: boolean;
  contactInfo = DEFAULT_APP_DATA.contact;
  showSuccessMessage: boolean;
  contactUserName: string;
  cities: City[] = AVAILABLE_CITY;
  submitted = false;



  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private helperService: HelperService,
    private toastrService: ToastrService,
    private seoService: SeoService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.configService.configs.footer = false;
    this.addClass();
    this.buildForm();
    this.addSeoTags();
  }

  addSeoTags() {
    const seoData: SeoSocialShareData = {
      title: 'Contact Us - CoFynd',
      image: 'https://cofynd.com/assets/images/meta/cofynd-facebook.jpg',
      description:
        // tslint:disable-next-line: max-line-length
        'CoFynd: Find the Right Workspace in Delhi, Noida, Gurugram . Get in touch with us to enquire a co working space.',
      url: environment.appUrl + '/contact-us',
      type: 'website',
    };
    this.seoService.setData(seoData);
  }

  onSubmit() {
    this.contactForm.markAllAsTouched();
    if (this.contactForm.invalid) {
      return;
    }
    if (!this.authService.getToken()) {
      this.authService.openAuthDialog(AuthType.LOGIN);
      return;
    }

    this.createContactEnquiry();
  }

  createContactEnquiry() {
    this.loading = true;
    const formValues = this.contactForm.getRawValue();
    this.contactUserName = formValues.name;
    formValues.message = `I am interested in ${formValues.interest} in ${formValues.city}. ${formValues.message}`;
    const object = {
      user: {
        phone_number: formValues.phone_number,
        email: formValues.email,
        name: formValues.name,
      },
      interested_in: formValues.interest,
      city: formValues.city,
    };
    this.userService.createLead(object).subscribe(
      () => {
        this.loading = false;
        this.showSuccessMessage = true;
        this.contactForm.reset();
      },
      error => {
        this.loading = false;
        this.toastrService.error(error.message);
      },
    );
  }

  private buildForm() {
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, CustomValidators.emailValidator]],
      phone_number: ['', [Validators.required, CustomValidators.phoneValidator]],
      message: ['', Validators.required],
      interest: ['', Validators.required],
      city: ['', Validators.required],
    });
  }

  enterpriseFormGroup: FormGroup = this.formBuilder.group({
    phone_number: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
    email: ['', [Validators.required, Validators.email]],
    name: ['', Validators.required],
    city: ['', Validators.required],
    interested_in: ['', Validators.required],
    requirements: [''],
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

  onSubmit1() {
    this.submitted = true;
    if (this.enterpriseFormGroup.invalid) {
      return;
    } else {
      this.loading = true;
      this.contactUserName = this.enterpriseFormGroup.controls['name'].value;
      const object = {
        user: {
          phone_number: this.enterpriseFormGroup.controls['phone_number'].value,
          email: this.enterpriseFormGroup.controls['email'].value,
          name: this.enterpriseFormGroup.controls['name'].value,
          requirements: this.enterpriseFormGroup.controls['requirements'].value,
        },
        interested_in: this.enterpriseFormGroup.controls['interested_in'].value,
        city: this.enterpriseFormGroup.controls['city'].value,
        mx_Page_Url: 'Contact-Us Page'
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

  addClass() {
    this.helperService.addClassToDocument(AppConstant.FULL_HEIGHT_DOCUMENT_CLASS);
  }

  removeClass() {
    this.helperService.removeClassFromDocument(AppConstant.FULL_HEIGHT_DOCUMENT_CLASS);
  }

  ngOnDestroy() {
    this.removeClass();
    this.configService.setDefaultConfigs();
  }
}
