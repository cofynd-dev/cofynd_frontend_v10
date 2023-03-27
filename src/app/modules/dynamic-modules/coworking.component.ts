import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorkSpaceService } from '@core/services/workspace.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Inject, Renderer2 } from '@angular/core';
import { SeoSocialShareData } from '@core/models/seo.model';
import { SeoService } from '@core/services/seo.service';
import { environment } from '@env/environment';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BrandService } from '@core/services/brand.service';
import { sanitizeParams } from '@app/shared/utils';
import { Brand } from '@core/models/brand.model';
import { DOCUMENT } from '@angular/common';
import { HomeMenuModalComponent } from '../home/home-menu-modal/home-menu-modal.component';
import { AVAILABLE_CITY } from '@app/core/config/cities';
import { City } from '@app/core/models/city.model';
import { NguCarousel, NguCarouselConfig, NguCarouselStore } from '@ngu/carousel';

interface PopularSpace {
  name: string;
  address: string;
  image: string;
  id: string;
  slug?: string;
}

@Component({
  selector: 'app-coworking',
  templateUrl: './coworking.component.html',
  styleUrls: ['./coworking.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoworkingComponent implements OnInit {
  menuModalRef: BsModalRef;
  seoData: SeoSocialShareData;
  coworkingBrands: Brand[] = [];
  coLivingBrands: Brand[] = [];
  cities: City[];

  @ViewChild('popularSpaceCarousel', { static: false })
  popularSpaceCarousel: NguCarousel<PopularSpace>;
  active = 0;

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

  popularCoLivingSpaces = [
    {
      name: 'Hei Homes The Penthouse',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/a1fb1dd1015a02d6fbaea654ec1babbd0e8fcbf7.jpg',
      slug: 'river-valley',
      address: '7 Temasek Boulevard, river-valley',
    },
  ];

  title: string;

  constructor(
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document,
    private brandService: BrandService,
    private seoService: SeoService,
    private bsModalService: BsModalService,
    private workSpaceService: WorkSpaceService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };
    // window.location.reload()
    var someString = this.router.url;
    someString = someString.replace(/\//g, '');
    this.title = someString;
    this.workSpaceService.getCountryByName(someString).subscribe(
      (res: any) => {
        if (res && res.data == null) {
          this.router.navigate(['/404'], { skipLocationChange: true });
        }
        localStorage.setItem('country_name', res.data.name);
        localStorage.setItem('country_id', res.data.id);
        this.workSpaceService.getCity(res.data.id).subscribe((res: any) => {
          this.cities = res.data.filter(city => city.for_coWorking === true);
        });
      },
      error => {
        if (error.status === 404) {
          this.router.navigate(['/404'], { skipLocationChange: true });
        }
      },
    );
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
  }
  routeToCity(city, country_name, country_id) {
    localStorage.setItem('country_name', country_name);
    localStorage.setItem('country_id', country_id);
    this.router.navigate([`${country_name.toLowerCase().trim()}/coworking/${city.toLowerCase().trim()}`]);
  }
  routeToVerticalPage() {
    this.router.navigate([`${this.title.toLowerCase().trim()}/coworking`]);
  }
  routeToColivingVerticalPage() {
    this.router.navigate([`${this.title.toLowerCase().trim()}/co-living`]);
  }
  removedash(name: string) {
    return name.replace(/-/, ' ');
  }

  goToPrev() {
    this.popularSpaceCarousel.moveTo(this.active - 1);
  }

  goToNext() {
    this.popularSpaceCarousel.moveTo(this.active + 1);
  }

  onSliderMove(slideData: NguCarouselStore) {
    this.active = slideData.currentSlide;
  }

  openWorkSpace(space) {
    this.router.navigate([`${this.title.toLowerCase().trim()}/co-living/${space.slug.toLowerCase().trim()}`]);
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
    this.seoService.getMeta(this.title).subscribe(seoMeta => {
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
}
