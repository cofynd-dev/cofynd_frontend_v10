import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { sanitizeParams } from '@app/shared/utils';
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
import { Location } from '@angular/common';
import { script } from '@app/core/config/script';
import { type } from 'os';
import { stringify } from 'querystring';

@Component({
  selector: 'app-coworking-city',
  templateUrl: './coworking-city.component.html',
  styleUrls: ['./coworking-city.component.scss'],
})
export class CoworkingCityComponent implements OnInit, OnDestroy {
  S3_URL = environment.images.S3_URL;
  availableCities: any = [];
  loading = true;
  workSpaces: WorkSpace[];

  queryParams: { [key: string]: string | number };
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
  maxSize = 10;
  totalRecords: number;

  popularLocation: City[];
  cityWisePopularLocation = [];
  pageTitle: string;
  breadcrumbs: BreadCrumb[];
  IMAGE_STATIC_ALT = [];
  countryNameGloble: any;
  countryId: any;
  country_name: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(DOCUMENT) private _document: Document,
    private _renderer2: Renderer2,
    private activatedRoute: ActivatedRoute,
    private workSpaceService: WorkSpaceService,
    private configService: ConfigService,
    private seoService: SeoService,
    private location: Location,
    private router: Router,
    private el: ElementRef,
  ) {
    this.queryParams = { ...AppConstant.DEFAULT_SEARCH_PARAMS };
    // this.countryNameGloble = this.router.getCurrentNavigation().extras.state.countryName;
    // this.countryId = this.router.getCurrentNavigation().extras.state.countryId;
    // console.log(this.countryId, this.countryNameGloble)
    // Init With Map View
    //this.isMapView = true;
  }

  ngOnInit() {
    combineLatest(this.activatedRoute.url, this.activatedRoute.queryParams)
      .pipe(map(results => ({ routeParams: results[0], queryParams: results[1] })))
      .subscribe(results => {
        this.title = results.routeParams[1].path;
        this.workSpaceService.getByCityName1(this.title).subscribe((res: any) => {
          localStorage.setItem('country_name', res.data.country.name);
          localStorage.setItem('country_id', res.data.country.id);
          this.workSpaceService.getCity(res.data.country.id).subscribe((res: any) => {
            this.availableCities = res.data.filter(city => city.for_coWorking === true);
            const filteredCity = this.availableCities.filter(
              city => city.name.toLowerCase() === this.activatedRoute.snapshot.url[1].path.toLowerCase(), // changes path 0 to 1
            );
            if (filteredCity.length > 0) {
              this.country_name = filteredCity[0]['Country']['name'];
              this.countryId = filteredCity[0]['Country']['id'];
            }

            this.title = results.routeParams[1].path; // changes path 0 to 1
            const prevParam = JSON.parse(localStorage.getItem(AppConstant.LS_COWORKING_FILTER_KEY));
            this.queryParams = {
              ...AppConstant.DEFAULT_SEARCH_PARAMS,
              city: filteredCity[0].id,
              ...results.queryParams,
              ...prevParam,
            };
            this.page = results.queryParams['page'] ? +results.queryParams['page'] : 1;
            this.IMAGE_STATIC_ALT.push(
              'Coworking Space in ' + this.subTitle,
              'Coworking Space ' + this.subTitle + ' ' + this.title,
              'Coworking Space near ' + this.subTitle,
              'Shared office Space in ' + this.subTitle,
              'Coworking Office Space in ' + this.subTitle,
            );
            if (results.routeParams[1] && filteredCity.length > 0) {
              this.subTitle = results.routeParams[1].path.replace(/-/g, ' ');
              this.addSeoTags(results.routeParams[1].path.toLowerCase() + '-' + results.routeParams[0].path.toLowerCase() + '-' + this.country_name.toLowerCase());
              this.queryParams = {
                ...AppConstant.DEFAULT_SEARCH_PARAMS,
                key: results.routeParams[1].path + '-' + this.title,
                city: filteredCity[0].id,
                ...results.queryParams,
              };
            } else {
              this.addSeoTags(this.title.toLowerCase());
            }
            this.createBreadcrumb();
            this.loadWorkSpaces(this.queryParams);
          });
        });
      });

    if (this.title) {
      if (this.title.length > 0) {
        for (let scrt of script.coworking[this.title]) {
          this.setHeaderScript(scrt)
        }
      }
    }
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
      // {
      //   title: this.subTitle,
      //   url: '',
      //   isActive: true,
      // },
    ];
  }

  addSeoTags(city: string) {
    this.seoService.getMeta(city).subscribe(seoMeta => {
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
      } else {
        this.seoData = null;
      }
    });
  }
  removedash(name: string) {
    if (name) {
      return name.replace(/-/, ' ')
    }
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
      this.workSpaces = allWorkSpaces.data.sort((a: any, b: any) => {
        if (b.priority) {
          return a.priority.location.order > b.priority.location.order ? 1 : -1;
        }
      });
      if (allWorkSpaces.data.length) {
        const filteredLocations = this.availableCities.filter(city => city.name.toLowerCase().trim() === this.title.toLowerCase().trim());
        if (filteredLocations && filteredLocations.length) {
          this.cityWisePopularLocation = filteredLocations[0].locations;
        }

        const altCity = this.title === 'gurugram' ? 'gurgaon' : this.title;

        this.workSpaces[0].images.map((image, index) => {
          image.image.alt = this.IMAGE_STATIC_ALT[index];
        });
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
    let name = 'Coworking in ';
    // if (this.subTitle) {
    //   name += this.capitalize(this.subTitle) + ' ' + this.capitalize(this.title);
    // } else {
    name += ' ' + this.capitalize(this.title);
    // }
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
