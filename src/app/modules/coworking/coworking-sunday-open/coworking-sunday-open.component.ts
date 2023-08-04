import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { removeSpecialCharacterFromString, sanitizeParams } from '@app/shared/utils';
import { AVAILABLE_CITY } from '@core/config/cities';
import { BreadCrumb } from '@core/interface/breadcrumb.interface';
import { City } from '@core/models/city.model';
import { SeoSocialShareData } from '@core/models/seo.model';
import { PriceFilter, WorkSpace } from '@core/models/workspace.model';
import { ConfigService } from '@core/services/config.service';
import { SeoService } from '@core/services/seo.service';
import { WorkSpaceService } from '@core/services/workspace.service';
import { environment } from '@env/environment';
import { AppConstant } from '@shared/constants/app.constant';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-coworking-sunday-open',
  templateUrl: './coworking-sunday-open.component.html',
  styleUrls: ['./coworking-sunday-open.component.scss'],
})
export class CoworkingSundayOpenComponent implements OnInit, OnDestroy {
  loading = true;
  workSpaces: WorkSpace[];

  queryParams: { [key: string]: string | number };
  count = 0;
  page = 1;
  showLoadMore: boolean;
  loadMoreLoading: boolean;

  isMapView: boolean;
  scrollCount: number;
  title: string;
  isScrolled: boolean;
  isSearchFooterVisible: boolean;
  seoData: SeoSocialShareData;
  availableCities: City[] = AVAILABLE_CITY;
  pageTitle: string;

  // Pagination
  maxSize = 10;
  totalRecords: number;
  breadcrumbs: BreadCrumb[];

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private activatedRoute: ActivatedRoute,
    private workSpaceService: WorkSpaceService,
    private configService: ConfigService,
    private seoService: SeoService,
    private router: Router,
    private el: ElementRef,
  ) {
    // Remove Footer From Listing
    // this.configService.updateConfig({ headerClass: 'search-listing' });

    this.queryParams = { ...AppConstant.DEFAULT_SEARCH_PARAMS };

    // Init With Map View
    this.isMapView = true;
  }

  ngOnInit() {
    combineLatest(this.activatedRoute.url, this.activatedRoute.queryParams)
      .pipe(map(results => ({ routeParams: results[0], queryParams: results[1] })))
      .subscribe(results => {
        this.title = removeSpecialCharacterFromString(results.routeParams[0].path);
        this.queryParams = {
          ...AppConstant.DEFAULT_SEARCH_PARAMS,
          is_sunday_open: 'true',
          ...results.queryParams,
        };
        this.page = results.queryParams['page'] ? +results.queryParams['page'] : 1;
        this.createBreadcrumb();
        this.loadWorkSpaces(this.queryParams);
        this.addSeoTags();
      });
  }

  createBreadcrumb() {
    this.breadcrumbs = [
      {
        title: 'Coworking',
        url: 'coworking',
        isActive: false,
      },
      {
        title: this.title,
        url: '',
        isActive: true,
      },
    ];
  }

  addSeoTags() {
    this.seoService.getMeta('sunday-open').subscribe(seoMeta => {
      this.pageTitle = seoMeta.page_title;
      this.seoData = {
        title: seoMeta.title,
        image: 'https://cofynd.com/assets/images/meta/cofynd-facebook.jpg',
        description: seoMeta.description,
        url: environment.appUrl + this.router.url,
        type: 'website',
        footer_title: seoMeta.footer_title,
        footer_description: seoMeta.footer_description,
      };
      this.seoService.setData(this.seoData);
    });
  }

  loadWorkSpaces(param: {}) {
    this.loading = true;
    this.workSpaceService.getWorkspaces(sanitizeParams(param)).subscribe(allWorkSpaces => {
      this.workSpaces = allWorkSpaces.data;
      this.totalRecords = allWorkSpaces.totalRecords;

      this.loading = false;

      if (allWorkSpaces.data.length) {
        const IMAGE_STATIC_ALT = [
          'Coworking Space open Sunday',
          'Coworking Spaces on Sunday',
          'Sunday open Coworking Spaces',
          'Sunday open Spaces',
        ];
        this.workSpaces[0].images.map((image, index) => {
          image.image.alt = IMAGE_STATIC_ALT[index];
        });
      }

      // Set Rel Canonical
      if (allWorkSpaces.totalRecords > 20) {
        const totalPageCount = Math.round(allWorkSpaces.totalRecords / AppConstant.DEFAULT_PAGE_LIMIT);
        this.setRelationCanonical(this.page, totalPageCount);
      }
    });
  }

  setRelationCanonical(currentPage: number, totalCount: number) {
    const currentUrl = environment.appUrl + this.router.url.split('?')[0] + '?page=';
    const prevPage = currentPage - 1;
    const nextPage = currentPage + 1;
    const nextPageCanonical = currentUrl + nextPage;
    const prevPageCanonical = currentUrl + prevPage;

    if (prevPage >= 1) {
      this.seoService.setPrevRelationUrl(prevPageCanonical);
    }

    if (currentPage !== totalCount) {
      this.seoService.setNextRelationUrl(nextPageCanonical);
    }
  }

  loadMore(event: any) {
    this.page = event.page;
    this.queryParams = { ...this.queryParams, page: this.page };
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { page: this.page },
      queryParamsHandling: 'merge',
    });

    // Reset All Scroll Activities
    this.isScrolled = false;
    this.scrollCount = 0;
    this.isSearchFooterVisible = false;
  }

  onFilterPriceChange(priceRange: PriceFilter) {
    // Reset pagination to 1 & count to 0 & load more button to false for new results
    this.count = 0;
    this.page = 1;

    this.queryParams = {
      ...this.queryParams,
      page: this.page,
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

    if (isPlatformBrowser(this.platformId)) {
      this.changeMapPosition();
    }
  }

  changeMapPosition() {
    const searchDescriptionEl = this.el.nativeElement.querySelector('.search-description');
    const searchDescriptionElOffset = searchDescriptionEl.offsetTop - 800;
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    if (scrollPosition > searchDescriptionElOffset) {
      this.isSearchFooterVisible = true;
    } else {
      this.isSearchFooterVisible = false;
    }
  }

  ngOnDestroy() {
    this.configService.setDefaultConfigs();
  }
}
