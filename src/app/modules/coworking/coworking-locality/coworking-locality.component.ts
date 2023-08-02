import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { uniqBy } from 'lodash';
import { generateSlug } from '@app/shared/utils';
import { ENQUIRY_TYPES } from '@app/shared/components/workspace-enquire/workspace-enquire.component';
import { CountryService } from '@app/core/services/country.service';

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
  availableCities: City[] = AVAILABLE_CITY;
  // Pagination
  maxSize = 10;
  totalRecords: number;

  cityWisePopularLocation = [];
  IMAGE_STATIC_ALT = [];
  pageTitle: string;
  breadcrumbs: BreadCrumb[];
  minPrice: any;
  maxPrice: any;
  selectedValue: any = 'Select Price';
  roomType: any;
  ENQUIRY_TYPE: number = ENQUIRY_TYPES.COWORKING;
  selectedOption: any = 'SortBy';
  footerScriptAdded = false;
  activeCountries: any = [];
  inActiveCountries: any = [];

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
    private countryService: CountryService,
  ) {
    this.queryParams = { ...AppConstant.DEFAULT_SEARCH_PARAMS };

    // Init With Map View
    // this.isMapView = true;
  }

  ngOnInit() {
    this.countryService.getCountryList().subscribe(countryList => {
      this.activeCountries = countryList;
    });
    this.minPrice = localStorage.getItem('minPrice');
    this.maxPrice = localStorage.getItem('maxPrice');
    combineLatest(this.activatedRoute.url, this.activatedRoute.queryParams)
      .pipe(map(results => ({ routeParams: results[0], queryParams: results[1] })))
      .subscribe(results => {
        let url = `${results.routeParams[0]}/${results.routeParams[1]}`;
        if (url === 'gurugram/mg-road') {
          this.router.navigateByUrl('coworking/gurugram/mg-road-gurugram');
        }
        const filteredCity = this.availableCities.filter(
          city => city.name.toLowerCase() === this.activatedRoute.snapshot.url[0].path,
        );
        this.title = results.routeParams[0].path;
        this.subTitle = results.routeParams[1].path.replace(/-/g, ' ');
        const prevParam = JSON.parse(localStorage.getItem(AppConstant.LS_COWORKING_FILTER_KEY));
        if (this.minPrice && this.maxPrice) {
          this.queryParams = {
            key: results.routeParams[1].path + '-' + this.title,
            city: filteredCity[0].id,
            minPrice: +this.minPrice,
            maxPrice: +this.maxPrice,
            micro_location: 'enabled',
            ...AppConstant.DEFAULT_SEARCH_PARAMS,
            ...results.queryParams,
            ...prevParam,
          };
        } else {
          this.queryParams = {
            key: results.routeParams[1].path + '-' + this.title,
            city: filteredCity[0].id,
            micro_location: 'enabled',
            ...AppConstant.DEFAULT_SEARCH_PARAMS,
            ...results.queryParams,
            ...prevParam,
          };
        }

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
        this.addSeoTags(results.routeParams[1].path.toLowerCase() + '-' + this.title.toLowerCase());
      });
    if (this.subTitle == 'goregaon') {
      this.setHeaderScript();
    }
  }

  routeToMicro(item) {
    const url = `/coworking/${this.title.toLocaleLowerCase().trim()}/${generateSlug(item)
      .toLowerCase()
      .trim()}`;
    this.router.navigate([url]);
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
    this.apply();
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
  }

  sortByHighLow(sortByLowToHigh) {
    this.loading = true;
    this.selectedOption = sortByLowToHigh;
    if (sortByLowToHigh === 'Low to High') {
      this.workSpaces = this.workSpaces.sort((a, b) => a.starting_price - b.starting_price);
      this.loading = false;
    }
    if (sortByLowToHigh === 'High to Low') {
      this.workSpaces = this.workSpaces.sort((a, b) => b.starting_price - a.starting_price);
      this.loading = false;
    }
  }

  loadWorkSpaces(param: {}) {
    this.loading = true;
    this.workSpaceService.getWorSpacesByAddress(sanitizeParams(param)).subscribe(allWorkSpaces => {
      allWorkSpaces.data = uniqBy(allWorkSpaces.data, 'id');
      this.workSpaces = allWorkSpaces.data;
      this.sortByHighLow(this.selectedOption);
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
