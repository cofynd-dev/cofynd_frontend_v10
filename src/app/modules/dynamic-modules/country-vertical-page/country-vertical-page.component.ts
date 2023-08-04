import { OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorkSpaceService } from '@core/services/workspace.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, Inject, Renderer2 } from '@angular/core';
import { SeoSocialShareData } from '@core/models/seo.model';
import { SeoService } from '@core/services/seo.service';
import { environment } from '@env/environment';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BrandService } from '@core/services/brand.service';
import { sanitizeParams } from '@app/shared/utils';
import { Brand } from '@core/models/brand.model';
import { DOCUMENT } from '@angular/common';
import { HomeMenuModalComponent } from '../../home/home-menu-modal/home-menu-modal.component';
import { City } from '@app/core/models/city.model';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

interface PopularSpace {
  name: string;
  address: string;
  image: string;
  id: string;
  slug?: string;
}

@Component({
  selector: 'app-country-vertical-page',
  templateUrl: './country-vertical-page.component.html',
  styleUrls: ['./country-vertical-page.component.scss'],
})
export class CountryVerticalPageComponent implements OnInit {
  menuModalRef: BsModalRef;
  seoData: SeoSocialShareData;
  coworkingBrands: Brand[] = [];
  coLivingBrands: Brand[] = [];
  popularCoWorkingSpaces: PopularSpace[] = [];
  cities: City[];
  title: string;

  popularCoLivingSpaces = [
    {
      name: 'Delhi',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/19a85ebc62e685a77d8185fd041191baaa1354c1.jpg',
      slug: 'delhi',
      address: 'The Nation Capital',
    },
    {
      name: 'Gurugram',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/e0801ecc67c7d1f30fde3a58ba65f2919236f28a.jpg',
      slug: 'gurugram',
      address: 'A Millennium City',
    },
    {
      name: 'Noida',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/3cf39ce402e67c8fad130db6b0dae64915e20cd2.jpg',
      slug: 'noida',
      address: 'The Hitech City',
    },
    {
      name: 'Bangalore',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/da4a46369387bbd79f2c178e07944090e50d58a7.jpg',
      slug: 'bangalore',
      address: "India's Silicon Valley",
    },
    {
      name: 'Hyderabad',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/7ba01fdedce7ac6846cc542b84ee146cededc36c.jpg',
      slug: 'hyderabad',
      address: 'A City of Nawabs',
    },
    {
      name: 'Mumbai',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/91963d7cede91e6a1660edde9f9dce8b07b3d039.jpg',
      slug: 'mumbai',
      address: 'A City of Dreams',
    },
    {
      name: 'Pune',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/0a95ef141b67882a1a8f5e7bd5e23590b54595d0.jpg',
      slug: 'pune',
      address: 'Queen of the Deccan',
    },
  ];

  service = [
    {
      title: 'High Speed WiFi',
      description: 'High-Speed Wifi, HDTVs everything you need to do your best work.',
      icon: 'amenities/wifi.svg',
    },
    {
      title: 'Comfy Workstation',
      description: 'Connect with other people and share your skills for better and quick growth.',
      icon: 'amenities/workstation.svg',
    },
    {
      title: 'Meeting Rooms',
      description: 'Come up with great ideas and engage in valuable discussions in meeting rooms.',
      icon: 'amenities/meeting-room.svg',
    },
    {
      title: 'Printer',
      description: 'Printing and scanning facilities available without any extra cost.',
      icon: 'amenities/printer.svg',
    },

    {
      title: 'Pantry',
      description: 'Lounge, kitchen, breakout rooms, and more. mix of both work tables and lounge seating.',
      icon: 'amenities/kitchen.svg',
    },
    {
      title: 'Parking',
      description: 'Avoid morning hassle with easy and convenient parking area availability.',
      icon: 'amenities/bike-parking.svg',
    },
  ];

  coFyndAdvantages = [
    {
      icon: 'home/work-spaces.svg',
      title: '100,000+ Spaces',
      description:
        'Get access to 100,000+ spaces with easy availability and convenience anytime and anywhere. Space Search Made Simple with CoFynd',
    },
    {
      icon: 'icons/brokerage-icon.svg',
      title: 'Zero Brokerage',
      description:
        'CoFynd is India’s fastest growing space discovery platform that doesn’t charge any brokerage from the customers.',
    },
    {
      icon: 'home/support.svg',
      title: '100% Offline Support',
      description:
        'We provide you 100% offline support from giving you the various space options, scheduling the site visit, booking the space to the after-sales support also.',
    },
  ];

  chooseCoworking = [
    {
      icon: 'icons/brokerage-icon.svg',
      title: 'Zero Brokerage',
      description: 'Find a space on Cofynd is Fast, simple and Free',
    },
    {
      icon: 'icons/pricing-tag-icon.svg',
      title: 'Exclusive Pricing & Verified Spaces',
      description: 'Spaces Listed on cofynd have been verified by cofynd space team',
    },
    {
      icon: 'icons/pan-india-icon.svg',
      title: 'PAN India Coverage',
      description: 'We cover India like no one else, Office Spaces across all major Indian Cities',
    },
  ];

  country_name: string;
  constructor(
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document,
    private brandService: BrandService,
    private seoService: SeoService,
    private bsModalService: BsModalService,
    private workSpaceService: WorkSpaceService,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    combineLatest(this.activatedRoute.url, this.activatedRoute.queryParams)
      .pipe(map(results => ({ routeParams: results[0], queryParams: results[1] })))
      .subscribe(results => {
        let complete_url = this.router.url.split('/');
        this.country_name = complete_url[1];
        this.workSpaceService.getCountryByName(this.country_name).subscribe((res: any) => {
          localStorage.setItem('country_name', res.data.name);
          localStorage.setItem('country_id', res.data.id);
          this.workSpaceService.getCity(res.data.id).subscribe((res: any) => {
            this.cities = res.data.filter(city => city.for_coWorking === true);
          });
        });
      });
    this.addSeoTags();
    this.setScript();
  }

  ngOnInit(): void {
    forkJoin([
      this.brandService.getBrands(sanitizeParams({ type: 'coworking' })),
      this.brandService.getBrands(sanitizeParams({ type: 'coliving' })),
    ]).subscribe(res => {
      this.coLivingBrands = res[1];
      this.coworkingBrands = res[0].filter(
        brand => brand.name !== 'others' && brand.name !== 'AltF' && brand.name !== 'The Office Pass',
      );
    });
    this.getPopularWorSpacesAsCountry();
  }
  spaceForMobile = {
    singapore: [
      {
        name: 'JustCo Asia Green',
        address: '9 Tampines Grande',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/9091dc4dae4376437c71ea7c145159dc6c3f6d96.jpg',
        slug: 'justco-asia-green',
        starting: 'SGD398.00',
        country: 'singapore',
      },
      {
        name: 'WeWork Tanjong Pagar',
        address: '60 Anson Road',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/1ba55e3a0ecd8b8bd4b60af541397270d41824b1.jpg',
        slug: 'wework-tanjong-pagar',
        starting: 'SGD250.00',
        country: 'singapore',
      },
      {
        name: 'JustCo The Centrepoint',
        address: '176 Orchard Rd',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/b68964508847d2c04b565aa318f0b3b0bf579079.jpg',
        slug: 'justco-the-centrepoint',
        starting: 'SGD398.00',
        country: 'singapore',
      },
      {
        name: 'The Great Room Raffles',
        address: '328 North Bridge Rd',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/d76cf8783a905b3c915581b2fe90ab9ce6a7a582.jpg',
        slug: 'the-great-room-raffles-arcade',
        starting: 'SGD750.00',
        country: 'singapore',
      },

      {
        name: 'The Great Room',
        address: 'The Great Room Centennial Tower',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/271cbcd3d2d9cf2df6b806a7d5f47ecb3763e33b.jpg',
        slug: 'the-great-room-centennial-tower',
        starting: 'SGD750.00',
        country: 'singapore',
      },
      {
        name: 'JustCo The Metropolis',
        address: '9 North Buona Vista Drive',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/6760ed9db92bfdb04932eed0ed8bbee2799ef755.jpg',
        slug: 'justco-the-metropolis',
        starting: 'SGD398.00',
        country: 'singapore',
      },
    ],
  };
  routeToCity(city, country_name, country_id) {
    localStorage.setItem('country_name', country_name);
    localStorage.setItem('country_id', country_id);
    this.router.navigate([`${country_name.toLowerCase().trim()}/coworking/${city.toLowerCase().trim()}`]);
  }
  removedash(name: string) {
    return name.replace(/-/, ' ');
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

  ngAfterViewInit() {
    this.cdr.detectChanges();
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
  openModalWithComponent(spaceType: string) {
    const initialState = {
      class: 'modal-dialog-centered',
    };
    initialState['enabledForm'] = true;
    initialState['space'] = spaceType;
    initialState['Interested_in'] = spaceType;
    this.menuModalRef = this.bsModalService.show(HomeMenuModalComponent, {
      initialState,
    });
  }

  addSeoTags() {
    this.seoService.getMeta(`${this.country_name}-coworking`).subscribe(seoMeta => {
      this.seoData = {
        title: seoMeta.title,
        image: 'https://cofynd.com/assets/images/meta/cofynd-facebook.jpg',
        description: seoMeta.description,
        url: environment.appUrl,
        type: 'website',
        footer_title: seoMeta.footer_title,
        footer_description: seoMeta.footer_description,
      };
      this.seoService.setData(this.seoData);
    });
  }

  openAdd() {
    // this.router.navigate([`coworking/awfis-ambience-mall`]);
  }

  getPopularWorSpacesAsCountry() {
    this.workSpaceService
      .popularWorkSpacesCountryWise({ countryId: localStorage.getItem('country_id') })
      .subscribe(spaces => {
        this.popularCoWorkingSpaces = spaces;
        this.cdr.detectChanges();
      });
  }

  openWorkSpace(_centerCity) {
    this.router.navigate([
      `${_centerCity.country.toLowerCase().trim()}/coworking/${_centerCity.city.toLowerCase().trim()}`,
    ]);
  }
}
