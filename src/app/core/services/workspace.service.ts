import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@core/models/api-response.model';
import { SearchResult } from '@core/models/search-result.model';
import { WorkSpace, WorkSpacePlan } from '@core/models/workspace.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Review } from '../models/review.model';
import { compact } from 'lodash';
import { City } from '../models/city.model';

@Injectable({
  providedIn: 'root',
})
export class WorkSpaceService {
  // For Search Place
  private searchAddress: BehaviorSubject<string> = new BehaviorSubject<string>('');
  readonly searchAddress$ = this.searchAddress.asObservable();
  private profileReviewByUser$: BehaviorSubject<Review> = new BehaviorSubject(null);

  constructor(private http: HttpClient) { }

  getWorkspaces(params: {}): Observable<ApiResponse<WorkSpace[]>> {
    return this.http.get<ApiResponse<WorkSpace[]>>(`/user/workSpaces?${params}`).pipe(
      map(workspaces => {
        // we modify the response to display starting price & price type
        workspaces.data.map(workspace => this.setStartingPrice(workspace));
        return workspaces;
      }),
    );
  }

  getWorkspace(id: string) {
    return this.http.get<{ data: WorkSpace }>(`/user/workSpace/${id}`).pipe(
      map(workspace => {
        // we modify the response to display starting price & price type
        const modifiedWorkspace: WorkSpace = this.setStartingPrice(workspace.data);
        return modifiedWorkspace;
      }),
    );
  }

  getWorkspacesByBrand(slug: string, params: {}): Observable<ApiResponse<WorkSpace[]>> {
    return this.http.get<ApiResponse<WorkSpace[]>>(`/user/workSpacesByBrand/${slug}?${params}`).pipe(
      map(workspaces => {
        // we modify the response to display starting price & price type
        workspaces.data.map(workspace => this.setStartingPrice(workspace));
        return workspaces;
      }),
    );
  }

  getWorkspacesByBrandAndCity(slug: string, city: string, params: {}): Observable<ApiResponse<WorkSpace[]>> {
    return this.http.get<ApiResponse<WorkSpace[]>>(`/user/workSpacesByBrand/${slug}/${city}?${params}`).pipe(
      map(workspaces => {
        workspaces.data.map(workspace => this.setStartingPrice(workspace));
        return workspaces;
      }),
    );
  }
  getCountry(data: any): Observable<ApiResponse<City[]>> {
    return this.http.post<ApiResponse<City[]>>(`/user/countryByDynamic`, data).pipe(
      map(City => {
        return City;
      }),
    );
  }
  getCity(countryId: string) {
    return this.http.get<ApiResponse<City[]>>(`/user/getCityByCountry/${countryId}`).pipe(
      map(citys => {
        return citys;
      }),
    );
  }
  getByCity_name(params: any): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`/user/getByCity_name/${params}`).pipe(
      map(workspaces => {
        return workspaces;
      }),
    );
  }
  getCountryByName(params: any): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`/user/getCountryByName/${params}`).pipe(
      map(workspaces => {
        return workspaces;
      }),
    );
  }
  getByCityName1(params: any): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`/user/getByCityName1/${params}`).pipe(
      map(workspaces => {
        return workspaces;
      }),
    );
  }
  WorkSpacesCountryWise(data: any): Observable<ApiResponse<WorkSpace[]>> {
    return this.http.post<ApiResponse<WorkSpace[]>>(`/user/WorkSpacesCountryWise`, data).pipe(
      map((workspaces: any) => {
        // we modify the response to display starting price & price type
        workspaces.data.popularSpaces.map(workspace => this.setStartingPrice(workspace));
        return workspaces;
      }),
    );
  }
  searchWorkspaces_country(keyword: string, data: any): Observable<SearchResult> {
    return this.http.post<SearchResult>(`/user/workSpaces_country_wise?name=${keyword}`, data).pipe(map(searchResult => searchResult));
  }


  setStartingPrice(workspace: WorkSpace) {
    console.log(workspace);
    if (workspace.plans.length) {
      let planPrice = []
      planPrice = workspace.plans.map(plan => {
        workspace.show_price = plan.should_show;
        return plan.duration !== WorkSpacePlan.DAY_PASS ? plan.price : null;
      });
      if (planPrice.length == 1 && planPrice[0] == null) {
        planPrice = workspace.plans.map(plan => {
          workspace.show_price = plan.should_show;
          return plan.duration == WorkSpacePlan.DAY_PASS ? plan.price : null;
        });
      }
      const updatedWorkspace = workspace;
      workspace.starting_price = Math.min(...planPrice.filter(Boolean));
      let index = workspace.plans.findIndex(x => x.price == workspace.starting_price);
      workspace.price_type = workspace.plans[index].duration;
      return updatedWorkspace;
    } else {
      return workspace;
    }
  }

  getPopularWorSpaces() {
    return this.http.get<ApiResponse<{ popularSpaces: WorkSpace[] }>>(`/user/popularWorkSpaces`).pipe(
      map(response => {
        const sanitizeResult = this.sanitizePopularSpaces(response.data.popularSpaces);
        return sanitizeResult;
      }),
    );
  }
  popularWorkSpacesCountryWise(data) {
    return this.http.post<ApiResponse<{ popularSpaces: WorkSpace[] }>>(`/user/popularWorkSpacesCountryWise`, data).pipe(
      map((response: any) => {
        // we modify the response to display starting price & price type
        const sanitizeResult = this.sanitizePopularSpaces(response.data.popularSpaces);
        return sanitizeResult;
      }),
    );
  }
  getWorSpacesByAddress(params: {}): Observable<ApiResponse<WorkSpace[]>> {
    return this.http.get<ApiResponse<WorkSpace[]>>(`/user/workSpaces/popular?${params}`).pipe(
      map(workspaces => {
        // we modify the response to display starting price & price type
        workspaces.data.map(workspace => this.setStartingPrice(workspace));
        return workspaces;
      }),
    );
  }

  sanitizePopularSpaces(response: WorkSpace[]) {
    //  sanitize the response for showing the popular Work Spaces on Home page
    return response.map(workspace => {
      return {
        name: workspace.name,
        slug: workspace.slug,
        address: workspace.location.address1,
        country: workspace.country_dbname,
        countryId: workspace.location.country,
        city: workspace.location.city.name,
        space_type: workspace.space_type,
        image:
          (workspace.images.length && workspace.images[0].image.s3_link) ||
          '/assets/images/home/Gohive_Gurgaon_ParasTrinity_GolfCourseExtnRoad.png',
        id: workspace.id,
      };
    });
  }

  getSpaceReviewByUser(user, space): Observable<Review> {
    return this.http.get<{ data: Review }>(`/user/spaceReviews/${space}/user/${user}`).pipe(map(result => result.data));
  }

  checkReviewSpace(url, review, spaceId): Review {
    const space = url.split('/')[1];
    switch (space) {
      case 'coworking':
        review.on_model = 'WorkSpace';
        break;
      case 'co-living':
        review.on_model = 'ColivingSpace';
        break;
      case 'office-space':
        review.on_model = 'OfficeSpace';
        break;
    }
    review.space = spaceId;
    review.user = review.user.id;
    return review;
  }

  searchWorkspaces(keyword: string): Observable<SearchResult> {
    return this.http.get<SearchResult>(`/user/workSpaces?name=${keyword}`).pipe(map(searchResult => searchResult));
  }

  /** Review Section */

  getProfileReviewByUser(): Observable<Review> {
    return this.profileReviewByUser$.asObservable();
  }

  setProfileReviewByUser(review: Review) {
    this.profileReviewByUser$.next(review);
  }

  getAverageRating(spaceId): Observable<{ average: number }> {
    return this.http
      .get<{ data: { average: number } }>(`/user/spaceAverageReview/${spaceId}`)
      .pipe(map(searchResult => searchResult.data));
  }

  saveReview(review: Review): Observable<Review> {
    if (review.id) {
      return this.http
        .put<{ data: Review }>(`/user/review/${review.id}`, review)
        .pipe(map(searchResult => searchResult.data));
    }
    return this.http.post<{ data: Review }>(`/user/review`, review).pipe(map(searchResult => searchResult.data));
  }

  getReviewsBySpace(spaceId, params: {}): Observable<Review[]> {
    return this.http.get<any>(`/user/spaceReviews/${spaceId}?${params}`).pipe(
      map(searchResult =>
        compact(
          searchResult.data.map(res => {
            if (res.user) {
              return this.santizeReview(res);
            }
          }),
        ),
      ),
    );
  }

  santizeReview(res) {
    let { id, added_on: date, rating, description, user, review_history, status } = res;
    if (status === 'in-review') {
      rating = review_history.rating;
      description = review_history.description;
    }
    return { id, date, rating, description, user, shouldReadMore: true };
  }

  setSearchAddress(searchLocation: string) {
    this.searchAddress.next(searchLocation);
  }

  getBlogs() {
    return this.http.get<any>(`/user/blog/news`).pipe(
      map(searchResult => {
        return searchResult.data.map(item => {
          return item.detail;
        });
      }),
    );
  }
}
