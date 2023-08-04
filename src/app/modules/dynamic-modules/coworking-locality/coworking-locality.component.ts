import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { sanitizeParams } from '@app/shared/utils';
import { AVAILABLE_CITY } from '@core/config/cities';
import { BreadCrumb } from '@core/interface/breadcrumb.interface';
import { SeoSocialShareData } from '@core/models/seo.model';
import { PriceFilter, WorkSpace } from '@core/models/workspace.model';
import { ConfigService } from '@core/services/config.service';
import { SeoService } from '@core/services/seo.service';
import { WorkSpaceService } from '@core/services/workspace.service';
import { environment } from '@env/environment';
import { AppConstant } from '@shared/constants/app.constant';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { uniqBy } from 'lodash';

@Component({
  selector: 'app-coworking-locality',
  templateUrl: './coworking-locality.component.html',
  styleUrls: ['./coworking-locality.component.scss'],
})
export class CoworkingLocalityComponent implements OnInit, OnDestroy {
  loading = true;
  workSpaces: WorkSpace[];

  queryParams: { [key: string]: string | number };
  count = 0;
  page = 1;
  showLoadMore: boolean;
  loadMoreLoading: boolean;
  seoData: SeoSocialShareData;

  isMapView: boolean = false;
  scrollCount: number;
  title: string;
  subTitle: string;
  isScrolled: boolean;
  isSearchFooterVisible: boolean;
  availableCities: any = [];
  // Pagination
  maxSize = 10;
  totalRecords: number;

  // popularLocation = POPULAR_COWORKING_LOCALITY.city;
  cityWisePopularLocation = [];
  IMAGE_STATIC_ALT = [];
  pageTitle: string;
  breadcrumbs: BreadCrumb[];
  country_name: any;
  countryId: any;

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private _renderer2: Renderer2,

    @Inject(PLATFORM_ID) private platformId: any,
    private activatedRoute: ActivatedRoute,
    private workSpaceService: WorkSpaceService,
    private configService: ConfigService,
    private seoService: SeoService,
    private router: Router,
    private el: ElementRef,
  ) {
    this.queryParams = { ...AppConstant.DEFAULT_SEARCH_PARAMS };

    // Init With Map View
    // this.isMapView = true;
  }

  ngOnInit() {
    combineLatest(this.activatedRoute.url, this.activatedRoute.queryParams)
      .pipe(map(results => ({ routeParams: results[0], queryParams: results[1] })))
      .subscribe(results => {
        // this.workSpaceService.getByCityName1(this.title).subscribe((res: any) => {
        this.workSpaceService.getCity(localStorage.getItem('country_id')).subscribe((res: any) => {
          this.availableCities = res.data.filter(city => city.for_coWorking === true);
          const filteredCity = this.availableCities.filter(
            city => city.name.toLowerCase() === this.activatedRoute.snapshot.url[1].path,
          );
          if (filteredCity.length > 0) {
            this.country_name = filteredCity[0]['Country']['name'];
            this.countryId = filteredCity[0]['Country']['id'];
          }
          this.title = results.routeParams[1].path;
          this.subTitle = results.routeParams[2].path.replace(/-/g, ' ');
          const prevParam = JSON.parse(localStorage.getItem(AppConstant.LS_COWORKING_FILTER_KEY));
          this.queryParams = {
            key: results.routeParams[2].path + '-' + this.title,
            city: filteredCity[0].id,
            micro_location: 'enabled',
            ...AppConstant.DEFAULT_SEARCH_PARAMS,
            ...results.queryParams,
            ...prevParam,
          };
          this.IMAGE_STATIC_ALT.push(
            'Coworking Space in ' + this.subTitle,
            'Coworking Space ' + this.subTitle + ' ' + this.title,
            'Coworking Space near ' + this.subTitle,
            'Shared office Space in ' + this.subTitle,
            'Coworking Office Space in ' + this.subTitle,
          );
          this.createBreadcrumb();
          this.loadWorkSpaces(this.queryParams);
          this.page = results.queryParams['page'] ? +results.queryParams['page'] : 1;
          this.addSeoTags(results.routeParams[2].path.toLowerCase() + '-' + this.title.toLowerCase());
        });
        // })
      });
    if (this.subTitle == 'goregaon') {
      this.setHeaderScript();
    }
  }

  setHeaderScript() {
    let script = this._renderer2.createElement('script');
    script.type = `application/ld+json`;
    script.text = `{
      "@context": "https://schema.org/", 
      "@type": "Product", 
      "name": "CoFynd",
      "image": "https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/27e4afed17412e35c0e9614e3b73808bfad114c9.jpg",
      "description": "CoFynd is a space discovery platform that gives you access to 25,000+ coworking spaces.",
      "brand": "CoFynd - Fynd the Right Space, Globally",
      "sku": "CoFynd - Fynd the right Space, Globally",
      "mpn": "CoFynd",
      "offers": {
        "@type": "AggregateOffer",
        "url": "https://cofynd.com/coworking/mumbai/goregaon",
        "priceCurrency": "INR",
        "lowPrice": "5000",
        "highPrice": "15000",
        "offerCount": "100"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.7",
        "bestRating": "5",
        "worstRating": "1",
        "ratingCount": "103"
      },
      "review": {
        "@type": "Review",
        "name": "CoFynd - Fynd the Right Space, Globally",
        "reviewBody": "CoFynd - Fynd the Right Space, Globally",
        "author": {"@type": "Person", "name": "Price"},
        "publisher": {"@type": "Organization", "name": "CoFynd - Fynd the Right Space, Globally"}
      }
    }`;
    this._renderer2.appendChild(this._document.head, script);
  }

  createBreadcrumb() {
    this.breadcrumbs = [
      {
        title: `${this.country_name}`,
        url: `${this.country_name}`,
        isActive: false,
      },
      {
        title: 'Coworking',
        url: this.country_name + '/coworking',
        isActive: false,
      },
      {
        title: this.title,
        url: this.country_name + '/coworking/' + this.title,
        isActive: false,
      },
      {
        title: this.subTitle,
        url: '',
        isActive: true,
      },
    ];
  }

  addSeoTags(city: string) {
    this.seoService.getMeta(city).subscribe(seoMeta => {
      if (seoMeta) {
        this.seoData = {
          title: seoMeta.title,
          image: 'https://cofynd.com/assets/images/meta/cofynd-facebook.jpg',
          description: seoMeta.description,
          url: environment.appUrl + this.router.url,
          type: 'website',
          footer_title: seoMeta.footer_title,
          footer_description: seoMeta.footer_description,
        };
        this.pageTitle = seoMeta.page_title;
        this.seoService.setData(this.seoData);
        if (seoMeta && seoMeta.script) {
          const array = JSON.parse(seoMeta.script);
          for (let scrt of array) {
            scrt = JSON.stringify(scrt);
            this.setHeaderScriptOfLocality(scrt);
          }
        }
      }
    });
  }

  setHeaderScriptOfLocality(localityScript) {
    let script = this._renderer2.createElement('script');
    script.type = `application/ld+json`;
    script.text = `${localityScript}`;
    this._renderer2.appendChild(this._document.head, script);
  }

  loadWorkSpaces(param: {}) {
    this.loading = true;
    this.workSpaceService.getWorSpacesByAddress(sanitizeParams(param)).subscribe(allWorkSpaces => {
      allWorkSpaces.data = uniqBy(allWorkSpaces.data, 'id');
      this.workSpaces = allWorkSpaces.data;
      if (allWorkSpaces.data.length) {
        this.workSpaces[0].images.map((image, index) => {
          image.image.alt = this.IMAGE_STATIC_ALT[index];
        });
        const filteredLocations = AVAILABLE_CITY.filter(city => city.name === this.title);
        if (filteredLocations && filteredLocations.length) {
          this.workSpaceService
            .microLocationByCityAndSpaceType(filteredLocations[0].id)
            .subscribe((mlocations: any) => {
              for (let index = 0; index < mlocations.data.length; index++) {
                this.cityWisePopularLocation.push(mlocations.data[index]['name']);
              }
            });
        }
      }

      this.totalRecords = allWorkSpaces.totalRecords;
      this.loading = false;

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

    this.isScrolled = false;
    this.scrollCount = 0;
    this.isSearchFooterVisible = false;
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

  resetFilter() {
    const key = `${this.subTitle.replace(/ /g, '-')}-${this.title}`;
    this.queryParams = { key };
    localStorage.removeItem(AppConstant.LS_COWORKING_FILTER_KEY);
    this.loadWorkSpaces(this.queryParams);
  }

  private recallOfficeList() {
    localStorage.setItem(AppConstant.LS_COWORKING_FILTER_KEY, JSON.stringify(this.queryParams));
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
