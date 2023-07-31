import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private countryList$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(null); // BehaviorSubject to store the country list

  constructor(private http: HttpClient) {}

  fetchCountryList(data: any): Observable<any> {
    return this.http.post<any>(`/user/countryByDynamic`, data);
  }

  getCountryList(): Observable<any[]> {
    return this.countryList$.asObservable();
  }

  setCountryList(countryList: any[]): void {
    this.countryList$.next(countryList);
  }
}
