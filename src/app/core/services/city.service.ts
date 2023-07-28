// shared/city.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CityService {
  private cityList: any[]; // Modify the type according to your API response

  constructor(private http: HttpClient) {}

  // Fetch the city list API data and store it in the service
  fetchCityList(): Observable<any> {
    return this.http.get<any>('/user/getActiveCityForAllSpaceTypes');
  }

  // Get the stored city list
  getCityList(): any[] {
    return this.cityList;
  }

  // Set the city list data in the service
  setCityList(cityList: any[]): void {
    this.cityList = cityList;
  }
}
