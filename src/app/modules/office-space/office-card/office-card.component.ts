import { AfterViewInit, ChangeDetectorRef, Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OfficeSpace } from '@core/models/office-space.model';
import { NguCarousel, NguCarouselConfig, NguCarouselStore } from '@ngu/carousel';
import { intToOrdinalNumberString } from '@app/shared/utils';

interface ImageGallery {
  id: number;
  name?: string;
  extension?: string;
  label?: string;
  category?: string;
  title?: string;
}

@Component({
  selector: 'app-office-card',
  templateUrl: './office-card.component.html',
  styleUrls: ['./office-card.component.scss'],
})
export class OfficeCardComponent implements OnInit, AfterViewInit {
  @Input() office: OfficeSpace;
  @Input() loading: boolean;
  isMobileResolution: boolean;
  activeSliderItem: number;

  @ViewChild('imageGalleryCarousel', { static: true })
  imageGalleryCarousel: NguCarousel<ImageGallery>;
  carouselTile: NguCarouselConfig = {
    grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
    slide: 1,
    speed: 600,
    point: {
      visible: true,
    },
    load: 5,
    velocity: 0,
    touch: true,
    loop: true,
    easing: 'cubic-bezier(0, 0, 0.2, 1)',
  };

  constructor(private router: Router, private cdr: ChangeDetectorRef) {
    // initial set activeSliderItem to 0 otherwise not work because of undefined value
    this.activeSliderItem = 0;
  }

  ngOnInit() {
    if (window.innerWidth < 768) {
      this.isMobileResolution = true;
    } else {
      this.isMobileResolution = false;
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize($event: Event): void {
    this.ngOnInit();
    // this.getScreenWidth = window.innerWidth;
    // this.getScreenHeight = window.innerHeight;
  }

  openWorkSpace(slug: string) {
    const url = this.router.serializeUrl(this.router.createUrlTree([`/office-space/rent/${slug}`]));
    // window.open(url, '_blank');
    if (this.isMobileResolution) {
      this.router.navigate([url]);
    } else {
      window.open(url, '_blank');
    }
  }

  getFloorSuffix(floor: number) {
    return !isNaN(floor) ? intToOrdinalNumberString(floor) : floor;
  }
  getoffceType(type: string) {
    let stringToReplace = type;
    var desired = stringToReplace.replace(/[^\w\s]/gi, ' ');
    return desired;
  }

  onSliderMove(slideData: NguCarouselStore) {
    this.activeSliderItem = slideData.currentSlide;
  }

  goToPrev() {
    this.imageGalleryCarousel.moveTo(this.activeSliderItem - 1);
  }

  goToNext() {
    this.imageGalleryCarousel.moveTo(this.activeSliderItem + 1);
  }

  onChangeSliderCategory(id: number) {
    this.imageGalleryCarousel.moveTo(id);
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }
}
