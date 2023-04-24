import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@core/models/api-response.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Builder } from './builder.model';

@Injectable({
  providedIn: 'root',
})
export class BuilderService {
  constructor(private http: HttpClient) { }

  getBuilders(params: {}): Observable<ApiResponse<Builder[]>> {
    return this.http.get<ApiResponse<Builder[]>>(`/user/builders?${params}`).pipe(
      map(builders => {
        return builders;
      }),
    );
  }

  getBuilder(slug: string) {
    return this.http.get<{ data: Builder }>(`/user/builders/${slug}`).pipe(
      map(builder => {
        return builder;
      }),
    );
  }

  getBuilderByName(slug: string) {
    return this.http.get<{ data: Builder }>(`/user/builders/${slug}`).pipe(
      map(builder => {
        return builder;
      }),
    );
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
}