import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchResult } from '@app/core/models/search-result.model';
import { ApiResponse, ObjectResponseModel } from '@core/models/api-response.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CoLiving } from './co-living.model';

@Injectable({
  providedIn: 'root',
})
export class CoLivingService {
  constructor(private http: HttpClient) { }

  getCoLivings(params: {}): Observable<ApiResponse<CoLiving[]>> {
    return this.http.get<ApiResponse<CoLiving[]>>(`/user/coLivingSpaces?${params}`).pipe(
      map(coLivings => {
        // we modify the response to display starting price & price type
        coLivings.data.map(coLiving => this.setStartingPrice(coLiving));
        return coLivings;
      }),
    );
  }

  getCoLiving(slug: string) {
    return this.http.get<{ data: CoLiving }>(`/user/coLivingSpaces/${slug}`).pipe(
      map(office => {
        return this.setStartingPrice(office.data);
      }),
    );
  }

  getPopularCoLivings(params: {}): Observable<ApiResponse<CoLiving[]>> {
    console.log("params", params);
    return this.http.get<ApiResponse<CoLiving[]>>(`/user/popularCoLivingSpaces?${params}`).pipe(
      map(coLivings => {
        console.log("**", coLivings);
        coLivings.data.map(coLiving => this.setStartingPrice(coLiving));
        return coLivings;
      }),
    );
  }
  getPriorityWorkSpaces(params): Observable<ObjectResponseModel<any>> {
    console.log("params", params);
    return this.http.get<ObjectResponseModel<CoLiving>>(`/user/coLivingSpaces/priority/type`, { params: params }).pipe(
      map((coLivings: any) => {
        console.log("**", coLivings);
        coLivings.data.prioritySpaces.map(coLiving => this.setStartingPrice(coLiving));
        return coLivings;
      }),
    );
  }
  // getPriorityWorkSpaces1(params): Observable<ObjectResponseModel<any>> {
  //   console.log("TTTT",params);
  //   return this.http.get<ObjectResponseModel<CoLiving>>(
  //     `${environment.baseUrl}admin/coLivingSpaces/priority/type`,
  //     { params: params }
  //   );
  // }
  getColivingByBrand(slug: string, params: {}): Observable<ApiResponse<CoLiving[]>> {
    return this.http.get<ApiResponse<CoLiving[]>>(`/user/colivingByBrand/${slug}?${params}`).pipe(
      map(coLivings => {
        coLivings.data.map(coLiving => this.setStartingPrice(coLiving));
        return coLivings;
      }),
    );
  }

  searchColiving(keyword: string): Observable<SearchResult> {
    return this.http.get<SearchResult>(`/user/coLivingSpaces?name=${keyword}`).pipe(map(searchResult => searchResult));
  }

  setStartingPrice(coLiving) {
    let prices = [];
    const updatedWorkspace = coLiving;
    if (coLiving.coliving_plans) {
      let data = coLiving.coliving_plans;
      if (data.length > 0) {
        data.map(v => {
          prices.push(v.price);
        });
      } else {
        prices = Object.values(coLiving.price);
      }
    } else {
      prices = Object.values(coLiving.price);
    }

    coLiving.starting_price = Math.min(...prices.filter(Boolean));
    coLiving.price_type = 'bed';
    return updatedWorkspace;
  }
}
