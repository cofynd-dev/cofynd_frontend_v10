import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { sanitizeParams } from '@app/shared/utils';
import { AVAILABLE_CITY_VIRTUAL_OFFICE } from '@core/config/cities';
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
import { ENQUIRY_TYPES } from '@app/shared/components/workspace-enquire/workspace-enquire.component';
import { CountryService } from '@app/core/services/country.service';

@Component({
  selector: 'app-virtual-office-city',
  templateUrl: './virtual-office-city.component.html',
  styleUrls: ['./virtual-office-city.component.scss'],
})
export class VirtualOfficeCityComponent implements OnInit, OnDestroy {
  S3_URL = environment.images.S3_URL;
  availableCities: City[] = AVAILABLE_CITY_VIRTUAL_OFFICE;
  loading = true;
  workSpaces: WorkSpace[];

  queryParams: { [key: string]: string | number | boolean };
  count = 0;
  page = 1;
  showLoadMore: boolean;
  loadMoreLoading: boolean;
  seoData: SeoSocialShareData;
  subTitle: string;

  isMapView: boolean = false;
  scrollCount: number;
  title: string;
  isScrolled: boolean;
  isSearchFooterVisible: boolean;

  // Pagination
  maxSize = 5;
  totalRecords: number;

  popularLocation: City[];
  cityWisePopularLocation = [];
  pageTitle: string;
  breadcrumbs: BreadCrumb[];
  IMAGE_STATIC_ALT = [];
  ENQUIRY_TYPE: number = ENQUIRY_TYPES.COWORKING;
  activeCountries: any = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(DOCUMENT) private _document: Document,
    private _renderer2: Renderer2,
    private activatedRoute: ActivatedRoute,
    private workSpaceService: WorkSpaceService,
    private configService: ConfigService,
    private seoService: SeoService,
    private router: Router,
    private el: ElementRef,
    private countryService: CountryService,
  ) {
    this.queryParams = { ...AppConstant.DEFAULT_SEARCH_PARAMS };
    // Init With Map View
    this.isMapView = false;
  }

  ngOnInit() {
    this.countryService.getCountryList().subscribe(countryList => {
      this.activeCountries = countryList;
    });
    combineLatest(this.activatedRoute.url, this.activatedRoute.queryParams)
      .pipe(map(results => ({ routeParams: results[0], queryParams: results[1] })))
      .subscribe(results => {
        const filteredCity = this.availableCities.filter(
          city => city.name.toLowerCase() === this.activatedRoute.snapshot.url[0].path,
        );
        this.title = results.routeParams[0].path;
        const prevParam = JSON.parse(localStorage.getItem(AppConstant.LS_COWORKING_FILTER_KEY));
        this.queryParams = {
          ...AppConstant.DEFAULT_SEARCH_PARAMS,
          city: filteredCity[0].id,
          for_virtual: true,
          ...results.queryParams,
          ...prevParam,
        };
        this.page = results.queryParams['page'] ? +results.queryParams['page'] : 1;

        this.IMAGE_STATIC_ALT.push(
          'Virtual Office in ' + this.subTitle,
          'Virtual Office ' + this.subTitle + ' ' + this.title,
          'Virtual Office near ' + this.subTitle,
          'Virtual Office Space in ' + this.subTitle,
          'Virtual Office Space in ' + this.subTitle,
        );
        if (results.routeParams[1]) {
          this.subTitle = results.routeParams[1].path.replace(/-/g, ' ');
          this.queryParams = {
            ...AppConstant.DEFAULT_SEARCH_PARAMS,
            key: results.routeParams[1].path + '-' + this.title,
            city: filteredCity[0].id,
            for_virtual: true,
            ...results.queryParams,
          };
        } else {
          this.addSeoTags(this.title.toLowerCase());
        }
        this.createBreadcrumb();
        this.loadWorkSpaces(this.queryParams);
      });
  }

  createBreadcrumb() {
    this.breadcrumbs = [
      {
        title: 'Virtual Office',
        url: 'virtual-office',
        isActive: false,
      },
      {
        title: this.title,
        url: 'virtual-office/' + this.title,
        isActive: true,
      },
    ];
  }

  addSeoTags(city: string) {
    this.seoService.getMeta(city + '-virtual-office').subscribe(seoMeta => {
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

  loadWorkSpaces(param: {}) {
    this.loading = true;
    this.workSpaceService.getWorkspaces(sanitizeParams(param)).subscribe(allWorkSpaces => {
      this.workSpaces = allWorkSpaces.data;
      if (allWorkSpaces.data.length) {
        const filteredLocations = this.availableCities.filter(city => city.name === this.title);

        if (filteredLocations && filteredLocations.length) {
          this.cityWisePopularLocation = filteredLocations[0].locations;
        }
        const altCity = this.title === 'gurugram' ? 'gurgaon' : this.title;
        if (this.workSpaces.length) {
          this.workSpaces[0].images.map((image, index) => {
            image.image.alt = this.IMAGE_STATIC_ALT[index];
          });
        }
      }

      this.totalRecords = allWorkSpaces.totalRecords;
      this.loading = false;
      const totalPageCount = Math.round(allWorkSpaces.totalRecords / AppConstant.DEFAULT_PAGE_LIMIT);
      this.setRelationCanonical(this.page, totalPageCount);
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

  resetFilter() {
    const { city, limit } = this.queryParams;
    this.queryParams = { city, limit };
    localStorage.removeItem(AppConstant.LS_COWORKING_FILTER_KEY);
    this.loadWorkSpaces(this.queryParams);
  }

  private recallCoworkingList() {
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

  setSubName() {
    let name = 'Virtual Office in ';
    if (this.title === 'gurugram') {
      name += ' ' + this.capitalize('gurgaon');
    } else {
      name += ' ' + this.capitalize(this.title);
    }
    return name;
  }

  capitalize = str => {
    if (typeof str !== 'string') return '';
    str = str.split(' ');
    for (let i = 0, x = str.length; i < x; i++) {
      str[i] = str[i][0].toUpperCase() + str[i].substr(1);
    }
    return str.join(' ');
  };

  ngOnDestroy() {
    this.configService.setDefaultConfigs();
  }
}
