// shared/city.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private countryList: any[]; // Modify the type according to your API response

  constructor(private http: HttpClient) {}

  // Fetch the country list API data and store it in the service
  fetchCountryList(data: any): Observable<any> {
    return this.http.post<any>(`/user/countryByDynamic`, data);
  }

  // Get the stored country list
  getCountryList(): any[] {
    return this.countryList;
  }

  // Set the country list data in the service
  setCountryList(countryList: any[]): void {
    this.countryList = countryList;
  }
}
