import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CityService {
  private cityList$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(null); // BehaviorSubject to store the city list

  constructor(private http: HttpClient) {}

  fetchCityList(): Observable<any> {
    return this.http.get<any>('/user/getActiveCityForAllSpaceTypes').pipe(
      tap(cityList => {
        this.cityList$.next(cityList); // Cache the cityList
      }),
    );
  }

  getCityList(): Observable<any[]> {
    return this.cityList$.asObservable();
  }

  setCityList(cityList: any[]): void {
    this.cityList$.next(cityList);
  }
}
