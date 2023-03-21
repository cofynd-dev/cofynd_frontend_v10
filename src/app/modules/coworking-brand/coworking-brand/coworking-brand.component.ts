import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SeoSocialShareData } from '@app/core/models/seo.model';
import { SeoService } from '@app/core/services/seo.service';
import { UserService } from '@app/core/services/user.service';
import { WorkSpaceService } from '@app/core/services/workspace.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '@env/environment';
import { AuthService } from '@app/core/services/auth.service';
import { Enquiry } from '@app/core/models/enquiry.model';

export enum ENQUIRY_STEPS {
  ENQUIRY,
  OTP,
  SUCCESS,
}


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
  show = 15;
  footerDescription: any;
  footerTitle: any;
  seoData: SeoSocialShareData;
  btnLabel = 'submit';
  ENQUIRY_STEPS: typeof ENQUIRY_STEPS = ENQUIRY_STEPS;
  ENQUIRY_STEP = ENQUIRY_STEPS.ENQUIRY;
  user: any;
  pageUrl: string;


  constructor(
    private _formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private toastrService: ToastrService,
    private workSpaceService: WorkSpaceService,
    private seoService: SeoService,
    private authService: AuthService,
  ) {
    // this.router.navigate(['/404'], { skipLocationChange: true });
    this.getCitiesForCoworking();
    this.getCitiesForColiving();
    this.pageUrl = this.router.url;
    this.pageUrl = `https://cofynd.com${this.pageUrl}`
  }

  ngOnInit() {
    this.getCitiesForCoworking();
    this.getCitiesForColiving();
    this.addSeoTags()
  }

  enterpriseFormGroup: FormGroup = this._formBuilder.group({
    phone_number: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
    email: ['', [Validators.required, Validators.email]],
    name: ['', Validators.required],
    city: ['', Validators.required],
    requirements: [''],
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
    }
    if (this.isAuthenticated()) {
      this.createEnquiry();
    } else {
      this.getOtp();
    }
  }

  private isAuthenticated() {
    return this.authService.getToken();
  }

  getOtp() {
    if (this.ENQUIRY_STEP === ENQUIRY_STEPS.ENQUIRY) {
      this.loading = true;
      const formValues: Enquiry = this.enterpriseFormGroup.getRawValue();
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

  addValidationOnOtpField() {
    const otpControl = this.enterpriseFormGroup.get('otp');
    otpControl.setValidators([Validators.required, Validators.minLength(4), Validators.maxLength(4)]);
    otpControl.updateValueAndValidity();
  }

  createEnquiry() {
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
      mx_Page_Url: this.pageUrl,
      mx_Space_Type: 'Web Coworking'
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

  addSeoTags() {
    this.loading = true;
    this.seoService.getMeta('coworking-brand').subscribe(seoMeta => {
      if (seoMeta) {
        this.seoData = {
          title: seoMeta.title,
          image: 'https://cofynd.com/assets/images/meta/cofynd-facebook.jpg',
          description: seoMeta.description,
          url: environment.appUrl + this.router.url,
          type: 'website',
          footer_title: seoMeta.footer_title,
          footer_description: seoMeta.footer_description,
        };
        this.seoService.setData(this.seoData);
      }
      this.loading = false;
    });
  }

  coworkingBrand = [
    {
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/ddf14d258fbd7fb355a2b5d283792b373f09d1df.jpg',
      title: 'WeWork',
      titleImg: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/93f7fa099b87eccf93812fbff5d13f83a2cc487a.png',
      cityCount: '5+',
      centersCount: '40+',
      url: 'wework'
    },
    {
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/d106a0502a9fd54dddf21f8893b6b56547bb434d.jpg',
      title: 'Awfis',
      titleImg: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/24d34a77dafecc24635767dee0ae7fd250cb3649.jpg',
      cityCount: '14+',
      centersCount: '131+',
      url: 'awfis'
    },
    {
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/ff23e8161d06829f1b26fb0ca1b7302b3380c242.jpg',
      title: '91 Springboard',
      titleImg: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/9d0d32fd1a689722ed5f719d9eab7dbbceeff9f5.png',
      cityCount: '8+',
      centersCount: '24+',
      url: '91-spring-board'
    },
    {
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/66e97384b3e8fff86453c74021b59ee823bed78a.jpg',
      title: 'IndiQube',
      titleImg: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/31965e7c65101640fa945260d7fc2d2430a5b5fd.jpg',
      cityCount: '11+',
      centersCount: '79+',
      url: 'indiqube'
    },
    {
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/25ef9010088dda8f2f34d1f927c97df0e26d4a4c.jpg',
      title: 'bhive',
      titleImg: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/757d099b5bf39eeab60401f5a76f8d3c34f875aa.jpg',
      cityCount: '1',
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
      cityCount: '1',
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
    {
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/0a0ac791c2b37751e82b345513cacc1bcf49aeef.jpg',
      title: 'Incuspaze',
      titleImg: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/e88a6f7c64cd3c0d42d82b788358a53f3654ff6a.png',
      cityCount: '11+',
      centersCount: '21+',
      url: 'incuspaze'
    },
    {
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/3d3fbc6e400a0334948c550e897fbba8ae06ecb9.jpg',
      title: 'The Executive Center',
      titleImg: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/4b40bb7e36e8050df729e15bd19011a5fe763f50.png',
      cityCount: '7+',
      centersCount: '29+',
      url: 'the-executive-center'
    },
    {
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/4c64d35e54f372eb9ecfdfe219782fed0b5de1b2.jpg',
      title: 'Quest Coworks',
      titleImg: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/410266f70fa59ee74956783e045ae6af1570f1e2.png',
      cityCount: '1',
      centersCount: '1',
      url: 'quest-coworks'
    },
    {
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/8dc7c3c3d30a77c5277981fccccd1b37ee3f1866.jpg',
      title: 'Executive Spaces',
      titleImg: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/a3f5442c8c5554c172c63e16884cb4cd28640443.png',
      cityCount: '1',
      centersCount: '8+',
      url: 'executive-spaces'
    },
    {
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/b411094af257c3e20f3bc4941a5c5a4be73bf695.jpg',
      title: 'Urban Vault',
      titleImg: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/f7615b8f52e9271ef61f7838cb00be8846bd2869.png',
      cityCount: '1',
      centersCount: '10+',
      url: 'urban-vault'
    },
    {
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/6f65ba41a83cb464ebef1f5cc0c7d01f3f9d7ce8.jpg',
      title: 'Vatika Business Centre',
      titleImg: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/3aaca250b7b7f016eba8880b632250648337873a.png',
      cityCount: '8+',
      centersCount: '14+',
      url: 'vatika-business-centre'
    },
    {
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/d8b4d53d6eb61de2f93382b58428d71402120d49.jpg',
      title: 'AltF',
      titleImg: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/eacb58c29322fa81ce2b6cae4fe680c257bce084.png',
      cityCount: '3+',
      centersCount: '10+',
      url: 'altf'
    },
    {
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/65b5f1720100dff206f831ee8edfc13ba74f967f.jpg',
      title: 'iSprout',
      titleImg: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/b6d1dbcd16ac61de0f3e71d9df46d6daed4905c3.png',
      cityCount: '5+',
      centersCount: '12+',
      url: 'isprout'
    },
    {
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/bff2b773e9912ccafde644db301f04c034d3356a.jpg',
      title: 'iKeva',
      titleImg: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/f9dcb6d16660411670f9048426794e2be61c2218.png',
      cityCount: '3+',
      centersCount: '9+',
      url: 'ikeva'
    },
    {
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/9c2804430ce722711c914b24157a326ccda7541a.jpg',
      title: 'Unispace',
      titleImg: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/407e83f08d87aa32d762defeea366460024945ea.png',
      cityCount: '3+',
      centersCount: '4+',
      url: 'unispace'
    },
    {
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/ba465d34e05add8d8085213c0ff58efed7d0abef.jpg',
      title: 'Incubex',
      titleImg: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/5d06396c7e271d690e02ece716dde6cc14ac8fa3.png',
      cityCount: '1',
      centersCount: '9+',
      url: 'Incubex'
    },
    {
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/16cb0742b7a869edfb8829d0a9fd3871c867c26e.jpg',
      title: 'InstaOffice',
      titleImg: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/17870b28354c41ede388e5c30c67d196cfb05f08.png',
      cityCount: '5+',
      centersCount: '12+',
      url: 'instaoffice'
    },
    {
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/f724c6dde61a3d68117e7f46cb16352900e9fea8.jpg',
      title: 'Attic',
      titleImg: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/c67f70112db0ce8004f0e0e4ec66a6a5d77aa75e.png',
      cityCount: '2+',
      centersCount: '20+',
      url: 'attic'
    },
    {
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/3827cf0666aa71db56274c2dac8d7f3a27ce6826.jpg',
      title: 'Red Brick',
      titleImg: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/757e7d251801537479b8144c41715193deac40d2.png',
      cityCount: '3+',
      centersCount: '20+',
      url: 'red-brick'
    },
    {
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/d76cf8783a905b3c915581b2fe90ab9ce6a7a582.jpg',
      title: 'Co-offiz',
      titleImg: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/161f49b52c978c0e6d7c6c9bc2f0f5f661d7e794.png',
      cityCount: '3+',
      centersCount: '6+',
      url: 'co-offiz'
    },
    {
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/a09393ad34a42eb837addfc58f767adf231aac09.jpg',
      title: '2gethr',
      titleImg: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/7045d35ffebd6406d0e06435a20170632720a3f5.png',
      cityCount: '1',
      centersCount: '2+',
      url: '2gethr'
    },
    {
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/b9fa4a3264a1574fb50983b26efe56cb6a43b1c4.jpg',
      title: 'Cokarma',
      titleImg: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/2de3b67fe56a2a3f27e87a15e8274e9879ba28be.png',
      cityCount: '1',
      centersCount: '6+',
      url: 'cokarma'
    },
    {
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/81d86ee71f723fc47d79900d0322e327ee0e2f2b.jpg',
      title: 'Hustlehub',
      titleImg: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/19b2988e22dde888bceff0dfe01de7396ac0a4e4.png',
      cityCount: '1',
      centersCount: '7+',
      url: 'hustlehub'
    },
    {
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/c3a4d48f6baca4a83670df38989f91cd8781a437.png',
      title: 'Regus',
      titleImg: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/110cef286adc7438c01bc32985895c41a574d31a.png',
      cityCount: '26+',
      centersCount: '126+',
      url: 'regus'
    },
    {
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/080e60469ed6643cd1e9f8a1b252fc57596565b9.jpg',
      title: 'CorporatEdge',
      titleImg: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/31d9047c3912ba7b69083657ee422a9cb9630375.png',
      cityCount: '3+',
      centersCount: '5+',
      url: 'corporatedge'
    },
    {
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/630b464f0dc306508a93333fd7a974a282d9abab.jpg',
      title: 'Supremework',
      titleImg: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/5cad925c923c3f370452fbfe03d2239f312687d3.png',
      cityCount: '3+',
      centersCount: '9+',
      url: 'supremework'
    },
    {
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/94ba3ead1d15eaa0205744d942a8ba0af795e9b0.jpg',
      title: 'reOffice',
      titleImg: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/3945c4d9eea68275153e1ccfa80a431b93c32f56.png',
      cityCount: '3+',
      centersCount: '4+',
      url: 'reoffice'
    },
    {
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/cd189533a61f10480a858df10dcd5e6bd1c63079.jpg',
      title: 'Smart Works',
      titleImg: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/73c2d9f1d6ce9c0128b6cbc6529891fa9b8937a1.png',
      cityCount: '9+',
      centersCount: '36+',
      url: 'smart-works'
    },
  ]

  scrollToElement(element: HTMLElement) {
    element.scrollIntoView({ behavior: 'smooth' });
  }


  goToLink(url: any) {
    window.open(`/coworking-brand/${url}`, '_blank');
  }


}
