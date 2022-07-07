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
import { CoLiving } from './../co-living.model';
import { CoLivingService } from './../co-living.service';
import { script } from '../../../core/config/script';
import { WorkSpaceService } from '@app/core/services/workspace.service';

@Component({
  selector: 'app-co-living-city',
  templateUrl: './co-living-city.component.html',
  styleUrls: ['./co-living-city.component.scss'],
})
export class CoLivingCityComponent implements OnInit, OnDestroy {
  availableCities: City[] = AVAILABLE_CITY_CO_LIVING;
  loading: boolean = true;
  coLivings: CoLiving[];
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

  popularLocation = [];
  breadcrumbs: BreadCrumb[];
  price_filters = [];
  number_record: number = 20;
  country_name: string = '';
  featuredColiving: string;
  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(DOCUMENT) private _document: Document,
    private _renderer2: Renderer2,

    private coLivingService: CoLivingService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private configService: ConfigService,
    private workSpaceService: WorkSpaceService,
    private seoService: SeoService,
    private el: ElementRef,
  ) {
    // Initial Query Params
    this.queryParams = { ...AppConstant.DEFAULT_SEARCH_PARAMS };
    // Init With Map View
    //this.isMapView = true;
  }

  ngOnInit() {
    this.featuredColiving = localStorage.getItem('featuredColiving');
    console.log("HIIIIIIIIIIII", this.featuredColiving);
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      (this.title = this.activatedRoute.snapshot.url[0].path),
        this.workSpaceService.getByCityName1(this.title).subscribe((res: any) => {
          this.country_name = res.data.country.name;
          localStorage.setItem('country_name', res.data.country.name);
          localStorage.setItem('country_id', res.data.country.id);
          const filteredCity = this.availableCities.filter(
            city => city.name.toLowerCase() === this.activatedRoute.snapshot.url[0].path,
          );
          console.log("filteredCity", this.availableCities, filteredCity)
          this.title = filteredCity[0].name;
          this.createBreadcrumb();
          const prevParam = JSON.parse(localStorage.getItem(AppConstant.LS_COLIVING_FILTER_KEY));
          if (this.featuredColiving && this.featuredColiving == 'Inclusive') {
            this.queryParams = {
              ...AppConstant.DEFAULT_SEARCH_PARAMS,
              city: filteredCity[0].id,
              food: this.featuredColiving,
              ...params,
              ...prevParam,
            };
          }
          else if (this.featuredColiving && this.featuredColiving == '625698d3a91948671a4c590b') {
            this.queryParams = {
              ...AppConstant.DEFAULT_SEARCH_PARAMS,
              city: filteredCity[0].id,
              privaterooom: this.featuredColiving,
              ...params,
              ...prevParam,
            };
          }
          else if (this.featuredColiving && this.featuredColiving == '625698e8a91948671a4c590c') {
            this.queryParams = {
              ...AppConstant.DEFAULT_SEARCH_PARAMS,
              city: filteredCity[0].id,
              twinsharing: this.featuredColiving,
              ...params,
              ...prevParam,
            };
          } else {
            this.queryParams = {
              ...AppConstant.DEFAULT_SEARCH_PARAMS,
              city: filteredCity[0].id,
              ...params,
              ...prevParam,
            };
          }
          this.getOfficeList(this.queryParams);
          this.page = params['page'] ? +params['page'] : 1;
          this.addSeoTags(this.title.toLowerCase());
        });
    });
    if (this.title) {
      for (let scrt of script.coliving[this.title]) {
        this.setHeaderScript(scrt);
      }
    }
  }

  createBreadcrumb() {
    this.breadcrumbs = [
      {
        title: 'Co Living',
        url: 'co-living',
        isActive: false,
      },
      {
        title: this.title,
        url: this.title,
        isActive: true,
      },
    ];
  }

  getOfficeList(param: any = {}) {
    console.log("param", param);
    this.price_filters.length = 0;
    this.number_record = 20;
    this.loading = true;
    // this.coLivings.length = 0;
    // (param.limit = 100000),
    // (param.maxPrice = 15000),
    // param.minPrice = 15000;
    // param.maxPrice = 30000;
    this.coLivingService.getCoLivings(sanitizeParams(param)).subscribe(allOffices => {
      console.log("allOffices", allOffices);
      this.coLivings = allOffices.data.sort((a: any, b: any) => {
        if (b.priority) {
          return a.priority.location.order > b.priority.location.order ? 1 : -1;
        }
      });

      if (allOffices.data.length) {
        const altCity = this.title === 'gurugram' ? 'gurgaon' : this.title;

        const filteredLocations = AVAILABLE_CITY_CO_LIVING.filter(city => city.name === this.title);
        if (filteredLocations && filteredLocations.length) {
          this.popularLocation = filteredLocations[0].locations;
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
  filterMapView(data) {
    if (data == '') {
      this.getOfficeList(this.queryParams);
    } else {
      localStorage.setItem('range_', data);
      this.loading = true;
      let obj = {
        limit: 10000,
        city: this.queryParams.city,
      };
      this.coLivingService.getCoLivings(sanitizeParams(obj)).subscribe(allOffices => {
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
            this.popularLocation = filteredLocations[0].locations;
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

  ngOnDestroy() {
    this.configService.setDefaultConfigs();
  }
}
