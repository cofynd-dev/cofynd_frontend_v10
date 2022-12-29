import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { User } from '@core/models/user.model';
import { UserService } from '@core/services/user.service';
import { environment } from '@env/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-enterprise',
  templateUrl: './enterprise.component.html',
  styleUrls: ['./enterprise.component.scss'],
})
export class EnterpriseComponent implements OnInit {
  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private _formBuilder: FormBuilder,
  ) { }

  submitted = false;
  loading: boolean;
  showSuccessMessage: boolean;
  contactUserName: string;

  ngOnInit() { }

  enterpriseFormGroup: FormGroup = this._formBuilder.group({
    phone_number: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
    email: ['', [Validators.required, Validators.email]],
    name: ['', Validators.required],
    org_name: ['', Validators.required],
    requirements: ['', Validators.required],
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

  onSubmit() {
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
          org_name: this.enterpriseFormGroup.controls['org_name'].value,
          requirements: this.enterpriseFormGroup.controls['requirements'].value,
        },
      };
      this.userService.createLead(object).subscribe(
        () => {
          this.loading = false;
          this.showSuccessMessage = true;
          this.enterpriseFormGroup.reset();
          this.submitted = false;
        },
        error => {
          this.loading = false;
          this.toastrService.error(error.message);
        },
      );
    }
  }

  scrollToElement(element: HTMLElement) {
    element.scrollIntoView({ behavior: 'smooth' });
  }

  seeMore: boolean = true;
  togglePanIndia() {
    this.seeMore = !this.seeMore;
  }
}



