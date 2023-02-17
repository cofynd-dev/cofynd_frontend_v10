import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '@app/core/services/user.service';
import { WorkSpaceService } from '@app/core/services/workspace.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-coworking-brand',
  templateUrl: './coworking-brand.component.html',
  styleUrls: ['./coworking-brand.component.scss']
})
export class CoworkingBrandComponent implements OnInit {

  submitted = false;
  contactUserName: string;
  showSuccessMessage: boolean;
  loading = true;
  finalCities: any = [];
  coworkingCities: any = [];
  colivingCities: any = [];



  constructor(
    private _formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private toastrService: ToastrService,
    private workSpaceService: WorkSpaceService,
  ) {
    this.getCitiesForCoworking();
    this.getCitiesForColiving();
  }

  ngOnInit() {
    this.getCitiesForCoworking();
    this.getCitiesForColiving();
  }

  enterpriseFormGroup: FormGroup = this._formBuilder.group({
    phone_number: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
    email: ['', [Validators.required, Validators.email]],
    name: ['', Validators.required],
    city: ['', Validators.required],
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
        mx_Page_Url: 'Coworking Brand Page'
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

  coworkingBrand = [
    {
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/f278ca9236513a5d04dbd0194784e413fb673f50.jpg',
      title: 'WeWork',
      titleImg: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/93f7fa099b87eccf93812fbff5d13f83a2cc487a.png',
      cityCount: '5+',
      centersCount: '40+',
      url: 'wework'
    },
    {
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/284b68fedb180cbd3fdde58409a209cc9d86e623.jpg',
      title: 'Awfis',
      titleImg: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/24d34a77dafecc24635767dee0ae7fd250cb3649.jpg',
      cityCount: '14+',
      centersCount: '131+',
      url: 'awfis'
    },
    {
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/3271f4b96aec60a6cfb375d29f991807b9a35d2b.jpg',
      title: '91 Springboard',
      titleImg: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/9d0d32fd1a689722ed5f719d9eab7dbbceeff9f5.png',
      cityCount: '8+',
      centersCount: '24+',
      url: '91-spring-board'
    },
    {
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/092c91c00c965de03abad289531ed81105c36ca9.jpg',
      title: 'IndiQube',
      titleImg: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/31965e7c65101640fa945260d7fc2d2430a5b5fd.jpg',
      cityCount: '11+',
      centersCount: '79+',
      url: 'indiqube'
    },
    {
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/304178d4eca8ab16c0c706a28d4c7f0cc01a70e6.jpg',
      title: 'bhive',
      titleImg: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/757d099b5bf39eeab60401f5a76f8d3c34f875aa.jpg',
      cityCount: '1+',
      centersCount: '12+',
      url: 'bhive'
    },
    {
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/5f325e477b64fc3262ce206aab19403447ea59f2.jpg',
      title: 'Workafella',
      titleImg: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/a0de5565f99b5b6cc0909443a963e6162e1226e8.png',
      cityCount: '4+',
      centersCount: '11+',
      url: 'workafella'
    },
    {
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/8979328470f18fc10c38a28ec7abc4f4b9b502d6.jpg',
      title: 'Cowrks',
      titleImg: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/1c817977a6cc1b587a0cb4c3aceef963659ca54c.png',
      cityCount: '6+',
      centersCount: '19+',
      url: 'cowrks'
    },
    {
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/a5aec0d0844c3b2651b36e98bfd7f895445fe525.jpg',
      title: 'Novel Office',
      titleImg: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/17c7313cd4eac9c323b413f6f6918eb58eb01507.png',
      cityCount: '1+',
      centersCount: '19+',
      url: 'novel-office'
    },
    {
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/b4a805e3d1de6199d9459f8ac6fca4fb93104100.jpg',
      title: '91springboard',
      titleImg: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/9c0c2a58819ef996fd210b7cad122dd15d761ed0.png',
      cityCount: '10+',
      centersCount: '28+',
      url: 'innov8'
    },
    {
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/888247acbb7e1cfb2a2f6e5404f8e29f5752891a.jpg',
      title: 'ABL Workspaces',
      titleImg: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/996d19ea09814787b2263c67521b0047d1dbebcb.png',
      cityCount: '3+',
      centersCount: '8+',
      url: 'abl-workspaces'
    },
    {
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/cc84ef1cd9e3e2ae89d023e0417fbbb74f15f5c8.jpg',
      title: 'India Accelerator',
      titleImg: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/ee709e6a028b1804204c9ec616cfe270f9c7e257.png',
      cityCount: '2+',
      centersCount: '5+',
      url: 'india-accelerator'
    },
    {
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/8069d9d3d68c32e73896f3c40b62ab34c87f5a9d.jpg',
      title: 'DevX',
      titleImg: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/2350a350aef6b971db916933d8a54066bbce64de.png',
      cityCount: '6+',
      centersCount: '6+',
      url: 'devx'
    },
  ]

  scrollToElement(element: HTMLElement) {
    element.scrollIntoView({ behavior: 'smooth' });
  }



}
