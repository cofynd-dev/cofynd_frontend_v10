import { Component, Input, OnInit } from '@angular/core';
import { AVAILABLE_CITY } from '@app/core/config/cities';
import { City } from '@app/core/models/city.model';
import { Router } from '@angular/router';
import { UserService } from '@app/core/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { WorkSpaceService } from '@app/core/services/workspace.service';

@Component({
  selector: 'app-search-no-result',
  templateUrl: './search-no-result.component.html',
  styleUrls: ['./search-no-result.component.scss'],
})
export class SearchNoResultComponent implements OnInit {
  @Input() title: string;
  @Input() url: string;
  @Input() shouldShowContactForm: boolean = false;
  availableCities: City[] = AVAILABLE_CITY;
  @Input() type: string = 'for_office';
  city: string;
  submitted = false;
  loading: boolean = true;
  showSuccessMessage: boolean;
  contactUserName: string;
  coworkingCities: any = [];
  colivingCities: any = [];
  finalCities: any = [];

  constructor(
    private router: Router,
    private userService: UserService,
    private toastrService: ToastrService,
    private _formBuilder: FormBuilder,
    private workSpaceService: WorkSpaceService,
  ) {
    let url = this.router.url;
    var parts = url.split("/");
    this.city = parts[parts.length - 1];
    this.getCitiesForCoworking();
    this.getCitiesForColiving();
    this.loading = false;
  }

  ngOnInit(): void {
    this.getCitiesForCoworking();
    this.getCitiesForColiving();
  }

  enterpriseFormGroup: FormGroup = this._formBuilder.group({
    phone_number: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
    email: ['', [Validators.required, Validators.email]],
    name: ['', Validators.required],
    city: ['', Validators.required],
    requirements: [''],
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
          requirements: this.enterpriseFormGroup.controls['requirements'].value,
        },
        city: this.enterpriseFormGroup.controls['city'].value,
        interested_in: this.enterpriseFormGroup.controls['interested_in'].value,
        mx_Page_Url: 'No Result Page'
      };
      this.userService.createLead(object).subscribe(
        () => {
          this.router.navigate(['/thank-you'])
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
}
