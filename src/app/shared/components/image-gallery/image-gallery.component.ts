import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { NguCarousel, NguCarouselConfig, NguCarouselStore } from '@ngu/carousel';
import { Image } from '@core/models/workspace.model';
export enum KEY_CODE {
  RIGHT_ARROW = 'ArrowRight',
  LEFT_ARROW = 'ArrowLeft',
}
interface ImageGallery {
  id: number;
  name?: string;
  extension?: string;
  label?: string;
  category?: string;
  title?: string;
}

interface ImageGalleryCategory {
  name: string;
  slides: Array<number>;
}

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.scss'],
})
export class ImageGalleryComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() images: Image[];
  @Input() title: string;
  @Input() isMobileMode: boolean;
  @Output() closeImageGallery: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() isSliderMode: boolean;

  sliderItems: ImageGallery[];
  filteredSliderCategories: ImageGalleryCategory[];
  activeSliderItem: number;

  @ViewChild('imageGalleryCarousel', { static: true })
  imageGalleryCarousel: NguCarousel<ImageGallery>;

  carouselConfig: NguCarouselConfig = {
    grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
    slide: 1,
    speed: 350,
    point: {
      visible: true,
    },
    loop: true,
    animation: 'lazy',
    load: 2,
    velocity: 0,
    touch: true,
    interval: { timing: 4000, initialDelay: 1000 },

    easing: 'ease'
  };

  constructor(
    private cdr: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
  ) {
    // initial set activeSliderItem to 0 otherwise not work because of undefined value
    this.activeSliderItem = 0;
  }

  ngOnInit() {
    if (this.isSliderMode) {
      this.renderer.setStyle(this.document.body, 'overflow', 'hidden');
    }
    this.buildImageGallery();
  }

  /**
   * @description
   * we need an id for every image to match with carousel index
   * here we creating a new Slider Object with 0 index
   *
   */
  buildImageGallery() {
    if (this.images) {
      this.sliderItems = this.images.map((sliderImage, index) => {
        return {
          id: index,
          img: sliderImage.image.s3_link ? sliderImage.image.s3_link : '',
          title: sliderImage.image.title ? sliderImage.image.title : '',
        };
      });
    }
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
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

  /**
   * @description Notify to close the image gallery
   * @param  {boolean}
   */
  onCloseImageGallery() {
    this.closeImageGallery.emit(true);
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    console.log(event);

    if (event.key === KEY_CODE.RIGHT_ARROW) {
      this.goToNext();
    }

    if (event.key === KEY_CODE.LEFT_ARROW) {
      this.goToPrev();
    }
  }

  ngOnDestroy(): void {
    this.renderer.removeStyle(this.document.body, 'overflow');
  }
}
