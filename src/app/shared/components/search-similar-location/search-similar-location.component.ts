import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnChanges, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { generateSlug } from '@app/shared/utils';
// import { MapsAPILoader } from '@core/map-api-loader/maps-api-loader';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscriber } from 'rxjs';
import { script } from '../../../core/config/script';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { WorkSpaceService } from '@app/core/services/workspace.service';


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

  constructor(
    private router: Router,
    @Inject(DOCUMENT) private _document: Document,
    private _renderer2: Renderer2,
    // private mapsAPILoader: MapsAPILoader,
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute,
    private workSpaceService: WorkSpaceService,
  ) { }

  ngOnInit() {
    combineLatest(this.activatedRoute.url, this.activatedRoute.queryParams)
      .pipe(map(results => ({ routeParams: results[0], queryParams: results[1] })))
      .subscribe(results => {
        let cityName = results.routeParams[0].path;
        this.workSpaceService.getByCityName1(cityName.toLowerCase()).subscribe((res: any) => {
          this.cityResponse = res.data;
          localStorage.setItem('country_name', this.cityResponse.country.name.toLowerCase())
          localStorage.setItem('country_id', this.cityResponse.country.id)
          localStorage.setItem('city_name', this.cityResponse.name.toLowerCase())
        })
      });
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
    this.removeLocalStorage();
    this.country = localStorage.getItem('country_name') ? localStorage.getItem('country_name') : this.country_names;
    if (this.relativeUrl === 'co-living' && this.country != 'india' && this.country != 'India' && this.country != 'INDIA') {
      const url = `/${this.country}/co-living/${this.cityName.toLowerCase().trim()}/${generateSlug(
        location.toLowerCase().trim(),
      )}`;
      this.router.navigate([url]);
    }
    if (this.relativeUrl === 'co-living' && (this.country == 'india' || this.country == 'India' || this.country == 'INDIA')) {
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
    if (this.relativeUrl === 'coworking' && (this.country == 'india' || this.country == 'India' || this.country == 'INDIA')) {
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
    if (this.relativeUrl === 'coworking' && this.country != 'india' && this.country != 'India' && this.country != 'INDIA') {
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

  ngOnChanges(): void { }

}
