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
  constructor(private http: HttpClient) {}

  getBuilders(params: {}): Observable<ApiResponse<Builder[]>> {
    return this.http.get<ApiResponse<Builder[]>>(`/user/builders?${params}`).pipe(
      map(builders => {
        return builders;
      }),
    );
  }

  getBuilderComResiProjects(params: {}): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`/user/builder_com_resi_projects?${params}`).pipe(
      map((builders: any) => {
        builders.data.subbuilders.map(builder => this.setStartingPrice(builder));
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
    let prices: any = [];
    const updatedWorkspace = coLiving;
    if (coLiving.plans) {
      let data = coLiving.plans;
      if (data.length > 0) {
        for (let index = 0; index < data.length; index++) {
          if (data[index].floor_plans.length > 0) {
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
        }
        if (prices.length > 0) {
          prices = prices.reduce((lowest, item) => {
            if (item.rent_price < lowest.rent_price) {
              return item;
            } else {
              return lowest;
            }
          });
        }
        coLiving.starting_name = prices.name;
        coLiving.starting_plan = prices.plan;
        coLiving.starting_price = prices.rent_price;
        coLiving.starting_sale_price = prices.sale_price;
        coLiving.starting_duration = 'month';
      }
    }
    return updatedWorkspace;
  }
}
