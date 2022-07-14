import { HomeMenuModalComponent } from './home-menu-modal/home-menu-modal.component';
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
import { NguCarousel, NguCarouselConfig, NguCarouselStore } from '@ngu/carousel';
import { CuratedCityPopupComponent } from '@app/shared/components/curated-city-popup/curated-city-popup.component';
import { WorkSpaceService } from '@app/core/services/workspace.service';



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
export class HomeComponent {


  menuModalRef: BsModalRef;
  seoData: SeoSocialShareData;
  coworkingBrands: Brand[] = [];
  popularCoWorkingSpaces: PopularSpace[] = [];
  coLivingBrands: Brand[] = [];
  coworkingImages: any = [];
  colivingImages: any = [];
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
    return name.replace(/-/, ' ')
  }

  
  openCoLivingSpace(slug: string) {
    this.router.navigate([`/co-living/${slug}`]);
  }
  openWorkSpace(slug: string){
    this.router.navigate([`/coworking/${slug.toLowerCase().trim()}`]);
  }
  popularCoLivingSpaces = [
    {
      name: 'Delhi',
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/30c9886ab2f435389383acff8e74d1feb508e2f9.jpg',
      slug: 'delhi',
      address: 'The Nation Capital',

    },
    {
      name: 'Gurugram',
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/e0801ecc67c7d1f30fde3a58ba65f2919236f28a.jpg',
      slug: 'gurugram',
      address: 'A Millennium City',
    },
    {
      name: 'Noida',
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/ae54cf7e062c1b1730f9232a89082f703c343fc5.jpg',
      slug: 'noida',
      address: 'The Hitech City',
    },
    {
      name: 'Bangalore',
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/74a8090ee807625aa2b4aba29c4d35de02cbf5d8.jpg',
      slug: 'bangalore',
      address: "India's Silicon Valley",
    },
    {
      name: 'Hyderabad',
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/45755519ffdf69dc1b1178cf777ee6df98ced7b1.jpg',
      slug: 'hyderabad',
      address: "A City of Nawabs",
    },
    {
      name: 'Mumbai',
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/91963d7cede91e6a1660edde9f9dce8b07b3d039.jpg',
      slug: 'mumbai',
      address: "A City of Dreams",
    },
    {
      name: 'Pune',
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/0a95ef141b67882a1a8f5e7bd5e23590b54595d0.jpg',
      slug: 'pune',
      address: "Queen of the Deccan",
    },
    // {
    //   name: 'Goa',
    //   image: ' ',
    //   slug: 'goa',
    //   address: "Paradise of South Asia",
    // },
  ]

  constructor(
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document,
    private brandService: BrandService,
    private seoService: SeoService,
    private bsModalService: BsModalService,
    private router: Router,
    private workSpaceService: WorkSpaceService,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.addSeoTags();
    this.setScript();
    this.getPopularCoworkingSpace();

    
  }

  ngOnInit(): void {
    this.getPopularCoworkingSpace();
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
   
  }
  getFeaturedImages() {
    this.brandService.getFeaturedImages().subscribe((res: any) => {
      this.coworkingImages = res.filter(city => city.for_coWorking === true);
      this.colivingImages = res.filter(city => city.for_coLiving === true);
      console.log(this.coworkingImages, this.colivingImages);
    })
  }
  getPopularCoworkingSpace(){
    this.workSpaceService.popularWorkSpacesCountryWise({ countryId: '6231ae062a52af3ddaa73a39' }).subscribe(spaces => {
      this.popularCoWorkingSpaces = spaces;
      console.log("popularCoWorkingSpaces",this.popularCoWorkingSpaces);
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
    this.router.navigate([`coworking/awfis-ambience-mall`]);
  }
}
