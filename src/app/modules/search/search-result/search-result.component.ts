import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConstant } from '@app/shared/constants/app.constant';
import { isEmptyObject, sanitizeParams } from '@app/shared/utils';
import { BreadCrumb } from '@core/interface/breadcrumb.interface';
import { City } from '@core/models/city.model';
import { PriceFilter, WorkSpace } from '@core/models/workspace.model';
import { ConfigService } from '@core/services/config.service';
import { ScrollService } from '@core/services/scroll.service';
import { WorkSpaceService } from '@core/services/workspace.service';
import { environment } from '@env/environment';
import { combineLatest, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { AVAILABLE_CITY } from '@core/config/cities';
import { CoLivingService } from '@app/modules/co-living/co-living.service';


@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent implements OnInit, OnDestroy {
  S3_URL = environment.images.S3_URL;
  availableCities: City[] = AVAILABLE_CITY;
  loading: boolean;
  workSpaces: WorkSpace[];
  searchTitle = '';

  page = 1;
  loadMoreLoading: boolean;

  count = 0;
  showLoadMore: boolean;
  private pageScrollSubject = new Subject();

  queryParams: { [key: string]: string | number };

  // For Sticky Sections
  isScrolled: boolean;
  scrollCount = 0;
  isMapView: boolean;
  isLatLongSearch: boolean;
  breadcrumbs: BreadCrumb[];
  globalUrl: any;
  spaceType: any;
  constructor(
    private workSpaceService: WorkSpaceService,
    private configService: ConfigService,
    private activatedRoute: ActivatedRoute,
    private scrollService: ScrollService,
    private router: Router,
    private coLivingService: CoLivingService,
  ) {
    this.configService.configs.footer = false;
    // Set map view true by default
    this.isMapView = true;
    this.loading = true;
  }

  ngOnInit() {
    combineLatest(this.activatedRoute.params, this.activatedRoute.queryParams)
      .pipe(map(results => ({ routeParams: results[0], queryParams: results[1] })))
      .subscribe(results => {
        this.globalUrl = this.router.url;
        if (results.routeParams.slug) {
          this.isLatLongSearch = false;
          this.queryParams = { ...AppConstant.DEFAULT_SEARCH_PARAMS, key: results.routeParams.slug };
          this.searchTitle = results.routeParams.slug;
          this.loadWorkSpaces(this.queryParams);
          return;
        }

        if (!isEmptyObject(results.queryParams)) {
          this.isLatLongSearch = true;
          let obj = {
            latitude: '',
            longitude: '',
          };
          if (results.queryParams['coworking-latitude']) {
            obj['latitude'] = results.queryParams['coworking-latitude'];
            obj['longitude'] = results.queryParams['longitude'];
            this.spaceType = 'coworking';
          }
          if (results.queryParams['coliving-latitude']) {
            obj['latitude'] = results.queryParams['coliving-latitude'];
            obj['longitude'] = results.queryParams['longitude'];
            this.spaceType = 'co-living';
          }
          this.queryParams = { ...AppConstant.DEFAULT_SEARCH_PARAMS, ...obj };
          const urlSplit = this.globalUrl.split('-');
          if (urlSplit && urlSplit[0] === '/search?coworking') {
            this.loadWorkSpacesByLatLong(this.queryParams);
          }
          if (urlSplit && urlSplit[0] === '/search?coliving') {
            this.loadColivingSpacesByLatLong(this.queryParams);
          }
          return;
        }
        this.createBreadcrumb();
      });

    // Load More Scroll Position
    this.scrollService.onScrolledDown$.pipe(takeUntil(this.pageScrollSubject)).subscribe(() => this.loadMore());
  }

  createBreadcrumb() {
    this.breadcrumbs = [
      {
        title: this.searchTitle,
        url: '',
        isActive: true,
      },
    ];
  }

  loadWorkSpacesByLatLong(param: {}) {
    this.loading = true;
    this.workSpaceService.getWorkspaces(sanitizeParams(param)).subscribe(allWorkSpaces => {
      this.workSpaces = allWorkSpaces.data;

      this.count = allWorkSpaces.data.length;
      if (allWorkSpaces.totalRecords > this.count) {
        this.showLoadMore = true;
      }

      this.loading = false;
    });
  }
  loadColivingSpacesByLatLong(param: {}) {
    this.loading = true;
    this.coLivingService.getCoLivings(sanitizeParams(param)).subscribe(allWorkSpaces => {
      this.workSpaces = allWorkSpaces.data;
      this.count = allWorkSpaces.data.length;
      if (allWorkSpaces.totalRecords > this.count) {
        this.showLoadMore = true;
      }

      this.loading = false;
    });
  }

  loadWorkSpaces(param: {}) {
    this.loading = true;
    this.workSpaceService.getWorSpacesByAddress(sanitizeParams(param)).subscribe(allWorkSpaces => {
      this.workSpaces = allWorkSpaces.data;

      this.count = allWorkSpaces.data.length;
      if (allWorkSpaces.totalRecords > this.count) {
        this.showLoadMore = true;
      }

      this.loading = false;
    });
  }

  loadMore() {
    // TODO: FIX ME
    this.page++;
    this.loadMoreLoading = true;
    this.queryParams = { ...this.queryParams, page: this.page };

    if (!this.isLatLongSearch) {
      this.workSpaceService.getWorSpacesByAddress(sanitizeParams(this.queryParams)).subscribe(allWorkSpaces => {
        this.workSpaces = [...this.workSpaces, ...allWorkSpaces.data];
        this.count = this.count + 20;
        this.loadMoreLoading = false;

        if (this.count >= allWorkSpaces.totalRecords) {
          this.showLoadMore = false;
        }
      });
    } else {
      this.workSpaceService.getWorkspaces(sanitizeParams(this.queryParams)).subscribe(allWorkSpaces => {
        this.workSpaces = [...this.workSpaces, ...allWorkSpaces.data];
        this.count = this.count + 20;
        this.loadMoreLoading = false;

        if (this.count >= allWorkSpaces.totalRecords) {
          this.showLoadMore = false;
        }
      });
    }
  }

  onFilterPriceChange(priceRange: PriceFilter) {
    // Reset pagination to 1 & count to 0 & load more button to false for new results
    this.count = 0;
    this.showLoadMore = false;

    this.queryParams = {
      ...this.queryParams,
      page: 1,
      minPrice: priceRange.minPrice,
      maxPrice: priceRange.maxPrice,
    };

    this.loadWorkSpaces(this.queryParams);
  }

  toggleMapView(isMapView: boolean) {
    this.isMapView = isMapView;
  }

  onPageScroll(event: { scroll: boolean; count: number }) {
    this.isScrolled = event.scroll;
    this.scrollCount = event.count;
  }

  ngOnDestroy() {
    this.configService.setDefaultConfigs();
    this.pageScrollSubject.next();
    this.pageScrollSubject.complete();
  }
}
