import { Component, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.scss'],
})
export class ThankYouComponent implements OnDestroy {
  constructor(private _location: Location) {}
  backClicked() {
    this._location.back();
  }
  ngOnDestroy() {}
}
