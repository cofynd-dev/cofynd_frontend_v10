import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '@app/core/services/user.service';
import { WorkSpaceService } from '@app/core/services/workspace.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-search-contact-us-text2',
  templateUrl: './search-contact-us-text2.component.html',
  styleUrls: ['./search-contact-us-text2.component.scss']
})
export class SearchContactUsText2Component implements OnInit {

  constructor(private _formBuilder: FormBuilder,
    private userService: UserService,
    private toastrService: ToastrService,
    private workSpaceService: WorkSpaceService,
    private router: Router,
  ) {
    this.getCitiesForCoworking();
    this.getCitiesForColiving();
  }

  submitted = false;
  loading: boolean;
  showSuccessMessage: boolean;
  contactUserName: string;
  coworkingCities: any = [];
  colivingCities: any = [];
  finalCities: any = [];

  ngOnInit() {
    this.getCitiesForCoworking();
    this.getCitiesForColiving();
  }

  enterpriseFormGroup: FormGroup = this._formBuilder.group({
    phone_number: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
    email: ['', [Validators.required, Validators.email]],
    name: ['', Validators.required],
    city: ['', Validators.required],
    interested_in: ['', Validators.required],
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

  getCitiesForCoworking() {
    this.workSpaceService.getCityForCoworking('6231ae062a52af3ddaa73a39').subscribe((res: any) => {
      this.coworkingCities = res.data;
    })
  };

  getCitiesForColiving() {
    this.workSpaceService.getCityForColiving('6231ae062a52af3ddaa73a39').subscribe((res: any) => {
      this.colivingCities = res.data;
      if (this.colivingCities.length) {
        this.removeDuplicateCities();
      }
    })
  }

  removeDuplicateCities() {
    const key = 'name';
    let allCities = [...this.coworkingCities, ...this.colivingCities];
    this.finalCities = [...new Map(allCities.map(item => [item[key], item])).values()]
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
        },
        city: this.enterpriseFormGroup.controls['city'].value,
        interested_in: this.enterpriseFormGroup.controls['interested_in'].value,
        mx_Page_Url: 'City Page'
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

}
