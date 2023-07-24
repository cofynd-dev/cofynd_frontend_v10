import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  private animateEnquiryForm: Subject<boolean> = new Subject<boolean>();
  animateEnquiryForm$: Observable<boolean>;

  constructor(@Inject(PLATFORM_ID) private platformId: any, @Inject(DOCUMENT) private document: Document) {
    this.animateEnquiryForm$ = this.animateEnquiryForm.asObservable();
  }

  /**
   * Get Screen Width
   *
   */
  getScreenWidth() {
    if (isPlatformBrowser(this.platformId)) {
      return window.innerWidth;
    }
  }

  /**
   * Get Mobile Viewport
   *
   */
  getIsMobileMode() {
    if (isPlatformBrowser(this.platformId)) {
      console.log('mobile mode', window.innerWidth < 767);

      return window.innerWidth < 767;
    }
  }

  /**
   * Scroll To an element of document
   *
   */
  scrollToId(scrollElement: string) {
    if (isPlatformBrowser(this.platformId)) {
      const element = this.document.getElementById(scrollElement);
      if (element) {
        const headerOffset = 80;
        const bodyRect = this.document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const scrollPosition = elementPosition - headerOffset;
        window.scrollTo({
          top: scrollPosition,
          behavior: 'smooth',
        });
      }
    }
  }

  /**
   * Add class to html tag
   */
  addClassToDocument(className: string) {
    this.document.documentElement.classList.add(className);
  }

  /**
   * Remove class from html tag
   */
  removeClassFromDocument(className: string) {
    this.document.documentElement.classList.remove(className);
  }

  // Notify Enquiry box to animate
  notifyEnquiryFormToAnimate() {
    if (this.getScreenWidth() > 991) {
      this.animateEnquiryForm.next(true);
    }
  }

  // Get Its SSR
  isPlatformBrowser() {
    return isPlatformBrowser(this.platformId);
  }
}
