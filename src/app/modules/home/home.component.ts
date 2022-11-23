import { HomeMenuModalComponent } from './home-menu-modal/home-menu-modal.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ChangeDetectionStrategy, Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { SeoSocialShareData } from '@core/models/seo.model';
import { SeoService } from '@core/services/seo.service';
import { environment } from '@env/environment';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BrandService } from '@core/services/brand.service';
import { sanitizeParams } from '@app/shared/utils';
import { Brand } from '@core/models/brand.model';
import { DOCUMENT } from '@angular/common';
import { NguCarousel, NguCarouselConfig, NguCarouselStore } from '@ngu/carousel';
import { CuratedCityPopupComponent } from '@app/shared/components/curated-city-popup/curated-city-popup.component';
import { WorkSpaceService } from '@app/core/services/workspace.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UserService } from '@app/core/services/user.service';
import { ToastrService } from 'ngx-toastr';

interface PopularSpace {
  name: string;
  address: string;
  image: string;
  id: string;
  slug?: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  menuModalRef: BsModalRef;
  seoData: SeoSocialShareData;
  coworkingBrands: Brand[] = [];
  popularCoWorkingSpaces: PopularSpace[] = [];
  coLivingBrands: Brand[] = [];
  coworkingImages: any = [];
  colivingImages: any = [];
  coworkingBrandAdsImages: any = [];
  colivingBrandAdsImages: any = [];
  popularSpaceCarousel: NguCarousel<PopularSpace>;
  active = 0;
  submitted = false;

  carouselConfig: NguCarouselConfig = {
    grid: { xs: 1.4, sm: 1.4, md: 3, lg: 4, all: 0 },
    slide: 1,
    speed: 250,
    point: {
      visible: true,
    },
    interval: { timing: 4000, initialDelay: 1000 },
    load: 4,
    velocity: 0,
    touch: true,
    easing: 'cubic-bezier(0, 0, 0.2, 1)',
  };
  loading: boolean = true;
  contactUserName: any;
  showSuccessMessage: boolean = false;

  onSliderMove(slideData: NguCarouselStore) {
    this.active = slideData.currentSlide;
  }

  goToPrev() {
    this.popularSpaceCarousel.moveTo(this.active - 1);
  }

  goToNext() {
    this.popularSpaceCarousel.moveTo(this.active + 1);
  }

  removedash(name: string) {
    return name.replace(/-/, ' ');
  }

  openCoLivingSpace(slug: string) {
    this.router.navigate([`/co-living/${slug}`]);
  }
  openWorkSpace(slug: string) {
    this.router.navigate([`/coworking/${slug.toLowerCase().trim()}`]);
  }
  popularCoLivingSpaces = [
    {
      name: 'Bangalore',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/f81fe9b1a46d8fd9658cd5b0dcb3bd0939a2d280.jpg',
      slug: 'bangalore',
      address: "India's Silicon Valley",
    },
    {
      name: 'Hyderabad',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/982cbdfd30aa937b17c1c2e78d004f762e2eba3b.jpg',
      slug: 'hyderabad',
      address: 'A City of Nawabs',
    },
    {
      name: 'Gurugram',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/e0801ecc67c7d1f30fde3a58ba65f2919236f28a.jpg',
      slug: 'gurugram',
      address: 'A Millennium City',
    },
    {
      name: 'Pune',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/a1898ea4ba525ab2083d5a65fc029c30b4f9b16d.jpg',
      slug: 'pune',
      address: 'Queen of the Deccan',
    },

    {
      name: 'Mumbai',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/91963d7cede91e6a1660edde9f9dce8b07b3d039.jpg',
      slug: 'mumbai',
      address: 'A City of Dreams',
    },

    {
      name: 'Delhi',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/6e985d7ed0a199d4c7d6f08e3562c2329365c403.jpg',
      slug: 'delhi',
      address: 'The Nation Capital',
    },

    {
      name: 'Noida',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/5d5bccbd166e278cdc3200d4ec12a8af9fa4b5ec.jpg',
      slug: 'noida',
      address: 'The Hitech City',
    },
  ];

  constructor(
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document,
    private brandService: BrandService,
    private seoService: SeoService,
    private bsModalService: BsModalService,
    private router: Router,
    private workSpaceService: WorkSpaceService,
    private _formBuilder: FormBuilder,
    private userService: UserService,
    private toastrService: ToastrService,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.addSeoTags();
    this.setScript();
    this.getPopularCoworkingSpace();
    this.getFeaturedImages();
    this.getBrandAdsImages();
  }

  ngOnInit(): void {
    this.getFeaturedImages();
    forkJoin([
      this.brandService.getBrands(sanitizeParams({ type: 'coworking' })),
      this.brandService.getBrands(sanitizeParams({ type: 'coliving' })),
    ]).subscribe(res => {
      this.coLivingBrands = res[1];
      this.coworkingBrands = res[0].filter(
        brand => brand.name !== 'others' && brand.name !== 'AltF' && brand.name !== 'The Office Pass',
      );
    });
    this.loopColivingSliders();
  }

  enterpriseFormGroup: FormGroup = this._formBuilder.group({
    phone_number: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
    email: ['', [Validators.required, Validators.email]],
    name: ['', Validators.required],
    interested_in: ['', Validators.required],
    city: ['', Validators.required],
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
    this.showSuccessMessage = false;
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
        interested_in: this.enterpriseFormGroup.controls['interested_in'].value,
        city: this.enterpriseFormGroup.controls['city'].value,
      };
      this.userService.createLead(object).subscribe(
        () => {
          this.loading = false;
          this.showSuccessMessage = true;
          this.toastrService.success('your enquiry submmited successfully.');
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

  loopColivingSliders() {
    let combinedArray = [];
    for (let index = 0; index < this.popularCoLivingSpaces.length * 4; index++) {
      combinedArray.push(this.popularCoLivingSpaces);
    }
    this.popularCoLivingSpaces = [].concat.apply([], combinedArray);
  }
  loopCoworkingSliders() {
    let combinedArray = [];
    for (let index = 0; index < this.popularCoWorkingSpaces.length * 4; index++) {
      combinedArray.push(this.popularCoWorkingSpaces);
    }
    this.popularCoWorkingSpaces = [].concat.apply([], combinedArray);
  }
  getFeaturedImages() {
    this.brandService.getFeaturedImages().subscribe((res: any) => {
      this.coworkingImages = res.filter(city => city.for_coWorking === true);
      this.colivingImages = res.filter(city => city.for_coLiving === true);
    });
  }
  getBrandAdsImages() {
    this.brandService.getBrandAdsImages().subscribe((res: any) => {
      this.coworkingBrandAdsImages = res.filter(city => city.for_coWorking === true);
      this.colivingBrandAdsImages = res.filter(city => city.for_coLiving === true);
    });
  }
  getPopularCoworkingSpace() {
    this.workSpaceService.popularWorkSpacesCountryWise({ countryId: '6231ae062a52af3ddaa73a39' }).subscribe(spaces => {
      this.popularCoWorkingSpaces = spaces;
      this.loopCoworkingSliders();
    });
  }
  setScript() {
    let script = this._renderer2.createElement('script');
    script.type = `application/ld+json`;
    script.text = `{
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "CoFynd",
      "url": "https://cofynd.com/",
      "logo": "https://cofynd.com/assets/images/logo.svg",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "9355489999",
        "contactType": "sales",
        "areaServed": "IN",
        "availableLanguage": "en"
      },
      "sameAs": [
        "https://facebook.com/cofynd",
        "https://instagram.com/cofynd",
        "https://linkedin.com/company/cofynd1",
        "https://www.youtube.com/channel/UCnr7dufMlNHG5o7X7tJMVWA",
        "https://en.wikipedia.org/wiki/CoFynd",
        "https://cofynd.com/"
      ]
    }`;
    this._renderer2.appendChild(this._document.body, script);
  }
  openModal(price) {
    this.bsModalService.show(CuratedCityPopupComponent, {
      class: 'modal-dialog-centered',
      initialState: {
        price,
      },
    });
  }

  openModalWithComponent(openForDayPass = false) {
    if (openForDayPass) {
      const initialState = {
        dayPassPopUp: true,
        class: 'modal-dialog-centered',
      };
      this.menuModalRef = this.bsModalService.show(HomeMenuModalComponent, {
        initialState,
      });
      return;
    }

    this.menuModalRef = this.bsModalService.show(HomeMenuModalComponent, {
      class: 'modal-dialog-centered',
    });
  }

  openModalWithComponent2(spaceType: string) {
    const initialState = {
      class: 'modal-dialog-centered',
    };
    // will disable
    initialState['enabledForCustomizeOffice'] = false;
    initialState['virArtShoot'] = false;
    //

    initialState['enabledForm'] = true;
    initialState['space'] = spaceType;
    initialState['Interested_in'] = spaceType;

    this.menuModalRef = this.bsModalService.show(HomeMenuModalComponent, {
      initialState,
    });
  }

  addSeoTags() {
    this.seoService.getMeta('home').subscribe(seoMeta => {
      this.seoData = {
        title: seoMeta.title,
        image: 'https://cofynd.com/assets/images/meta/cofynd-facebook.jpg',
        description: seoMeta.description,
        url: environment.appUrl,
        type: 'website',
        footer_description: seoMeta.footer_description,
      };
      this.seoService.setData(this.seoData);
    });
  }

  openAdd() {
    this.router.navigate([`enterprise`]);
  }
}
