import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PriceFilter, SizeFilter } from '@app/core/models/workspace.model';
import { sanitizeParams } from '@app/shared/utils';
import { AVAILABLE_CITY } from '@core/config/cities';
import { BreadCrumb } from '@core/interface/breadcrumb.interface';
import { City } from '@core/models/city.model';
import { OfficeSpace } from '@core/models/office-space.model';
import { SeoSocialShareData } from '@core/models/seo.model';
import { ConfigService } from '@core/services/config.service';
import { SeoService } from '@core/services/seo.service';
import { environment } from '@env/environment';
import { AppConstant } from '@shared/constants/app.constant';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { OfficeSpaceService } from '../office-space.service';
import {
  PriceFilter as PriceFilterData,
  SizeFilter as SizeFilterData,
  TypeFilter,
} from '@app/core/config/office-filter-data';
import { generateSlug } from '@app/shared/utils';
import { ENQUIRY_TYPES } from '@app/shared/components/workspace-enquire/workspace-enquire.component';
import { CountryService } from '@app/core/services/country.service';

@Component({
  selector: 'app-office-space-locality',
  templateUrl: './office-space-locality.component.html',
  styleUrls: ['./office-space-locality.component.scss'],
})
export class OfficeSpaceLocalityComponent implements OnInit, OnDestroy {
  availableCities: City[] = AVAILABLE_CITY;
  loading: boolean;
  offices: OfficeSpace[];
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

  cityWisePopularLocation = [];
  IMAGE_STATIC_ALT = [];
  subTitle: string;

  // Pagination
  maxSize = 5;
  totalRecords: number;
  pageTitle: string;

  breadcrumbs: BreadCrumb[];
  enquiryType: number = ENQUIRY_TYPES.OFFICE;

  priceFilter = PriceFilterData;
  sizeFilter = SizeFilterData;
  typeFilter = TypeFilter;
  selectedOption: any = 'SortBy';
  activeCountries: any = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(DOCUMENT) private _document: Document,
    private _renderer2: Renderer2,
    private officeSpaceService: OfficeSpaceService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private configService: ConfigService,
    private seoService: SeoService,
    private el: ElementRef,
    private countryService: CountryService,
  ) {
    this.queryParams = { ...AppConstant.DEFAULT_SEARCH_PARAMS };
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
        this.subTitle = results.routeParams[1].path.replace(/-/g, ' ');
        const prevParam = JSON.parse(localStorage.getItem(AppConstant.LS_OFFICE_FILTER_KEY));
        if (results.routeParams[1].path === 'near-me') {
          this.queryParams = {
            ...AppConstant.DEFAULT_SEARCH_PARAMS,
            key: this.title + '-' + 'india',
            city: filteredCity[0].id,
            micro_location: 'enabled',
            ...results.queryParams,
            ...prevParam,
          };
        } else {
          this.queryParams = {
            ...AppConstant.DEFAULT_SEARCH_PARAMS,
            key: results.routeParams[1].path + '-' + this.title,
            city: filteredCity[0].id,
            micro_location: 'enabled',
            ...results.queryParams,
            ...prevParam,
          };
        }

        this.IMAGE_STATIC_ALT.push(
          'Office Space in ' + this.subTitle,
          'Office Space ' + this.subTitle + ' ' + this.title,
          'Office Space near ' + this.subTitle,
          'Shared office Space in ' + this.subTitle,
          'Office Space for rent in ' + this.subTitle,
        );
        this.createBreadcrumb();
        this.getOfficeList(this.queryParams);
        this.page = results.queryParams['page'] ? +results.queryParams['page'] : 1;
        this.addSeoTags(results.routeParams[1].path.toLowerCase());
      });
  }

  sortByHighLow(sortByLowToHigh) {
    this.loading = true;
    this.selectedOption = sortByLowToHigh;
    if (sortByLowToHigh === 'Low to High') {
      this.offices = this.offices.sort((a, b) => a.starting_price - b.starting_price);
      this.loading = false;
    }
    if (sortByLowToHigh === 'High to Low') {
      this.offices = this.offices.sort((a, b) => b.starting_price - a.starting_price);
      this.loading = false;
    }
  }

  createBreadcrumb() {
    this.breadcrumbs = [
      {
        title: 'office space',
        url: 'office-space/rent',
        isActive: false,
      },
      {
        title: this.title,
        url: 'office-space/rent/' + this.title,
        isActive: false,
      },
      {
        title: this.subTitle,
        url: '',
        isActive: true,
      },
    ];
  }

  getOfficeList(param: {}) {
    this.loading = true;
    this.officeSpaceService.getPopularOffices(sanitizeParams(param)).subscribe((allOffices: any) => {
      this.offices = allOffices.data;
      this.offices.map(
        office =>
          (office.starting_price = office.other_detail.area_for_lease_in_sq_ft * office.other_detail.rent_in_sq_ft),
      );
      this.sortByHighLow(this.selectedOption);
      if (allOffices.data.length) {
        this.offices[0].images.map((image, index) => {
          image.image.alt = this.IMAGE_STATIC_ALT[index];
        });

        const filteredLocations = AVAILABLE_CITY.filter(city => city.name === this.title);
        if (filteredLocations && filteredLocations.length) {
          this.officeSpaceService
            .microLocationByCityAndSpaceType(filteredLocations[0].id)
            .subscribe((mlocations: any) => {
              for (let index = 0; index < mlocations.data.length; index++) {
                this.cityWisePopularLocation.push(mlocations.data[index]['name']);
              }
            });
        }
      }

      this.totalRecords = allOffices.totalRecords;
      this.loading = false;
      const totalPageCount = Math.round(allOffices.totalRecords / AppConstant.DEFAULT_PAGE_LIMIT);
      this.setRelationCanonical(this.page, totalPageCount);
    });
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

  routeToMicro(item) {
    const url = `/office-space/rent/${this.title.toLocaleLowerCase().trim()}/${generateSlug(item)
      .toLowerCase()
      .trim()}`;
    this.router.navigate([url]);
  }

  onFilterSizeChange(sizeRage: SizeFilter) {
    this.count = 0;
    this.page = 1;

    this.queryParams = {
      ...this.queryParams,
      page: this.page,
      minSize: sizeRage.minSize,
      maxSize: sizeRage.maxSize,
    };

    this.recallOfficeList();
  }

  onFilterTypeChange(officeType) {
    this.count = 0;
    this.page = 1;

    this.queryParams = {
      ...this.queryParams,
      page: this.page,
      officeType: officeType.value,
    };

    this.recallOfficeList();
  }

  private recallOfficeList() {
    localStorage.setItem(AppConstant.LS_OFFICE_FILTER_KEY, JSON.stringify(this.queryParams));
    this.getOfficeList(this.queryParams);
  }

  resetFilter() {
    const key = `${this.subTitle.replace(/ /g, '-')}-${this.title}`;
    this.queryParams = { key };
    localStorage.removeItem(AppConstant.LS_OFFICE_FILTER_KEY);
    this.getOfficeList(this.queryParams);
  }

  addSeoTags(city: string) {
    this.seoService.getMeta(city + '-office-space').subscribe(seoMeta => {
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
        if (seoMeta && seoMeta.script) {
          const array = JSON.parse(seoMeta.script);
          for (let scrt of array) {
            scrt = JSON.stringify(scrt);
            this.setHeaderScript(scrt);
          }
        }
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
