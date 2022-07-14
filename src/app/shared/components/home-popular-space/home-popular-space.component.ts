import { Input } from '@angular/core';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { WorkSpaceService } from '@app/core/services/workspace.service';
import { NguCarousel, NguCarouselConfig, NguCarouselStore } from '@ngu/carousel';

interface PopularSpace {
  name: string;
  address: string;
  image: string;
  id: string;
  slug?: string;
}

@Component({
  selector: 'app-home-popular-space',
  templateUrl: './home-popular-space.component.html',
  styleUrls: ['./home-popular-space.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePopularSpaceComponent implements OnInit, AfterViewInit {
  @Input() pageTitle: string = 'Top Coworking in India';
  @Input() layout: 'white';
  popularCoWorkingSpaces: PopularSpace[] = [];
  @Input() popularCoLivingSpaces: PopularSpace[] = [];
  popularOtherSpaces: PopularSpace[] = [];
  @Input() shouldCoWorkingVisible: boolean = true;
  @Input() shouldCoLivingVisible: boolean;
  @Input() shouldOtherBrandVisible: boolean;
  @Input() shouldOfficeVisible: boolean;
  @Input() popularOfficeSpaces: PopularSpace[] = [];
  @Input() officeSlug: boolean = true;
  @Input() isCountryLandingPage: boolean;




  @ViewChild('popularSpaceCarousel', { static: false })
  popularSpaceCarousel: NguCarousel<PopularSpace>;
  active = 0;

  carouselConfig: NguCarouselConfig = {
    grid: { xs: 1.4, sm: 1.4, md: 3, lg: 4, all: 0 },
    slide: 10,
    speed: 1000,
    point: {
      visible: true,
    },
    interval: { timing: 4000, initialDelay: 1000 },
    load: 4,
    velocity: 0,
    touch: true,
    easing: 'cubic-bezier(0, 0, 0.2, 1)',
  };
  constructor(private cdr: ChangeDetectorRef, private workSpaceService: WorkSpaceService, private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    if (this.isCountryLandingPage == false) {
      this.pageTitle = `Top Coworking in India`;
      this.workSpaceService.popularWorkSpacesCountryWise({ countryId: '6231ae062a52af3ddaa73a39' }).subscribe(spaces => {
        this.popularCoWorkingSpaces = spaces;
        this.cdr.detectChanges();
      });
    }
    if (this.isCountryLandingPage == true) {
      this.pageTitle = `Top Coworking in ${localStorage.getItem('country_name')}`;
      this.getPopularWorSpacesAsCountry();
    }
  }

  ngOnChanges(): void {
    if (this.shouldCoLivingVisible && !this.popularCoLivingSpaces.length) {
      this.popularCoLivingSpaces = [
        {
          address: 'Sector 69, Gurgaon',
          id: '5fa393a6c2502350f2500ff0',
          image:
            'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/e0801ecc67c7d1f30fde3a58ba65f2919236f28a.jpg',
          name: 'Housr Tulip Purple',
          slug: 'housr-tulip-purple-gurgaon',
        },
        {
          address: '2nd Main Rd, Arekere, Bengaluru',
          id: '5f9d37edc2502350f25002da',
          image:
            'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/fb5a8a75b2f5396fe9d1a919fdfd404d816e92b4.jpg',
          name: 'Covie Bannerghatta Road',
          slug: 'covie-bannerghatta-road',
        },
        {
          address: 'Safina plaza, Bengaluru',
          id: '5fbc9ffcc2502350f250363f',
          image:
            'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/f81fe9b1a46d8fd9658cd5b0dcb3bd0939a2d280.jpg',
          name: 'The hub Infantry Road',
          slug: 'the-hub-infantry-road',
        },
        {
          address: 'ACE Almighty, Wakad, Pune',
          id: '5f9270aac2502350f24ff70e',
          image:
            'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/42d8033d2b7d0b87b1d7bf69f0efd038ddfe4b92.jpg',
          name: 'Tribe Student Housing Wakad',
          slug: 'tribe-stays-wakad',
        },
      ];
    }
  }

  onSliderMove(slideData: NguCarouselStore) {
    this.active = slideData.currentSlide;
  }

  goToPrev() {
    this.popularSpaceCarousel.moveTo(this.active - 5);
  }

  goToNext() {
    this.popularSpaceCarousel.moveTo(this.active + 1);
  }

  openWorkSpace(slug: string, city: string, countrydb_name: string, country_id: string) {
    localStorage.setItem('country_name', countrydb_name);
    localStorage.setItem('country_id', country_id);
    if (countrydb_name != 'india' && countrydb_name != 'India' && countrydb_name != 'INDIA') {
      this.router.navigate([`${countrydb_name.toLowerCase().trim()}/coworking/${city.toLowerCase().trim()}`]);
    } else {
      this.router.navigate([`/coworking/${city.toLowerCase().trim()}`]);
    }
  }
  removedash(name: string) {
    return name.replace(/-/, ' ')
  }

  openCoLivingSpace(slug: string) {
    this.router.navigate([`/co-living/${slug}`]);
  }

  openOfficeSpace(slug: string) {
    this.router.navigate([`/office-space/rent/${slug}`]);
  }
  openWithFreeSlug(slug: string) {
    this.router.navigate([`${slug}`]);
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  getPopularWorSpaces() {
    this.workSpaceService.getPopularWorSpaces().subscribe(spaces => {
      this.popularCoWorkingSpaces = spaces;
      this.cdr.detectChanges();
    });
  }

  getPopularWorSpacesAsCountry() {
    this.workSpaceService.popularWorkSpacesCountryWise({ countryId: localStorage.getItem('country_id') }).subscribe(spaces => {
      this.popularCoWorkingSpaces = spaces;
      this.cdr.detectChanges();
    });
  }

  transform(value: string): string {
    let first = value.substr(0, 1).toUpperCase();
    return first + value.substr(1);
  }
}
