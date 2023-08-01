import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private countryList$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(null); // BehaviorSubject to store the country list

  constructor(private http: HttpClient) {}

  fetchCountryList(data: any): Observable<any> {
    // If countryList is not cached, fetch from API, cache it, and return
    return this.http.post<any>(`/user/countryByDynamic`, data).pipe(
      tap(countryList => {
        this.countryList$.next(countryList); // Cache the countryList
      }),
    );
  }

  getCountryList(): Observable<any[]> {
    return this.countryList$.asObservable();
  }

  setCountryList(countryList: any[]): void {
    this.countryList$.next(countryList);
  }
}
