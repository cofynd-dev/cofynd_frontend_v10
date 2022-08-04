import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@core/models/api-response.model';
import { Brand } from '@core/models/brand.model';
import { City } from '@core/models/city.model';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  // For Search Place
  private availableCities: Subject<City[]> = new Subject<City[]>();
  readonly availableCities$: Observable<City[]>;

  constructor(private http: HttpClient) {
    this.availableCities$ = this.availableCities.asObservable();
  }

  getBrands(params?) {
    let url = `/user/brands?${params}`;
    if (!params) {
      url = `/user/brands`;
    }
    return this.http.get<ApiResponse<Brand[]>>(url).pipe(
      map(brandsList => {
        if (params.indexOf('dropdown') > -1) {
          return brandsList.data;
        }
        return brandsList.data.filter(brand => brand.should_show_on_home && brand.image !== null);
      }),
    );
  }

  getBrandByName(brandName) {
    return this.http.get<ApiResponse<Brand>>(`/user/workSpacesByBrandName/${brandName}`).pipe(
      map(brand => {
        return brand;
      }),
    );
  }

  getCities() {
    return this.http.get<ApiResponse<City[]>>(`/user/cities`).pipe(map(response => response.data));
  }

  setAvailableCites(cities: City[]) {
    this.availableCities.next(cities);
  }

  getFeaturedImages() {
    return this.http.get<ApiResponse<City[]>>(`/user/getfeaturedImages`).pipe(map(response => response.data));
  }
  getBrandAdsImages() {
    return this.http.get<ApiResponse<City[]>>(`/user/getbrandAdsImages`).pipe(map(response => response.data));
  }
}
