import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CoLivingService } from '@app/modules/co-living/co-living.service';
import { sanitizeParams } from '@app/shared/utils';
import { BreadCrumb } from '@core/interface/breadcrumb.interface';
import { Brand } from '@core/models/brand.model';
import { PriceFilter, WorkSpace } from '@core/models/workspace.model';
import { BrandService } from '@core/services/brand.service';
import { ConfigService } from '@core/services/config.service';
import { SeoService } from '@core/services/seo.service';
import { WorkSpaceService } from '@core/services/workspace.service';
import { environment } from '@env/environment';
import { AppConstant } from '@shared/constants/app.constant';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-brand-coworking',
  templateUrl: './brand-coworking.component.html',
  styleUrls: ['./brand-coworking.component.scss'],
})
export class BrandCoworkingComponent implements OnInit, OnDestroy {
  loading: boolean;
  workSpaces: WorkSpace[];
  brand: Brand;
  brandTitle: string;
  pageTitle: string;
  isColiving: boolean;

  queryParams: { [key: string]: string | number };
  count = 0;
  page = 1;
  showLoadMore: boolean;
  loadMoreLoading: boolean;
  private pageScrollSubject = new Subject();

  isMapView: boolean = false;
  scrollCount: number;
  isScrolled: boolean;
  breadcrumbs: BreadCrumb[];
  footerTitle: string;
  footerDescription: string;
  isSearchFooterVisible: boolean;
  brandSlug: string;
  // Pagination
  maxSize = 10;
  totalRecords: number;
  urlPath: string[] = [];
  selectedCity: string;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private activatedRoute: ActivatedRoute,
    private workSpaceService: WorkSpaceService,
    private coLivingService: CoLivingService,
    private configService: ConfigService,
    private seoService: SeoService,
    private brandService: BrandService,
    private router: Router,
    private el: ElementRef,
  ) {
    this.queryParams = { ...AppConstant.DEFAULT_SEARCH_PARAMS };
    // Init With Map View
    // this.isMapView = true;
    this.urlChangeCall();
  }

  ngOnInit() { }

  createBreadcrumb() {
    if (this.urlPath.length > 1 && !this.isColiving) {
      this.breadcrumbs = [
        {
          title: this.brand.name,
          url: 'brand/' + this.brand.name,
          isActive: false,
        },
        {
          title: this.urlPath[1],
          url: '',
          isActive: true,
        },
      ];
    } else if (this.isColiving) {
      if (this.urlPath.length > 2) {
        this.breadcrumbs = [
          {
            title: this.brand.name,
            url: 'brand/co-living/' + this.brand.name.toLocaleLowerCase(),
            isActive: false,
          },
          {
            title: this.urlPath[2],
            url: '',
            isActive: true,
          },
        ];
      } else {
        this.breadcrumbs = [
          {
            title: this.brand && this.brand.name,
            url: 'brand/co-living',
            isActive: true,
          },
        ];
      }
    } else {
      this.breadcrumbs = [
        {
          title: this.brand.name,
          url: '',
          isActive: true,
        },
      ];
    }
  }

  addSeoTags() {
    this.brandService.getBrands(sanitizeParams({ dropdown: 1 })).subscribe(brands => {
      const selectedBrandSeoMeta = brands.filter(brand => brand.slug === this.brand.slug)[0].seo;
      const seoData = {
        title: selectedBrandSeoMeta.title,
        image: this.brand.image
          ? this.brand.image.s3_link
          : 'https://cofynd.com/assets/images/meta/cofynd-facebook.jpg',
        description: selectedBrandSeoMeta.description,
        url: environment.appUrl + this.router.url,
        type: 'website',
      };
      this.footerDescription = selectedBrandSeoMeta.footer_description;
      this.footerTitle = selectedBrandSeoMeta.footer_title;
      this.seoService.setData(seoData);
    });
  }

  loadWorkSpaceByBrand(slug: string, param: {}) {
    this.loading = true;
    if (this.isColiving) {
      this.coLivingService.getColivingByBrand(slug, sanitizeParams(param)).subscribe(allWorkSpaces => {
        this.setWorkspaceDetail(allWorkSpaces);
        console.log("allWorkSpaces", allWorkSpaces)
      });
    } else {
      this.workSpaceService.getWorkspacesByBrand(slug, sanitizeParams(param)).subscribe(allWorkSpaces => {
        this.setWorkspaceDetail(allWorkSpaces);
      });
    }
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

    this.loadWorkSpaceByBrand(this.brandSlug, this.queryParams);
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

  urlChangeCall() {
    this.activatedRoute.url.subscribe(url => {
      console.log(url, url.length);
      let data = url[url.length - 1].path;
      console.log(data)
      if (url.length > 1 && data == 'colive') {
        this.router.navigate(['/co-living/bangalore']);
        // this.router.navigate['co-living/bangalore']
      } else {
        this.urlPath = url.map(x => x.path);
        let cityName = url.length > 1 ? url[1].path : null;
        if (url[0].path === 'co-living') {
          this.isColiving = true;
          cityName = url.length > 2 ? url[2].path : null;
          const path = this.urlPath[1] || this.urlPath[0];
          this.getBrandCityDetail(path, cityName);
        } else {
          this.getBrandCityDetail(this.urlPath[0], cityName);
        }
        if (cityName) {
          this.addSeoTagsForBrandLocations();
          this.workSpaceService
            .getWorkspacesByBrandAndCity(this.urlPath[0], cityName, sanitizeParams(this.queryParams))
            .subscribe(allWorkSpaces => {
              this.setWorkspaceDetail(allWorkSpaces);
            });
        } else {
          this.getQueryParam();
        }
      }

    });
  }

  addSeoTagsForBrandLocations() {
    const microName = `${this.urlPath[0].toLocaleLowerCase()}-${this.urlPath[1].toLocaleLowerCase()}`;
    this.seoService.getMeta(microName).subscribe(seoMeta => {
      this.pageTitle = null;
      if (seoMeta) {
        this.pageTitle = seoMeta.page_title;
        const seoData = {
          title: seoMeta.title,
          image:
            this.brand && this.brand.image
              ? this.brand && this.brand.image.s3_link
              : 'https://cofynd.com/assets/images/meta/cofynd-facebook.jpg',
          description: seoMeta.description,
          url: environment.appUrl + this.router.url,
          type: 'website',
        };
        this.footerDescription = seoMeta.footer_description;
        this.footerTitle = seoMeta.footer_title;
        this.seoService.setData(seoData);
      }
    });
  }

  getBrandCityDetail(brandName, cityName?) {
    this.brandService.getBrandByName(brandName).subscribe(res => {
      this.brand = res.data;
      if (cityName && this.brand) {
        const city = this.brand.cities.find(x => x.name.toLocaleLowerCase() == cityName.toLocaleLowerCase());
        this.selectedCity = city.id;
      }
    });
  }

  routePageEvent() {
    if (this.isColiving) {
      /** TODO
       * will change it with dynamically
       */
      return `/`;
    }
    return `/brand/${this.urlPath[0]}`;
  }

  getQueryParam() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.queryParams = { ...this.queryParams, ...params };
      if (this.isColiving) {
        this.brandSlug = this.activatedRoute.snapshot.url[1].path;
      } else {
        this.brandSlug = this.activatedRoute.snapshot.url[0].path;
      }
      this.loadWorkSpaceByBrand(this.brandSlug, this.queryParams);
      this.page = params['page'] ? +params['page'] : 1;
    });
  }

  setWorkspaceDetail(allWorkSpaces) {
    this.workSpaces = allWorkSpaces.data;
    console.log("workSpaces", this.workSpaces);
    this.totalRecords = allWorkSpaces.totalRecords;
    if (allWorkSpaces.data.length) {
      this.brand = this.workSpaces[0].brand;
      const IMAGE_STATIC_ALT = [
        this.brand.name + ((this.isColiving && 'Coliving') || 'Coworking'),
        this.brand.name + ((this.isColiving && 'Coliving Space') || 'Coworking Space'),
        this.brand.name + ' Shared Office Space',
        this.brand.name + ' Office Space',
      ];
      this.workSpaces[0].images.map((image, index) => {
        image.image.alt = IMAGE_STATIC_ALT[index];
      });
      if (this.urlPath.length <= 1) {
        this.addSeoTags();
      } else if (this.isColiving && this.urlPath.length <= 2) {
        this.addSeoTags();
      }
    }
    this.createBreadcrumb();
    this.count = allWorkSpaces.data.length;
    if (allWorkSpaces.totalRecords > this.count) {
      this.showLoadMore = true;
    }
    this.loading = false;
  }

  onCityChanged(city) {
    this.selectedCity = city;
  }

  ngOnDestroy() {
    this.configService.setDefaultConfigs();
    this.pageScrollSubject.next();
    this.pageScrollSubject.complete();
  }
}
