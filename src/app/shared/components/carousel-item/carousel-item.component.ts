import { Input } from '@angular/core';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { WorkSpaceService } from '@app/core/services/workspace.service';
import { NguCarousel, NguCarouselConfig, NguCarouselStore } from '@ngu/carousel';

interface PopularSpace {
  name: string;
  address: string;
  image: string;
  slug: string;
  starting?: string;
  country: string;
}

@Component({
  selector: 'app-carousel-item',
  templateUrl: './carousel-item.component.html',
  styleUrls: ['./carousel-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselItemComponent implements OnInit, AfterViewInit {
  @Input() pageTitle: string;
  @Input() layout: 'white';
  @Input() coWorkingSpaces: PopularSpace[] = [];
  @Input() coLivingSpaces: PopularSpace[] = [];
  @Input() shouldCoWorkingVisible: boolean = true;
  @Input() shouldCoLivingVisible: boolean;

  @ViewChild('popularSpaceCarousel', { static: false })
  popularSpaceCarousel: NguCarousel<PopularSpace>;
  active = 0;

  carouselConfig: NguCarouselConfig = {
    grid: { xs: 1.4, sm: 1.4, md: 3.4, lg: 4, all: 0 },
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
  constructor(private cdr: ChangeDetectorRef, private workSpaceService: WorkSpaceService, private router: Router) { }

  ngOnInit(): void {
    // this.getPopularWorSpaces()
  }

  ngOnChanges(): void { }

  onSliderMove(slideData: NguCarouselStore) {
    this.active = slideData.currentSlide;
  }

  goToPrev() {
    this.popularSpaceCarousel.moveTo(this.active - 1);
  }

  goToNext() {
    this.popularSpaceCarousel.moveTo(this.active + 1);
  }

  openWorkSpace(slug: string, country: string) {
    localStorage.setItem('city_name', 'coworking');
    if (country) {
      if (country !== 'india') {
        this.router.navigate([`${country.toLocaleLowerCase()}/coworking-details/${slug.toLowerCase().trim()}`]);
      } else {
        this.router.navigate([`/coworking/${slug.toLowerCase().trim()}`]);
      }
    } else {
      this.router.navigate([`/coworking/${slug.toLowerCase().trim()}`]);
    }
  }

  openCoLivingSpace(slug: string, country: string) {
    localStorage.setItem('city_name', 'co-living');
    if (!country) {
      this.router.navigate([`co-living/${slug.toLowerCase().trim()}`]);
    }
    if (country) {
      this.router.navigate([`${country.toLocaleLowerCase()}/co-living-details/${slug.toLowerCase().trim()}`]);
    }
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

  // getPopularWorSpaces() {
  //   this.workSpaceService.getPopularWorSpaces().subscribe(spaces => {
  //     this.coWorkingSpaces = spaces;
  //     this.cdr.detectChanges();
  //   });
  // }
}
