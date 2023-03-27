import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchResult } from '@app/core/models/search-result.model';
import { ApiResponse } from '@core/models/api-response.model';
import { OfficeSpace } from '@core/models/office-space.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OfficeSpaceService {
  constructor(private http: HttpClient) { }

  getOffices(params: {}): Observable<ApiResponse<OfficeSpace[]>> {
    return this.http.get<ApiResponse<OfficeSpace[]>>(`/user/officeSpaces?${params}`).pipe(map(offices => offices));
  }

  getOffice(slug: string) {
    return this.http.get<{ data: OfficeSpace }>(`/user/officeSpaces/${slug}`).pipe(map(office => office.data));
  }

  searchOffice(keyword: string): Observable<SearchResult> {
    return this.http.get<SearchResult>(`/user/officeSpaces?name=${keyword}`).pipe(map(searchResult => searchResult));
  }

  getPopularOffices(params: {}): Observable<ApiResponse<OfficeSpace[]>> {
    return this.http
      .get<ApiResponse<OfficeSpace[]>>(`/user/officeSpace/popular?${params}`)
      .pipe(map(offices => offices));
  }

  microLocationByCityAndSpaceType(cityId: any) {
    return this.http.get<ApiResponse<any[]>>(`/user/microLocationByCitySpaceType?cityId=${cityId}&for_office=${true}`).pipe(
      map(microlocations => {
        return microlocations;
      }),
    );
  }
}
