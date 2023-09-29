import { Component, Inject, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { DOCUMENT } from '@angular/common';
declare let gtag: Function;
@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.scss'],
})
export class ThankYouComponent implements OnDestroy {
  constructor(private location: Location, @Inject(DOCUMENT) private document: Document) {}
  backClicked() {
    this.location.back();
  }
  handleRouteEvents() {
    gtag('event', 'conversion', {
      send_to: 'AW-671913436/vMToCKzatd8YENyrssAC',
    });
  }
  ngOnDestroy() {}
}
