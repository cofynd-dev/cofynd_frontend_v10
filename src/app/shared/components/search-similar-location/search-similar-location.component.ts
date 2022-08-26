import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnChanges, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { generateSlug } from '@app/shared/utils';
// import { MapsAPILoader } from '@core/map-api-loader/maps-api-loader';
import { ToastrService } from 'ngx-toastr';
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

  constructor(private router: Router,
    @Inject(DOCUMENT) private _document: Document,
    private _renderer2: Renderer2,
    // private mapsAPILoader: MapsAPILoader,
    private toastrService: ToastrService,
  ) {

  }

  getSlug(location: string) {
    return generateSlug(location);
  }
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
    // debugger
    let country = localStorage.getItem('country_name') ? localStorage.getItem('country_name') : this.country_names;
    if (this.relativeUrl === 'co-living' && country != 'india' && country != 'India' && country != 'INDIA') {
      const url = `/${country}/co-living/${this.cityName.toLowerCase().trim()}/${generateSlug(
        location.toLowerCase().trim(),
      )}`;

      this.router.navigate([url]);
    }
    if (this.relativeUrl === 'co-living' && (country == 'india' || country == 'India' || country == 'INDIA')) {
      if (location === 'Near Me') {
        this.getCurrentPosition()
          .subscribe((position: any) => {
            this.router.navigateByUrl(`/search?coliving-latitude=${position.latitude}&longitude=${position.longitude}`);
          })
        //   this.mapsAPILoader
        //     .load()
        //     .then(() => {
        //       if (navigator.geolocation) {
        //         navigator.geolocation.getCurrentPosition(position => {
        //           const pos = {
        //             lat: position.coords.latitude,
        //             lng: position.coords.longitude,
        //           };
        //           this.router.navigateByUrl(`/search?coliving-latitude=${pos.lat}&longitude=${pos.lng}`);
        //         });
        //       } else {
        //         this.toastrService.error('Your browser does not support this feature');
        //       }
        //     })
        //     .catch(error => console.log(error));
      }
      const url =
        '/' +
        this.relativeUrl +
        '/' +
        this.cityName.toLowerCase().trim() +
        '/' +
        generateSlug(location.toLowerCase().trim());


      this.router.navigate([url]);
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

    if (this.relativeUrl === 'coworking' && (country == 'india' || country == 'India' || country == 'INDIA')) {
      if (location === 'Near Me') {
        this.getCurrentPosition()
          .subscribe((position: any) => {
            this.router.navigateByUrl(`/search?coworking-latitude=${position.latitude}&longitude=${position.longitude}`);
          })
        // this.mapsAPILoader
        //   .load()
        //   .then(() => {
        //     if (navigator.geolocation) {
        //       navigator.geolocation.getCurrentPosition(position => {
        //         const pos = {
        //           lat: position.coords.latitude,
        //           lng: position.coords.longitude,
        //         };
        //         this.router.navigateByUrl(`/search?coworking-latitude=${pos.lat}&longitude=${pos.lng}`);
        //       });
        //     } else {
        //       this.toastrService.error('Your browser does not support this feature');
        //     }
        //   })
        //   .catch(error => console.log(error));
      }
      const url =
        '/' +
        this.relativeUrl +
        '/' +
        this.cityName.toLowerCase().trim() +
        '/' +
        generateSlug(location.toLowerCase().trim());
      this.router.navigate([url]);
    }
    if (this.relativeUrl === 'coworking' && country != 'india' && country != 'India' && country != 'INDIA') {
      const url = `/${country}/coworking/${this.cityName.toLowerCase().trim()}/${generateSlug(
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
  ngOnChanges(): void {
  }
}
