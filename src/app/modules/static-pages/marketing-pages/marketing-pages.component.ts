import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  Component,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DEFAULT_APP_DATA } from '@core/config/app-data';
import { Brand } from '@core/models/brand.model';
import { SeoSocialShareData } from '@core/models/seo.model';
import { BrandService } from '@core/services/brand.service';
import { HelperService } from '@core/services/helper.service';
import { SeoService } from '@core/services/seo.service';
import { environment } from '@env/environment';
import { NguCarousel, NguCarouselConfig } from '@ngu/carousel';
import { USER_REVIEWS } from '@core/config/reviews';
interface MarketingPlan {
  name: string;
  description: string;
  price: number;
  type: 'day' | 'month' | 'hr';
}
interface Review {
  name: string;
  review: string;
  image?: string;
}
@Component({
  selector: 'app-marketing-pages',
  templateUrl: './marketing-pages.component.html',
  styleUrls: ['./marketing-pages.component.scss'],
})
export class MarketingPagesComponent implements OnInit, AfterViewInit, OnDestroy {
  supportPhone = DEFAULT_APP_DATA.contact.phone;
  marketingData: any;
  plans: MarketingPlan[];
  isSticky: boolean;
  isEnquireModal: boolean;
  brands: Brand[] = [];

  reviews: Review[] = USER_REVIEWS;
  active = 0;

  @ViewChild('reviewsCarousel', { static: true })
  reviewsCarousel: NguCarousel<Review>;
  carouselConfig: NguCarouselConfig;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(DOCUMENT) private document: Document,
    private helperService: HelperService,
    private seoService: SeoService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private brandService: BrandService,
  ) {
    this.plans = this.getPlans();
    this.carouselConfig = {
      grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
      speed: 500,
      point: {
        visible: true,
      },
      touch: true,
      loop: true,
      interval: { timing: 4000 },
      animation: 'lazy',
    };
    const url = this.router.url;
    this.marketingData = DEFAULT_APP_DATA.marketing.coworking.find(x => x.url == url);
  }

  ngOnInit() {
    this.addSeoTags();
    this.getBrands();
  }

  addSeoTags() {
    this.seoService.setData(this.marketingData.seoData);
    this.seoService.addNoFollowTag();
  }

  getBrands() {
    this.brandService.getBrands().subscribe(allBrand => {
      this.brands = allBrand.filter(brand => brand.name !== 'others');
    });
  }

  goToBrandPage(brand: Brand) {
    this.router.navigate([`/brand/${brand.slug}`]);
  }

  getPlans(): MarketingPlan[] {
    return [
      {
        name: 'Day Pass',
        description: 'Book and experience the un-conventional work culture',
        price: 300,
        type: 'day',
      },
      {
        name: 'Open Desk',
        description: 'Choose and work at any desk within the community area',
        price: 4500,
        type: 'month',
      },
      {
        name: 'Dedicated Desk',
        description: 'A fixed desk in a shared coworking space',
        price: 5500,
        type: 'month',
      },
      {
        name: 'Private Cabin',
        description: 'Private office space dedicated to you and your team',
        price: 30000,
        type: 'month',
      },
      {
        name: 'Virtual office',
        description: 'Office space for larger teams with their own reception',
        price: 2000,
        type: 'month',
      },
      {
        name: 'Meeting Rooms',
        description: 'Office space for larger teams with their own reception',
        price: 400,
        type: 'hr',
      },
    ];
  }

  closeEnquireModel() {
    this.isEnquireModal = false;
  }

  openEnquireModal() {
    this.isEnquireModal = true;
  }

  @HostListener('document:scroll', ['$event'])
  onWindowScroll(event): void {
    if (isPlatformBrowser(this.platformId) && !this.helperService.getIsMobileMode()) {
      const windowOffsetTop =
        window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
      if (windowOffsetTop >= 750) {
        this.isSticky = true;
      } else {
        this.isSticky = false;
      }
    }
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.seoService.removeNoFollowTag();
  }

  scrollEnq() {
    document.getElementById('enqBtn').scrollIntoView();
  }
}
