import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
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
import { ViewportScroller } from '@angular/common';
import { generateSlug } from '@app/shared/utils';
import { AuthService } from '@app/core/services/auth.service';
import { ENQUIRY_TYPES } from '@app/shared/components/workspace-enquire/workspace-enquire.component';


declare var $: any;

@Component({
  selector: 'app-coworking-city',
  templateUrl: './coworking-city.component.html',
  styleUrls: ['./coworking-city.component.scss'],
})
export class CoworkingCityComponent implements OnInit, OnDestroy {
  S3_URL = environment.images.S3_URL;
  availableCities: City[] = AVAILABLE_CITY;
  loading = true;
  workSpaces: WorkSpace[];

  queryParams: { [key: string]: string | number };
  count = 0;
  page = 1;
  showLoadMore: boolean;
  loadMoreLoading: boolean;
  seoData: SeoSocialShareData;
  subTitle: string;
  ENQUIRY_TYPE: number = ENQUIRY_TYPES.COWORKING;
  isMapView: boolean = false;
  scrollCount: number;
  title: string;
  isScrolled: boolean;
  isSearchFooterVisible: boolean;

  // Pagination
  maxSize = 5;
  totalRecords: number;

  popularLocation: City[];
  cityWisePopularLocation = ['Near Me'];
  pageTitle: string;
  breadcrumbs: BreadCrumb[];
  IMAGE_STATIC_ALT = [];
  country_name: string = '';
  minPrice: any;
  maxPrice: any;
  selectedValue: any = 'Select Price';
  roomType: any;
  filteredCity: any = [];
  mySubscription: any;
  shouldReloadEnquiryForm: boolean;



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
    private vps: ViewportScroller,
    private authService: AuthService,
  ) {
    this.queryParams = { ...AppConstant.DEFAULT_SEARCH_PARAMS };
    // Init With Map View
    //this.isMapView = true;
    this.mySubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const isLogout = this.authService.getToken() ? false : true;
        if (isLogout) {
          this.shouldReloadEnquiryForm = true;
        } else {
          this.shouldReloadEnquiryForm = false;
        }
      }
    });
  }

  ngOnInit() {
    this.minPrice = localStorage.getItem('minPrice');
    this.maxPrice = localStorage.getItem('maxPrice');
    localStorage.setItem('city_name', this.activatedRoute.snapshot.url[0].path);
    combineLatest(this.activatedRoute.url, this.activatedRoute.queryParams)
      .pipe(map(results => ({ routeParams: results[0], queryParams: results[1] })))
      .subscribe(results => {
        this.title = results.routeParams[0].path;
        this.workSpaceService.getByCityName1(this.title).subscribe((res: any) => {
          this.country_name = res.data.country.name;
          localStorage.setItem('country_name', res.data.country.name);
          localStorage.setItem('country_id', res.data.country.id);
          this.filteredCity = this.availableCities.filter(
            city => city.name.toLowerCase() === this.activatedRoute.snapshot.url[0].path,
          );
          if (!this.filteredCity.length) {
            this.filteredCity.push(res.data);
          }
          this.title = results.routeParams[0].path;
          const prevParam = JSON.parse(localStorage.getItem(AppConstant.LS_COWORKING_FILTER_KEY));
          if (this.minPrice && this.maxPrice) {
            this.queryParams = {
              ...AppConstant.DEFAULT_SEARCH_PARAMS,
              city: this.filteredCity[0].id,
              minPrice: +this.minPrice,
              maxPrice: +this.maxPrice,
              ...results.queryParams,
              ...prevParam,
            };
          } else {
            this.queryParams = {
              ...AppConstant.DEFAULT_SEARCH_PARAMS,
              city: this.filteredCity[0].id,
              ...results.queryParams,
              ...prevParam,
            };
          }
          this.page = results.queryParams['page'] ? +results.queryParams['page'] : 1;

          this.IMAGE_STATIC_ALT.push(
            'Coworking Space in ' + this.subTitle,
            'Coworking Space ' + this.subTitle + ' ' + this.title,
            'Coworking Space near ' + this.subTitle,
            'Shared office Space in ' + this.subTitle,
            'Coworking Office Space in ' + this.subTitle,
          );
          if (results.routeParams[1]) {
            this.subTitle = results.routeParams[1].path.replace(/-/g, ' ');
            this.addSeoTags(results.routeParams[1].path.toLowerCase() + '-' + this.title.toLowerCase());
            if (this.minPrice && this.maxPrice) {
              this.queryParams = {
                ...AppConstant.DEFAULT_SEARCH_PARAMS,
                key: results.routeParams[1].path + '-' + this.title,
                city: this.filteredCity[0].id,
                minPrice: +this.minPrice,
                maxPrice: +this.maxPrice,
                ...results.queryParams,
              };
            } else {
              this.queryParams = {
                ...AppConstant.DEFAULT_SEARCH_PARAMS,
                key: results.routeParams[1].path + '-' + this.title,
                city: this.filteredCity[0].id,
                ...results.queryParams,
              };
            }
          } else {
            this.addSeoTags(this.title.toLowerCase());
          }
          this.createBreadcrumb();
          this.loadWorkSpaces(this.queryParams);
        });
      });

    if (this.title) {
      for (let scrt of script.coworking[this.title]) {
        this.setHeaderScript(scrt);
      }
    }
  }

  routeToMicro(item) {
    const url = `/coworking/${this.title.toLocaleLowerCase().trim()}/${generateSlug(item).toLowerCase().trim()}`
    this.router.navigate([url]);
  }

  getSlug(location: string) {
    return generateSlug(location);
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
        url: 'coworking/' + this.title,
        isActive: false,
      },
      {
        title: this.subTitle,
        url: '',
        isActive: true,
      },
    ];
  }

  onPriceSelect(value) {
    this.selectedValue = value;
    if (value === 'Select Price') {
      this.minPrice = null;
      this.maxPrice = null;
    }
    if (value === 'Less than ₹10,000') {
      this.minPrice = 0;
      this.maxPrice = 10000;
      localStorage.setItem('minPrice', '0');
      localStorage.setItem('maxPrice', '10000');
    }
    if (value === '₹10,000 - ₹20,000') {
      this.minPrice = 10000;
      this.maxPrice = 20000;
      localStorage.setItem('minPrice', '10000');
      localStorage.setItem('maxPrice', '20000');
    }
    if (value === '₹20,000 - ₹30,000') {
      this.minPrice = 20000;
      this.maxPrice = 30000;
      localStorage.setItem('minPrice', '20000');
      localStorage.setItem('maxPrice', '30000');
    }
    if (value === 'More than ₹30,000') {
      this.minPrice = 30000;
      this.maxPrice = 300000;
      localStorage.setItem('minPrice', '30000');
      localStorage.setItem('maxPrice', '300000');
    }
  }

  selectRoomType(value) {
    if (value === this.roomType) {
      this.roomType = null;
    } else {
      this.roomType = value;
    }
  }

  apply() {
    this.queryParams['minPrice'] = this.minPrice;
    this.queryParams['maxPrice'] = this.maxPrice;
    this.queryParams['space_type'] = this.roomType;
    this.loadWorkSpaces(this.queryParams);
    $('#coworking_filters_popup').modal('hide');
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
        const filteredLocations = this.availableCities.filter(city => city.name === this.title);
        if (filteredLocations && filteredLocations.length) {
          this.workSpaceService.microLocationByCityAndSpaceType(this.filteredCity[0].id).subscribe((mlocations: any) => {
            for (let index = 0; index < mlocations.data.length; index++) {
              this.cityWisePopularLocation.push(mlocations.data[index]['name']);
            }
          })
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
    if (this.subTitle) {
      name += this.capitalize(this.subTitle) + ' ' + this.capitalize(this.title);
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

  scrollToElement(element: HTMLElement) {
    element.scrollIntoView({ behavior: 'smooth' });
  }

  ngOnDestroy() {
    this.configService.setDefaultConfigs();
  }
}
