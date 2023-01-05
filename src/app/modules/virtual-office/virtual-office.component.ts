import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AVAILABLE_CITY_VIRTUAL_OFFICE } from '@app/core/config/cities';
import { Brand } from '@app/core/models/brand.model';
import { SeoSocialShareData } from '@app/core/models/seo.model';
import { BrandService } from '@app/core/services/brand.service';
import { SeoService } from '@app/core/services/seo.service';
import { CuratedCityPopupComponent } from '@app/shared/components/curated-city-popup/curated-city-popup.component';
import { sanitizeParams } from '@app/shared/utils';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { forkJoin } from 'rxjs';
import { VirtualOfficeModalComponent } from './virtual-office-modal/virtual-office-modal.component';
import { Observable, Subscriber } from 'rxjs';
import { WorkSpaceService } from '@app/core/services/workspace.service';
import { PriceFilter, WorkSpace } from '@core/models/workspace.model';
import { environment } from '@env/environment';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UserService } from '@app/core/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-virtual-office',
  templateUrl: './virtual-office.component.html',
  styleUrls: ['./virtual-office.component.scss'],
})
export class VirtualOfficeComponent implements OnInit {
  menuModalRef: BsModalRef;
  loading: boolean;
  coworkingBrands: Brand[] = [];
  coLivingBrands: Brand[] = [];
  seoData: SeoSocialShareData;
  cities = AVAILABLE_CITY_VIRTUAL_OFFICE.filter(city => city.for_virtualOffice === true);
  service = [
    {
      title: 'Company Registration',
      description: 'Register your company in your desired city without having any physical address there.',
      icon: 'workspace/day-pass.svg',
    },
    {
      title: 'Meeting Room Access',
      description: 'Get free complimentary hours of meeting rooms every month for client meetings.',
      icon: 'amenities/meeting-room.svg',
    },
    {
      title: 'GST Registration',
      description: 'Get a GST number for your company with all documents like NOC, Signage, Electricity Bill & more.',
      icon: 'workspace/hot-desk.svg',
    },
    {
      title: 'Mailing Address',
      description:
        'Collect all couriers at your virtual office address and forwarded them to the address given by you.',
      icon: 'workspace/dedicated-desk.svg',
    },
    {
      title: 'Business Address',
      description:
        'Get your business address in the prestigious location and mention it on your visiting card and website.',
      icon: 'workspace/private-cabin.svg',
    },
    {
      title: 'Reception Services',
      description: 'Get reception services for client handling, guest greeting and customer support.',
      icon: 'amenities/reception.svg',
    },
  ];

  popularVirtualOffice = [
    {
      // address: 'Delhi',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/8d5c421e7cb218a73798507ddaeb27964e7e3df9.jpg',
      name: 'Delhi',
      price: '15,500',
      slug: 'virtual-office/delhi',
    },
    {
      // address: 'Gurugram',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/e38aba6f636873daba5d3562f2705583cba27839.jpg',
      name: 'Gurugram',
      price: '18,000',
      slug: 'virtual-office/gurugram',
    },
    {
      // address: `Noida`,
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/b8dffaef4e7bc6d43b24af2ce95def9ac5769631.jpg',
      name: 'Noida',
      price: '15,500',
      slug: 'virtual-office/noida',
    },
    {
      // address: 'Bangalore',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/6fc88348b18f4e1ccd4c276f339fcd34db5760ad.jpg',
      name: 'Bangalore',
      price: '12,000',
      slug: 'virtual-office/bangalore',
    },
    {
      // address: 'Hyderabad',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/3bb526e232c21916cbe79664eb0acc86ef2a83c0.jpg',
      name: 'Hyderabad',
      price: '18,000',
      slug: 'virtual-office/hyderabad',
    },
    {
      // address: 'Mumbai',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/8069d9d3d68c32e73896f3c40b62ab34c87f5a9d.jpg',
      name: 'Mumbai',
      price: '11,988',
      slug: 'virtual-office/mumbai',
    },
    {
      // address: 'Chennai',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/59fc8cbecde3c4a14320ab01a12b1c43945a7dea.jpg',
      name: 'Chennai',
      price: '12,000',
      slug: 'virtual-office/chennai',
    },
    // {
    //   address: ' ',
    //   image: ' ',
    //   name: ' ',
    //   price: ' ',
    // },
  ];
  latitute: any;
  longitute: any;
  workSpaces: WorkSpace[];
  submitted = false;

  constructor(
    private bsModalService: BsModalService,
    private workSpaceService: WorkSpaceService,
    private brandService: BrandService,
    private seoService: SeoService,
    private router: Router,
    private _formBuilder: FormBuilder,
    private userService: UserService,
    private toastrService: ToastrService,
  ) {
    this.loading = true;
    this.getCurrentPosition().subscribe((position: any) => {
      this.latitute = position.latitude;
      this.longitute = position.longitude;
      let queryParams = {
        limit: 20,
        latitude: this.latitute,
        longitude: this.longitute,
      };
      this.loadWorkSpacesByLatLong(queryParams);
    });
  }

  queryFormGroup: FormGroup = this._formBuilder.group({
    phone_number: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
    email: ['', [Validators.required, Validators.email]],
    name: ['', Validators.required],
    city: ['', Validators.required],
    requirements: [''],
  });

  get f(): { [key: string]: AbstractControl } {
    return this.queryFormGroup.controls;
  }

  get emailid() {
    return this.queryFormGroup.controls;
  }

  get mobno() {
    return this.queryFormGroup.controls;
  }

  ngOnInit() {
    forkJoin([
      this.brandService.getBrands(sanitizeParams({ type: 'coworking' })),
      this.brandService.getBrands(sanitizeParams({ type: 'coliving' })),
    ]).subscribe(res => {
      this.coLivingBrands = res[1];
      this.coworkingBrands = res[0].filter(
        brand => brand.name !== 'others' && brand.name !== 'AltF' && brand.name !== 'The Office Pass',
      );
    });
    this.addSeoTags();
  }

  getCurrentPosition(): any {
    return new Observable((observer: Subscriber<any>) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position: any) => {
          observer.next({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          observer.complete();
        });
      } else {
        observer.error();
      }
    });
  }

  loadWorkSpacesByLatLong(param: {}) {
    this.loading = true;
    this.workSpaceService.getWorkspaces(sanitizeParams(param)).subscribe(allWorkSpaces => {
      this.workSpaces = allWorkSpaces.data.filter(
        cat => cat.plans.filter(p => p.category === '6231bca42a52af3ddaa73ab1').length,
      );
      this.loading = false;
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.queryFormGroup.invalid) {
      return;
    } else {
      const object = {
        user: {
          phone_number: this.queryFormGroup.controls['phone_number'].value,
          email: this.queryFormGroup.controls['email'].value,
          name: this.queryFormGroup.controls['name'].value,
          requirements: this.queryFormGroup.controls['requirements'].value,
        },
        city: this.queryFormGroup.controls['city'].value,
        mx_Page_Url: 'Virtual Office Page'
      };
      this.userService.createLead(object).subscribe(
        () => {
          this.loading = false;
          this.queryFormGroup.reset();
          this.submitted = false;
          this.router.navigate(['/thank-you']);
          // this.toastrService.success('Your query submitted successfully, we connect with you soon..');
        },
        error => {
          this.loading = false;
        },
      );
    }
  }

  removedash(name: string) {
    return name.replace(/-/, ' ');
  }

  openOfficeSpace(slug: string) {
    this.router.navigate([`/office-space/rent/${slug}`]);
  }
  openWithFreeSlug(slug: string) {
    this.router.navigate([`${slug}`]);
  }
  routeTodetail(slug: string) {
    this.router.navigate([`/coworking/${slug}`]);
  }

  openModal(price) {
    this.bsModalService.show(CuratedCityPopupComponent, {
      class: 'modal-dialog-centered',
      initialState: {
        price,
      },
    });
  }

  // addSeoTags() {
  //   let seoMeta = {
  //     title: 'Virtual Office in India - Space for GST & Business Registration',
  //     description:
  //       'Virtual Office in India starting ₹1,000 per month offering in 10 Indian cities - Delhi, Noida, Gurgaon, Bangalore, Hyderabad, Pune, Mumbai, Indore, Ahmedabad, Chennai.',
  //   };
  //   if (seoMeta) {
  //     this.seoData = {
  //       title: seoMeta.title,
  //       image: 'https://cofynd.com/assets/images/meta/cofynd-facebook.jpg',
  //       description: seoMeta.description,
  //       type: 'website',
  //     };
  //     this.seoService.setData(this.seoData);
  //   } else {
  //     this.seoData = null;
  //   }
  // }

  addSeoTags() {
    this.loading = true;
    this.seoService.getMeta('virtual-office').subscribe(seoMeta => {
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

  openModalWithComponent(spaceType: string) {
    const initialState = {
      class: 'modal-dialog-centered',
    };
    initialState['enabledForm'] = true;
    initialState['space'] = spaceType;
    initialState['Interested_in'] = spaceType;
    this.menuModalRef = this.bsModalService.show(VirtualOfficeModalComponent, {
      initialState,
    });
  }

  openWorkSpace(slug: string) {
    this.router.navigate([`/virtual-office/${slug.toLowerCase().trim()}`]);
  }

  scrollToElement(element: HTMLElement) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}
