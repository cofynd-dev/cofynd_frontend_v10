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
      icon: 'amenities/parking-icon.svg',
    },
  ];

  coworkingPlan = [
    {
      icon: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/9e7314cec45e4d42fd21a06f7b2d9bbaac8f6723.png',
      title: 'Dedicated Desk',
      description: 'A fixed desk in a shared coworking space.',
      price: '₹5,999/-',
    },
    {
      icon: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/49320cf2159712b18c1a11e03dad22cba5f9eeb2.png',
      title: 'Private Cabin',
      description: 'Private office space dedicated to you and your team.',
      price: '₹30,000/-',
    },
    {
      icon: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/f662ce1dc8eb619a12b3ccadff954a0a69c74c59.png',
      title: 'Virtual Office',
      description: 'Build your company presence with virtual office',
      price: '₹16,000/-',
    },
  ];

  coworkingPartners = [
    {
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/93f7fa099b87eccf93812fbff5d13f83a2cc487a.png',
      title: 'WeWork',
    },
    {
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/24d34a77dafecc24635767dee0ae7fd250cb3649.jpg',
      title: 'Awfis',
    },
    {
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/9c0c2a58819ef996fd210b7cad122dd15d761ed0.png',
      title: 'Innov8',
    },
    {
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/17870b28354c41ede388e5c30c67d196cfb05f08.png',
      title: 'Insta Office',
    },
    {
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/eacb58c29322fa81ce2b6cae4fe680c257bce084.png',
      title: 'AltF',
    },
    {
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/9d0d32fd1a689722ed5f719d9eab7dbbceeff9f5.png',
      title: '91 Springboard',
    },
    {
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/757d099b5bf39eeab60401f5a76f8d3c34f875aa.jpg',
      title: 'Bhive',
    },
    {
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/31965e7c65101640fa945260d7fc2d2430a5b5fd.jpg',
      title: 'Indiqube',
    },
  ];

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
