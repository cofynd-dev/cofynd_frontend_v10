import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { sanitizeParams } from '@app/shared/utils';
import { City } from '@core/models/city.model';
import { SeoSocialShareData } from '@core/models/seo.model';
import { ConfigService } from '@core/services/config.service';
import { SeoService } from '@core/services/seo.service';
import { environment } from '@env/environment';
import { AppConstant } from '@shared/constants/app.constant';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AVAILABLE_CITY_CO_LIVING } from '@core/config/cities';
import { BreadCrumb } from '@core/interface/breadcrumb.interface';
import { CoLiving } from '../../co-living/co-living.model';
import { CoLivingService } from '../../co-living/co-living.service';
import { PriceFilter } from '@app/core/models/workspace.model';
import { script } from '@app/core/config/script';
import { WorkSpaceService } from '@app/core/services/workspace.service';

@Component({
  selector: 'app-co-living-locality',
  templateUrl: './co-living-locality.component.html',
  styleUrls: ['./co-living-locality.component.scss'],
})

export class CoLivingLocalityComponent implements OnInit, OnDestroy {
  availableCities: any = [];
  loading: boolean;
  coLivings: CoLiving[] = [];
  isMapView: boolean = false;
  queryParams: { [key: string]: string | number };
  count = 0;
  page = 1;
  showLoadMore: boolean;
  loadMoreLoading: boolean;
  scrollCount: number;
  title: string;
  isScrolled: boolean;
  isSearchFooterVisible: boolean;
  seoData: SeoSocialShareData;

  // Pagination
  maxSize = 10;
  totalRecords: number;
  pageTitle: string;
  subTitle: string;
  popularLocation = [];
  breadcrumbs: BreadCrumb[];
  IMAGE_STATIC_ALT = [];
  country_name: any;
  countryId: any;
  price_filters = [];
  number_record: number = 20;
  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(DOCUMENT) private _document: Document,
    private _renderer2: Renderer2,
    private coLivingService: CoLivingService,
    private workSpaceService: WorkSpaceService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private configService: ConfigService,
    private seoService: SeoService,
    private el: ElementRef,
  ) {
    // Initial Query Params
    this.queryParams = { ...AppConstant.DEFAULT_SEARCH_PARAMS };
    // Init With Map View
    // this.isMapView = true;
  }

  ngOnInit() {
    combineLatest(this.activatedRoute.url, this.activatedRoute.queryParams)
      .pipe(map(results => ({ routeParams: results[0], queryParams: results[1] })))
      .subscribe(results => {
        this.workSpaceService.getCity(localStorage.getItem('country_id')).subscribe((res: any) => {
          this.availableCities = res.data.filter(city => city.for_coLiving === true);
          const filteredCity = this.availableCities.filter(
            city => city.name.toLowerCase() === this.activatedRoute.snapshot.url[1].path,
          );
          if (filteredCity.length > 0) {
            this.country_name = filteredCity[0]['Country']['name'];
            this.countryId = filteredCity[0]['Country']['id'];
          }
          this.title = results.routeParams[1].path;
          this.subTitle = results.routeParams[2].path.replace(/-/g, ' ');
          this.queryParams = {
            ...AppConstant.DEFAULT_SEARCH_PARAMS,
            key: results.routeParams[2].path + '-' + this.title,
            city: filteredCity[0].id,
            micro_location: 'enabled',
            ...results.queryParams,
          };
          this.IMAGE_STATIC_ALT.push(
            'Co-Living Space in ' + this.subTitle,
            'Co-Living Space ' + this.subTitle + ' ' + this.title,
            'Co-Living Space near ' + this.subTitle,
            'Shared Co-Living Space in ' + this.subTitle,
            'Co-Living Space for rent in ' + this.subTitle,
          );
          this.createBreadcrumb();
          this.getOfficeList(this.queryParams);
          this.page = results.queryParams['page'] ? +results.queryParams['page'] : 1;
          this.addSeoTags(results.routeParams[0].path.toLowerCase(), results.routeParams[1].path.toLowerCase());
          if (results.routeParams[1].path && script.coliving.microLocation[results.routeParams[1].path]) {
            for (let scrt of script.coliving.microLocation[results.routeParams[1].path]) {
              this.setHeaderScript(scrt);
            }
          }
        });
      });
  }

  createBreadcrumb() {
    this.breadcrumbs = [
      {
        title: `${this.country_name}`,
        url: `${this.country_name}`,
        isActive: false,
      },
      {
        title: 'Co Living',
        url: this.country_name + '/co-living',
        isActive: false,
      },
      {
        title: this.title,
        url: this.country_name + '/co-living/' + this.title,
        isActive: false,
      },
      {
        title: this.subTitle,
        url: '',
        isActive: true,
      },
    ];
  }

  getOfficeList(param: any = {}) {
    this.loading = true;
    this.coLivings.length = 0;
    this.price_filters.length = 0;
    param.limit = 20;
    this.coLivingService.getPopularCoLivings(sanitizeParams(param)).subscribe(allOffices => {
      this.coLivings = allOffices.data;
      const found = this.coLivings.find(element => element.starting_price < 15000);
      const found1 = this.coLivings.find(obj => obj.starting_price >= 15000 && obj.starting_price <= 30000);
      const found2 = this.coLivings.find(obj => obj.starting_price >= 30000);
      if (found) {
        this.price_filters.push({ id: '15000', value: 'Less than 15,000' });
      }

      if (found1) {
        this.price_filters.push({ id: '29999', value: '15,000-30,000' });
      }
      if (found2) {
        this.price_filters.push({ id: '30000', value: 'More than 30,000' });
      }

      if (allOffices.data.length) {
        const altCity = this.title === 'gurugram' ? 'gurgaon' : this.title;
        const filteredLocations = AVAILABLE_CITY_CO_LIVING.filter(city => city.name === this.title);
        if (filteredLocations && filteredLocations.length) {
          this.coLivingService.microLocationByCityAndSpaceType(filteredLocations[0].id).subscribe((mlocations: any) => {
            for (let index = 0; index < mlocations.data.length; index++) {
              this.popularLocation.push(mlocations.data[index]['name']);
            }
          })
        }
        const IMAGE_STATIC_ALT = [
          'Co Living Space in ' + altCity,
          'Best Co Living Space in ' + altCity,
          'Rented Co Living Space in ' + altCity,
          'Shared Co Living Space in ' + altCity,
        ];
        this.coLivings[0].images.map((image, index) => {
          image.image.alt = IMAGE_STATIC_ALT[index];
        });
      }
      this.totalRecords = allOffices.totalRecords;
      this.number_record = this.coLivings.length;
      this.loading = false;
      const totalPageCount = Math.round(allOffices.totalRecords / AppConstant.DEFAULT_PAGE_LIMIT);
      this.setRelationCanonical(this.page, totalPageCount);
    });
  }

  addSeoTags(city: string, microLocation: string) {
    this.seoService.getMeta(microLocation + '-' + city + '-co-living').subscribe(seoMeta => {
      if (seoMeta) {
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
      }
    });
  }

  setHeaderScript(_script) {
    let script = this._renderer2.createElement('script');
    script.type = `application/ld+json`;
    script.text = `${_script} `;
    this._renderer2.appendChild(this._document.head, script);
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

  toggleMapView(isMapView: boolean) {
    this.isMapView = isMapView;
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
    this.recallOfficeList();
  }

  onSortTypeChange(sort) {
    this.count = 0;
    this.page = 1;
    this.queryParams = {
      ...this.queryParams,
      page: this.page,
      sortType: sort.value,
    };
    this.recallOfficeList();
  }

  private recallOfficeList() {
    localStorage.setItem(AppConstant.LS_COWORKING_FILTER_KEY, JSON.stringify(this.queryParams));
    this.getOfficeList(this.queryParams);
  }

  resetFilter() {
    const key = `${this.subTitle.replace(/ /g, '-')}-${this.title}`;
    this.queryParams = { key };
    localStorage.removeItem(AppConstant.LS_COWORKING_FILTER_KEY);
    this.getOfficeList(this.queryParams);
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
    if (!searchDescriptionEl) {
      return;
    }
    const searchDescriptionElOffset = searchDescriptionEl.offsetTop - 500;
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    if (scrollPosition > searchDescriptionElOffset) {
      this.isSearchFooterVisible = true;
    } else {
      this.isSearchFooterVisible = false;
    }
  }

  filterMapView(data) {
    this.loading = true;
    if (data == '') {
      this.getOfficeList(this.queryParams);
    } else {
      this.coLivingService.getPopularCoLivings(sanitizeParams(this.queryParams)).subscribe(allOffices => {
        let coLivings = allOffices.data.sort((a: any, b: any) => {
          if (b.priority) {
            return a.priority.location.order > b.priority.location.order ? 1 : -1;
          }
        });

        if (+data == 29999) {
          this.coLivings = coLivings.filter(obj => obj.starting_price >= 15000 && obj.starting_price <= 30000);
        }
        if (+data == 15000) {
          this.coLivings = coLivings.filter(obj => obj.starting_price < 15000);
        }
        if (+data == 30000) {
          this.coLivings = coLivings.filter(obj => obj.starting_price >= 30000);
        }
        if (data == '') {
          this.coLivings = coLivings;
        }
        this.loading = false;
        if (allOffices.data.length) {
          const altCity = this.title === 'gurugram' ? 'gurgaon' : this.title;
          const filteredLocations = AVAILABLE_CITY_CO_LIVING.filter(city => city.name === this.title);
          if (filteredLocations && filteredLocations.length) {
            this.coLivingService.microLocationByCityAndSpaceType(filteredLocations[0].id).subscribe((mlocations: any) => {
              for (let index = 0; index < mlocations.data.length; index++) {
                this.popularLocation.push(mlocations.data[index]['name']);
              }
            })
          }
          const IMAGE_STATIC_ALT = [
            'Co Living Space in ' + altCity,
            'Best Co Living Space in ' + altCity,
            'Rented Co Living Space in ' + altCity,
            'Shared Co Living Space in ' + altCity,
          ];
          this.coLivings[0].images.map((image, index) => {
            image.image.alt = IMAGE_STATIC_ALT[index];
          });
        }
        this.totalRecords = coLivings.length;
        this.number_record = coLivings.length;
        const totalPageCount = Math.round(allOffices.totalRecords / AppConstant.DEFAULT_PAGE_LIMIT);
        this.setRelationCanonical(this.page, totalPageCount);
      });
    }
  }

  ngOnDestroy() {
    this.configService.setDefaultConfigs();
  }
}
