import { OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorkSpaceService } from '@core/services/workspace.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ChangeDetectionStrategy, Component, Inject, Renderer2 } from '@angular/core';
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
import { AVAILABLE_CITY } from '@app/core/config/cities';
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
  selector: 'app-country-coliving-vertical-page',
  templateUrl: './country-coliving-vertical-page.component.html',
  styleUrls: ['./country-coliving-vertical-page.component.scss'],
})
export class CountryColivingVerticalPageComponent implements OnInit {
  menuModalRef: BsModalRef;
  seoData: SeoSocialShareData;
  coworkingBrands: Brand[] = [];
  coLivingBrands: Brand[] = [];
  popularCoWorkingSpaces: PopularSpace[] = [];
  cities: City[];
  title: string;

  popularCoLivingSpaces = [
    {
      name: 'Hei Homes The Penthouse',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/a1fb1dd1015a02d6fbaea654ec1babbd0e8fcbf7.jpg',
      slug: 'river-valley',
      address: '7 Temasek Boulevard, river-valley',
    },
  ];

  service = [
    {
      title: 'Fully Furnished',
      description:
        'Live in a fully furnished space and unlock the benefits such as community, comfort and cost-saving.',
      icon: 'amenities/fully-furnished.svg',
    },
    {
      title: 'No Extra Bills',
      description: 'No need to give extra bills. Just book your desired space, live with freedom and enjoy the ride.',
      icon: 'amenities/no-booking-fee.svg',
    },
    {
      title: 'Flexible Lease',
      description:
        'There is a presence of flexible lease terms and countless amenities. No need to worry just live with glory.',
      icon: 'amenities/security.svg',
    },
    {
      title: 'Regular Cleaning',
      description:
        'We aim to provide the best experience, Thus regular cleaning activities are taken care of on a priority basis.',
      icon: 'amenities/housekeeping.svg',
    },
    {
      title: 'Professional Host',
      description:
        'Community managers are always available for you to help out with any problems. So, now say goodbye to live-in landlords.',
      icon: 'workspace/day-pass.svg',
    },
    {
      title: 'Amazing Community',
      description:
        'We make sure you interact with wonderful people and build an amazing community. Live & enjoy your living journey with us.',
      icon: 'amenities/meeting-room.svg',
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
            this.cities = res.data.filter(city => city.for_coLiving === true);
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
        name: 'Hei Homes The Penthouse',
        address: '7 Temasek Boulevard, river-valley',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/a1fb1dd1015a02d6fbaea654ec1babbd0e8fcbf7.jpg',
        slug: 'hei-homes-the-penthouse-river-valley',
        starting: 'SGD700.00',
        country: 'singapore',
      },
    ],
  };
  routeToCity(city, country_name, country_id) {
    localStorage.setItem('country_name', country_name);
    localStorage.setItem('country_id', country_id);
    this.router.navigate([`${country_name.toLowerCase().trim()}/co-living/${city.toLowerCase().trim()}`]);
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
    this.seoService.getMeta(`${this.country_name}-co-living`).subscribe(seoMeta => {
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
    this.router.navigate([`${this.country_name.toLowerCase().trim()}/co-living/${_centerCity.toLowerCase().trim()}`]);
  }
}
