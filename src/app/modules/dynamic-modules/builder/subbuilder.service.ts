import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@core/models/api-response.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SubBuilder } from './subbuilder.model'

@Injectable({
  providedIn: 'root',
})
export class SubBuilderService {
  constructor(private http: HttpClient) { }

  getSubBuilders(params: {}): Observable<ApiResponse<SubBuilder[]>> {
    return this.http.get<ApiResponse<SubBuilder[]>>(`/user/SubBuilders?${params}`).pipe(
      map(SubBuilders => {
        return SubBuilders;
      }),
    );
  }

  getSubBuilder(slug: string) {
    return this.http.get<{ data: SubBuilder }>(`/user/subbuilders/${slug}`).pipe(
      map(SubBuilder => {
        return SubBuilder;
      }),
    );
  }

  getSubBuilderByName(slug: string) {
    return this.http.get<{ data: SubBuilder }>(`/user/subbuilders/${slug}`).pipe(
      map(SubBuilder => {
        return SubBuilder;
      }),
    );
  }

  setStartingPrice(coLiving) {
    let prices: any = [];
    const updatedWorkspace = coLiving;
    if (coLiving.plans) {
      let data = coLiving.plans;
      if (data.length > 0) {
        for (let index = 0; index < data.length; index++) {
          const lowestPriceItem = data[index].floor_plans.reduce((lowest, item) => {
            if (item.rent_price < lowest.rent_price) {
              return item;
            } else {
              return lowest;
            }
          });
          lowestPriceItem['plan'] = data[index]['planId']['name'];
          prices.push(lowestPriceItem);
        }
        prices = prices.reduce((lowest, item) => {
          if (item.rent_price < lowest.rent_price) {
            return item;
          } else {
            return lowest;
          }
        });
        coLiving.starting_name = prices.name
        coLiving.starting_plan = prices.plan;
        coLiving.starting_price = prices.rent_price;
        coLiving.starting_sale_price = prices.sale_price;
        coLiving.starting_duration = 'month';
      }
    }
    return updatedWorkspace;
  }
}