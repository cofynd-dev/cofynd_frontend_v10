import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  PriceFilter as PriceFilterData,
  SizeFilter as SizeFilterData,
  TypeFilter,
} from '@app/core/config/office-filter-data';
import { PriceFilter, SizeFilter } from '@app/core/models/workspace.model';
import { sanitizeParams } from '@app/shared/utils';
import { BreadCrumb } from '@core/interface/breadcrumb.interface';
import { City } from '@core/models/city.model';
import { OfficeSpace } from '@core/models/office-space.model';
import { SeoSocialShareData } from '@core/models/seo.model';
import { ConfigService } from '@core/services/config.service';
import { SeoService } from '@core/services/seo.service';
import { environment } from '@env/environment';
import { AppConstant } from '@shared/constants/app.constant';
import { AVAILABLE_CITY } from './../../../core/config/cities';
import { OfficeSpaceService } from './../office-space.service';
import { generateSlug } from '@app/shared/utils';
import { ENQUIRY_TYPES } from '@app/shared/components/workspace-enquire/workspace-enquire.component';
import { WorkSpaceService } from '@app/core/services/workspace.service';

@Component({
  selector: 'app-office-space-city',
  templateUrl: './office-space-city.component.html',
  styleUrls: ['./office-space-city.component.scss'],
})
export class OfficeSpaceCityComponent implements OnInit, OnDestroy {
  availableCities: City[] = AVAILABLE_CITY;
  loading: boolean = true;
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

  // Pagination
  maxSize = 5;
  totalRecords: number;
  pageTitle: string;

  cityWisePopularLocation = [];
  breadcrumbs: BreadCrumb[];
  priceFilter = PriceFilterData;
  sizeFilter = SizeFilterData;
  typeFilter = TypeFilter;
  officeType: string;
  enquiryType: number = ENQUIRY_TYPES.OFFICE;
  minPrice: any;
  maxPrice: any;
  roomType: any;
  filterValue: any;
  selectedValue: any = 'Select Price';
  selectedOption: any = 'SortBy';
  activeCountries: any = [];
  inActiveCountries: any = [];

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
    private workSpaceService: WorkSpaceService,
  ) {
    this.configService.updateConfig({ headerClass: 'search-listing' });
    this.queryParams = { ...AppConstant.DEFAULT_SEARCH_PARAMS };
  }

  ngOnInit() {
    this.getCountries();
    this.officeType = localStorage.getItem('officeType');
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      if (this.activatedRoute.snapshot.url && this.activatedRoute.snapshot.url.length) {
        const filteredCity = this.availableCities.filter(
          city => city.name.toLowerCase() === this.activatedRoute.snapshot.url[0].path,
        );

        this.title = filteredCity[0].name;
        this.createBreadcrumb();
        const prevParam = JSON.parse(localStorage.getItem(AppConstant.LS_OFFICE_FILTER_KEY));
        this.queryParams = {
          ...AppConstant.DEFAULT_SEARCH_PARAMS,
          ...params,
          ...prevParam,
          city: filteredCity[0].id,
        };
        if (this.officeType) {
          this.queryParams = {
            ...AppConstant.DEFAULT_SEARCH_PARAMS,
            ...params,
            ...prevParam,
            city: filteredCity[0].id,
            officeType: this.officeType,
          };
        }
        this.getOfficeList(this.queryParams);
        this.page = params['page'] ? +params['page'] : 1;
        this.addSeoTags(this.title.toLowerCase());
      } else {
        this.title = 'Office Space for rent';
        this.queryParams = { ...AppConstant.DEFAULT_SEARCH_PARAMS, ...params };
        if (this.officeType) {
          this.queryParams = {
            ...AppConstant.DEFAULT_SEARCH_PARAMS,
            ...params,
            officeType: this.officeType,
          };
        }
        this.getOfficeList(this.queryParams);
        this.page = params['page'] ? +params['page'] : 1;
        this.addSeoTags('rent');
      }
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

  setHeaderScript(cityScript) {
    let script = this._renderer2.createElement('script');
    script.type = `application/ld+json`;
    script.text = `${cityScript} `;
    this._renderer2.appendChild(this._document.head, script);
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
        url: this.title,
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
    this.apply();
  }

  apply() {
    this.queryParams['minPrice'] = this.minPrice;
    this.queryParams['maxPrice'] = this.maxPrice;
    this.queryParams['space_type'] = this.roomType;
    this.getOfficeList(this.queryParams);
  }

  getOfficeList(param: {}) {
    this.loading = true;
    this.officeSpaceService.getOffices(sanitizeParams(param)).subscribe(allOffices => {
      this.offices = allOffices.data;
      this.offices.map(
        office =>
          (office.starting_price = office.other_detail.area_for_lease_in_sq_ft * office.other_detail.rent_in_sq_ft),
      );
      this.sortByHighLow(this.selectedOption);
      if (allOffices.data.length) {
        const altCity = this.title === 'gurugram' ? 'gurgaon' : this.title;

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

        const IMAGE_STATIC_ALT = [
          'Office Space in ' + altCity,
          'Best Office Space in ' + altCity,
          'Rented Office Space in ' + altCity,
          'Shared Office Space in ' + altCity,
        ];
        this.offices[0].images.map((image, index) => {
          image.image.alt = IMAGE_STATIC_ALT[index];
        });
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

  routeToMicro(item) {
    const url = `/office-space/rent/${this.title.toLocaleLowerCase().trim()}/${generateSlug(item)
      .toLowerCase()
      .trim()}`;
    this.router.navigate([url]);
  }

  private recallOfficeList() {
    localStorage.setItem(AppConstant.LS_OFFICE_FILTER_KEY, JSON.stringify(this.queryParams));
    this.getOfficeList(this.queryParams);
  }

  resetFilter() {
    const { city, limit } = this.queryParams;
    this.queryParams = { city, limit };
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
    if (this.configService) {
      this.configService.setDefaultConfigs();
    }
  }
}
