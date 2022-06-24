import { Component, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { generateSlug } from '@app/shared/utils';
// import { MapsAPILoader } from '@core/map-api-loader/maps-api-loader';
import { ToastrService } from 'ngx-toastr';


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
    // private mapsAPILoader: MapsAPILoader,
    private toastrService: ToastrService,
  ) { }

  getSlug(location: string) {
    console.log(generateSlug(location));
    return generateSlug(location);
  }

  reRoute(location) {
    console.log(location);
    let country = localStorage.getItem('country_name') ? localStorage.getItem('country_name') : this.country_names;
    if (this.relativeUrl === 'co-living' && country != 'india' && country != 'India' && country != 'INDIA') {
      const url = `/${country}/co-living/${this.cityName.toLowerCase().trim()}/${generateSlug(
        location.toLowerCase().trim(),
      )}`;
      this.router.navigate([url]);
    }
    if (this.relativeUrl === 'co-living' && (country == 'india' || country == 'India' || country == 'INDIA')) {
      // if (location === 'Near Me') {
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
      // }
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
      this.router.navigate([url]);
    }

    if (this.relativeUrl === 'coworking' && (country == 'india' || country == 'India' || country == 'INDIA')) {
      if (location === 'Near Me') {
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
  ngOnChanges(): void {
    console.log(this.country_names);
  }
}
