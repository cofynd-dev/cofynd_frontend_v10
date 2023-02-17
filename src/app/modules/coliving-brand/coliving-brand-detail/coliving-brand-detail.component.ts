import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CoLivingService } from '@app/modules/co-living/co-living.service';
import { ENQUIRY_TYPES } from '@app/shared/components/workspace-enquire/workspace-enquire.component';
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
  selector: 'app-coliving-brand-detail',
  templateUrl: './coliving-brand-detail.component.html',
  styleUrls: ['./coliving-brand-detail.component.scss']
})
export class ColivingBrandDetailComponent implements OnInit {
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
  enquiryType: number = ENQUIRY_TYPES.COLIVING;


  constructor(@Inject(PLATFORM_ID) private platformId: any,
    private activatedRoute: ActivatedRoute,
    private workSpaceService: WorkSpaceService,
    private coLivingService: CoLivingService,
    private configService: ConfigService,
    private seoService: SeoService,
    private brandService: BrandService,
    private router: Router,
    private el: ElementRef,) {
    this.queryParams = { ...AppConstant.DEFAULT_SEARCH_PARAMS };
  }

  ngOnInit() {
    this.getQueryParam();
  }

  getQueryParam() {
    this.isColiving = true;
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.queryParams = { ...this.queryParams, ...params };
      if (this.isColiving) {
        this.brandSlug = this.activatedRoute.snapshot.url[0].path;
      }
      this.loadWorkSpaceByBrand(this.brandSlug, this.queryParams);
      this.page = params['page'] ? +params['page'] : 1;
    });
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

  loadWorkSpaceByBrand(slug: string, param: {}) {
    this.loading = true;
    if (this.isColiving) {
      this.coLivingService.getColivingByBrand(slug, sanitizeParams(param)).subscribe(allWorkSpaces => {
        this.setWorkspaceDetail(allWorkSpaces);
      });
    }
  }

  setWorkspaceDetail(allWorkSpaces) {
    this.workSpaces = allWorkSpaces.data;
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

  ngOnDestroy() {
    this.configService.setDefaultConfigs();
    this.pageScrollSubject.next();
    this.pageScrollSubject.complete();
  }

}
