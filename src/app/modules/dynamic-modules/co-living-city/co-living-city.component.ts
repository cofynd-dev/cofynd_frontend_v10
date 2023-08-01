import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PriceFilter } from '@app/core/models/workspace.model';
import { sanitizeParams } from '@app/shared/utils';
import { AVAILABLE_CITY_CO_LIVING } from '@core/config/cities';
import { BreadCrumb } from '@core/interface/breadcrumb.interface';
import { City } from '@core/models/city.model';
import { SeoSocialShareData } from '@core/models/seo.model';
import { ConfigService } from '@core/services/config.service';
import { SeoService } from '@core/services/seo.service';
import { environment } from '@env/environment';
import { AppConstant } from '@shared/constants/app.constant';
import { CoLiving } from '../../co-living/co-living.model';
import { CoLivingService } from '../../co-living/co-living.service';
import { script } from '../../../core/config/script';
import { WorkSpaceService } from '@app/core/services/workspace.service';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-co-living-city',
  templateUrl: './co-living-city.component.html',
  styleUrls: ['./co-living-city.component.scss'],
})
export class CoLivingCityComponent implements OnInit, OnDestroy {
  availableCities: any = [];
  loading: boolean = true;
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
  price_filters = [];
  // Pagination
  maxSize = 10;
  totalRecords: number;
  pageTitle: string;

  popularLocation = [];
  breadcrumbs: BreadCrumb[];
  country_name: any;
  countryId: any;
  noDataRouteUrl: string;
  number_record: number = 20;
  activeCountries: any = [];
  inActiveCountries: any = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(DOCUMENT) private _document: Document,
    private _renderer2: Renderer2,
    private workSpaceService: WorkSpaceService,
    private coLivingService: CoLivingService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private configService: ConfigService,
    private seoService: SeoService,
    private el: ElementRef,
  ) {
    // Initial Query Params
    this.queryParams = { ...AppConstant.DEFAULT_SEARCH_PARAMS };
    // Init With Map View
    //this.isMapView = true;
  }

  ngOnInit() {
    this.getCountries();
    combineLatest(this.activatedRoute.url, this.activatedRoute.queryParams)
      .pipe(map(results => ({ routeParams: results[0], queryParams: results[1] })))
      .subscribe(results => {
        this.activatedRoute.queryParams.subscribe((params: Params) => {
          this.title = results.routeParams[1].path;
          this.workSpaceService.getByCityName1(this.title).subscribe((res: any) => {
            this.country_name = res.data.country.name;
            localStorage.setItem('country_name', res.data.country.name);
            localStorage.setItem('country_id', res.data.country.id);
            this.workSpaceService.getCity(res.data.country.id).subscribe((res: any) => {
              this.availableCities = res.data.filter(city => city.for_coLiving === true);
              const filteredCity = this.availableCities.filter(
                city => city.name.toLowerCase() === this.activatedRoute.snapshot.url[1].path,
              );
              if (filteredCity.length > 0) {
                this.country_name = filteredCity[0]['Country']['name'];
                this.countryId = filteredCity[0]['Country']['id'];
              }
              this.title = filteredCity[0].name;
              this.createBreadcrumb();
              const prevParam = JSON.parse(localStorage.getItem(AppConstant.LS_COLIVING_FILTER_KEY));
              this.queryParams = {
                ...AppConstant.DEFAULT_SEARCH_PARAMS,
                city: filteredCity[0].id,
                ...params,
                ...prevParam,
              };
              this.getOfficeList(this.queryParams);
              this.noDataRouteUrl = `/${this.country_name}/co-living`;
              this.page = params['page'] ? +params['page'] : 1;
              this.addSeoTags(this.title.toLowerCase());
            });
          });
        });
      });
  }

  getCountries() {
    this.workSpaceService.getCountry({}).subscribe((res: any) => {
      if (res.data) {
        this.activeCountries = res.data.filter(v => {
          return v.for_coWorking === true;
        });
        this.inActiveCountries = res.data.filter(v => {
          return v.for_coWorking == false;
        });
      }
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
        url: this.country_name + '/co-living/' + this.title.toLocaleLowerCase(),
        isActive: false,
      },
    ];
  }

  getOfficeList(param: any = {}) {
    this.loading = true;
    param.limit = 20;
    this.number_record = 20;
    this.price_filters.length = 0;
    this.coLivingService.getCoLivings(sanitizeParams(param)).subscribe(allOffices => {
      this.coLivings = allOffices.data.sort((a: any, b: any) => {
        if (b.priority) {
          return a.priority.location.order > b.priority.location.order ? 1 : -1;
        }
      });

      if (allOffices.data.length) {
        const altCity = this.title === 'gurugram' ? 'gurgaon' : this.title;
        const filteredLocations = this.availableCities.filter(
          city => city.name.toLowerCase().trim() === this.title.toLowerCase().trim(),
        );
        if (filteredLocations && filteredLocations.length) {
          this.coLivingService.microLocationByCityAndSpaceType(filteredLocations[0].id).subscribe((mlocations: any) => {
            for (let index = 0; index < mlocations.data.length; index++) {
              this.popularLocation.push(mlocations.data[index]['name']);
            }
          });
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
      this.loading = false;
      const totalPageCount = Math.round(allOffices.totalRecords / AppConstant.DEFAULT_PAGE_LIMIT);
      this.setRelationCanonical(this.page, totalPageCount);
    });
  }

  addSeoTags(city: string) {
    this.seoService.getMeta(city + '-co-living').subscribe(seoMeta => {
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
        if (seoMeta && seoMeta.script && this.title) {
          const array = JSON.parse(seoMeta.script);
          for (let scrt of array) {
            scrt = JSON.stringify(scrt);
            this.setHeaderScript(scrt);
          }
        }
      }
    });
  }

  setHeaderScript(cityScript) {
    let script = this._renderer2.createElement('script');
    script.type = `application/ld+json`;
    script.text = `${cityScript} `;
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

  onSortTypeChange(sort) {
    this.count = 0;
    this.page = 1;
    this.queryParams = {
      ...this.queryParams,
      page: this.page,
      sortType: sort.value,
    };

    this.recallCoworkingList();
  }

  onFilterPriceChange(priceRange: PriceFilter) {
    this.count = 0;
    this.page = 1;
    this.queryParams = {
      ...this.queryParams,
      page: this.page,
      minPrice: priceRange.minPrice,
      maxPrice: priceRange.maxPrice,
    };

    this.recallCoworkingList();
  }

  private recallCoworkingList() {
    localStorage.setItem(AppConstant.LS_COLIVING_FILTER_KEY, JSON.stringify(this.queryParams));
    this.getOfficeList(this.queryParams);
  }

  resetFilter() {
    const { city, limit } = this.queryParams;
    this.queryParams = { city, limit };
    localStorage.removeItem(AppConstant.LS_COLIVING_FILTER_KEY);
    this.getOfficeList(this.queryParams);
  }
  removedash(name: string) {
    return name.replace(/-/, ' ');
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
      this.queryParams.limit = 10000;
      this.coLivingService.getCoLivings(sanitizeParams(this.queryParams)).subscribe(allOffices => {
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
            this.coLivingService
              .microLocationByCityAndSpaceType(filteredLocations[0].id)
              .subscribe((mlocations: any) => {
                for (let index = 0; index < mlocations.data.length; index++) {
                  this.popularLocation.push(mlocations.data[index]['name']);
                }
              });
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
