import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { generateSlug } from '@app/shared/utils';

@Component({
  selector: 'app-search-similar-location',
  templateUrl: './search-similar-location.component.html',
  styleUrls: ['./search-similar-location.component.scss'],
})
export class SearchSimilarLocationComponent {
  @Input() cityName: string;
  @Input() popularLocationList = [];
  @Input() relativeUrl: string;
  @Input() isPageScrolled: boolean;

  constructor(private router: Router) { }

  getSlug(location: string) {
    console.log(generateSlug(location));
    return generateSlug(location);
  }

  reRoute(location) {
    let country = localStorage.getItem('country_name');
    if (this.relativeUrl === 'co-living' && country != 'india' && country != 'India' && country != 'INDIA') {
      const url = `/${country}/co-living/${this.cityName.toLowerCase().trim()}/${generateSlug(location.toLowerCase().trim())}`
      this.router.navigate([url]);
    }
    if (this.relativeUrl === 'co-living' && (country == 'india' || country == 'India' || country == 'INDIA')) {
      const url = '/' + this.relativeUrl + '/' + this.cityName.toLowerCase().trim() + '/' + generateSlug(location.toLowerCase().trim());
      this.router.navigate([url]);
    }
    if (this.relativeUrl === 'office-space/rent') {
      const url = '/' + this.relativeUrl + '/' + this.cityName.toLowerCase().trim() + '/' + generateSlug(location.toLowerCase().trim());
      this.router.navigate([url]);
    }

    if (this.relativeUrl === 'coworking' && (country == 'india' || country == 'India' || country == 'INDIA')) {
      const url = '/' + this.relativeUrl + '/' + this.cityName.toLowerCase().trim() + '/' + generateSlug(location.toLowerCase().trim());
      this.router.navigate([url]);
    }
    if (this.relativeUrl === 'coworking' && country != 'india' && country != 'India' && country != 'INDIA') {
      const url = `/${country}/coworking/${this.cityName.toLowerCase().trim()}/${generateSlug(location.toLowerCase().trim())}`
      this.router.navigate([url]);
    }
  }
}
