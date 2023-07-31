import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnChanges, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { generateSlug } from '@app/shared/utils';
import { Observable, Subscriber } from 'rxjs';
import { script } from '../../../core/config/script';

@Component({
  selector: 'app-search-similar-location',
  templateUrl: './search-similar-location.component.html',
  styleUrls: ['./search-similar-location.component.scss'],
})
export class SearchSimilarLocationComponent implements OnChanges {
  @Input() country_names: string;
  @Input() cityName: string;
  @Input() popularLocationList = [];
  @Input() relativeUrl: string;
  @Input() isPageScrolled: boolean;
  country: any;
  cityResponse: any;

  constructor(private router: Router, @Inject(DOCUMENT) private _document: Document, private _renderer2: Renderer2) {}

  ngOnInit() {}

  private getCurrentPosition(): any {
    return new Observable((observer: Subscriber<any>) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position: any) => {
          observer.next({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          observer.complete();
        });
      } else {
        observer.error();
      }
    });
  }

  reRoute(location) {
    this.removeLocalStorage();
    this.country = localStorage.getItem('country_name') ? localStorage.getItem('country_name') : this.country_names;
    if (
      this.relativeUrl === 'co-living' &&
      this.country != 'india' &&
      this.country != 'India' &&
      this.country != 'INDIA'
    ) {
      const url = `/${this.country}/co-living/${this.cityName.toLowerCase().trim()}/${generateSlug(
        location.toLowerCase().trim(),
      )}`;
      this.router.navigate([url]);
    }
    if (
      this.relativeUrl === 'co-living' &&
      (this.country == 'india' || this.country == 'India' || this.country == 'INDIA')
    ) {
      if (location === 'Near Me') {
        this.getCurrentPosition().subscribe((position: any) => {
          this.router.navigateByUrl(`/search?coliving-latitude=${position.latitude}&longitude=${position.longitude}`);
        });
      } else {
        const url =
          '/' +
          this.relativeUrl +
          '/' +
          this.cityName.toLowerCase().trim() +
          '/' +
          generateSlug(location.toLowerCase().trim());
        this.router.navigate([url]);
      }
    }
    if (this.relativeUrl === 'office-space/rent') {
      const url =
        '/' +
        this.relativeUrl +
        '/' +
        this.cityName.toLowerCase().trim() +
        '/' +
        generateSlug(location.toLowerCase().trim());
      if (location && script.officespace.microLocation[generateSlug(location.toLowerCase().trim())] != undefined) {
        for (let scrt of script.officespace.microLocation[generateSlug(location.toLowerCase().trim())]) {
          this.setHeaderScript(scrt);
        }
      }
      this.router.navigate([url]);
    }
    if (
      this.relativeUrl === 'coworking' &&
      (this.country == 'india' || this.country == 'India' || this.country == 'INDIA')
    ) {
      if (location === 'Near Me') {
        this.getCurrentPosition().subscribe((position: any) => {
          this.router.navigateByUrl(`/search?coworking-latitude=${position.latitude}&longitude=${position.longitude}`);
        });
      } else {
        const url =
          '/' +
          this.relativeUrl +
          '/' +
          this.cityName.toLowerCase().trim() +
          '/' +
          generateSlug(location.toLowerCase().trim());
        this.router.navigate([url]);
      }
    }
    if (
      this.relativeUrl === 'coworking' &&
      this.country != 'india' &&
      this.country != 'India' &&
      this.country != 'INDIA'
    ) {
      const url = `/${this.country}/coworking/${this.cityName.toLowerCase().trim()}/${generateSlug(
        location.toLowerCase().trim(),
      )}`;
      this.router.navigate([url]);
    }
  }

  setHeaderScript(cityScript) {
    let script = this._renderer2.createElement('script');
    script.type = `application/ld+json`;
    script.text = `${cityScript} `;
    this._renderer2.appendChild(this._document.head, script);
  }

  removeLocalStorage() {
    localStorage.removeItem('minPrice');
    localStorage.removeItem('maxPrice');
    localStorage.removeItem('featuredColiving');
    localStorage.removeItem('officeType');
  }

  ngOnChanges(): void {}
}
