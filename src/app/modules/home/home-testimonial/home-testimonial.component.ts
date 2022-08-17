import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { NguCarousel, NguCarouselConfig, NguCarouselStore } from '@ngu/carousel';
import { USER_REVIEWS } from '@core/config/reviews';

interface Review {
  name: string;
  review: string;
  image?: string;
}
@Component({
  selector: 'app-home-testimonial',
  templateUrl: './home-testimonial.component.html',
  styleUrls: ['./home-testimonial.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeTestimonialComponent implements AfterViewInit {
  reviews: Review[] = USER_REVIEWS;
  active = 0;

  @ViewChild('reviewsCarousel', { static: true })
  reviewsCarousel: NguCarousel<Review>;

  carouselConfig: NguCarouselConfig;
  constructor(private cdr: ChangeDetectorRef) {
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
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  onSliderMove(slideData: NguCarouselStore) {
    this.active = slideData.currentSlide;
  }

  goToPrev() {
    this.reviewsCarousel.moveTo(this.active - 1);
  }

  goToNext() {
    this.reviewsCarousel.moveTo(this.active + 1);
  }
}
