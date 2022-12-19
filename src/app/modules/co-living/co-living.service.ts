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
    return this.http.get<ApiResponse<CoLiving[]>>(`/user/popularCoLivingSpaces?${params}`).pipe(
      map(coLivings => {
        coLivings.data.map(coLiving => this.setStartingPrice(coLiving));
        return coLivings;
      }),
    );
  }
  getPriorityWorkSpaces(params): Observable<ObjectResponseModel<any>> {
    return this.http
      .get<ObjectResponseModel<CoLiving>>(`/user/coLivingSpaces/priority/type`, { params: params })
      .pipe(
        map((coLivings: any) => {
          coLivings.data.prioritySpaces.map(coLiving => this.setStartingPrice(coLiving));
          return coLivings;
        }),
      );
  }

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
    let miniPriceDuration = [];
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
    let miniPrice = Math.min(...prices.filter(Boolean));
    if (coLiving.coliving_plans) {
      let data = coLiving.coliving_plans;
      if (data.length > 0) {
        data.map(v => {
          if (v.price === miniPrice) {
            miniPriceDuration.push(v);
          }
        });
      }
    }
    coLiving.price_type = 'bed';
    coLiving.duration = 'month';
    if (miniPriceDuration.length) {
      coLiving.duration = miniPriceDuration[0]['duration'];
    }
    return updatedWorkspace;
  }

  getAverageRating(spaceId): Observable<{ average: number }> {
    return this.http
      .get<{ data: { average: number } }>(`/user/ColivingspaceAverageReview/${spaceId}`)
      .pipe(map(searchResult => searchResult.data));
  }

  microLocationByCityAndSpaceType(cityId: any) {
    return this.http.get<ApiResponse<any[]>>(`/user/microLocationByCitySpaceType?cityId=${cityId}&for_coLiving=${true}`).pipe(
      map(microlocations => {
        return microlocations;
      }),
    );
  }
}
