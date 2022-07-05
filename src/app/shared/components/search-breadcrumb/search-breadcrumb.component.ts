import { Component, EventEmitter, HostListener, Input, OnChanges, Output } from '@angular/core';
import { PriceFilter, SizeFilter } from '@core/models/workspace.model';
import { BreadCrumb } from '@core/interface/breadcrumb.interface';
import { AppConstant } from '@app/shared/constants/app.constant';

@Component({
  selector: 'app-search-breadcrumb',
  templateUrl: './search-breadcrumb.component.html',
  styleUrls: ['./search-breadcrumb.component.scss'],
})
export class SearchBreadcrumbComponent implements OnChanges {
  @Input() isPageScrolled: boolean;
  @Input() isOfficeListing: boolean;
  @Input() isPriceFilter = true;
  @Input() isSizeFilter = false;
  @Input() isTypeFilter = false;
  @Input() isSortFilter = false;
  @Input() breadcrumbs: BreadCrumb[];
  @Input() typeFilterName: string = 'Type';
  @Input() breadcumbType: string = 'coworking';
  @Input() priceFilters: any[] = [];
  @Input() resetButton: boolean = true;
  @Input() filter: boolean = false;

  @Output() priceFilterChanged: EventEmitter<PriceFilter> = new EventEmitter<PriceFilter>();
  @Output() sizeFilterChanged: EventEmitter<SizeFilter> = new EventEmitter<SizeFilter>();
  @Output() typeFilterChanged: EventEmitter<SizeFilter> = new EventEmitter<SizeFilter>();
  @Output() sortTypeChanged: EventEmitter<SizeFilter> = new EventEmitter<SizeFilter>();
  @Output() mapViewChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() filterChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() onResetFilter: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() priceFilter: PriceFilter[];
  @Input() sizeFilter: SizeFilter[];
  @Input() typeFilter: any[];
  @Input() sortFilter: any[] = [
    { label: 'Low to High', value: 1 },
    { label: 'High to Low', value: -1 },
  ];

  selectedPriceRange: PriceFilter;
  selectedPriceRanges: any;
  selectedSizeRange: SizeFilter;
  selectedType: any;
  selectedSort: any;
  mobileView: boolean;

  constructor() { }

  @HostListener('window:resize', [])
  onResize() {
    this.detectScreenSize();
  }

  getQueryParam(params) {
    if (!params) {
      return;
    }
    const { officeType, minPrice, maxPrice, minSize, maxSize, sortType } = params;
    if (officeType) {
      this.selectedType = this.typeFilter.find(x => x.value == officeType);
    }
    if (sortType) {
      this.selectedSort = this.sortFilter.find(x => x.value == sortType);
    }
    if (minPrice >= 0 && maxPrice) {
      this.selectedPriceRange = this.priceFilter.find(x => x.minPrice == minPrice && x.maxPrice == maxPrice);
    }
    if (minSize >= 0 && maxSize) {
      this.selectedSizeRange = this.sizeFilter.find(x => x.minSize == minSize && x.maxSize == maxSize);
    }
  }
  removedash(name: string) {
    if (name) {
      return name.replace(/-/, ' ');
    }
  }

  ngAfterViewInit() {
    this.detectScreenSize();
  }

  private detectScreenSize() {
    this.mobileView = window.screen.width < 500;
  }

  ngOnChanges(): void {
    console.log(this.priceFilters);
    this.mobileView = window.screen.width < 500;
    if (!this.priceFilter || !this.priceFilter.length) {
      this.priceFilter = this.getPriceFilter();
    }
    let queryParam = null;
    if (this.breadcumbType === 'office') {
      queryParam = JSON.parse(localStorage.getItem(AppConstant.LS_OFFICE_FILTER_KEY));
    }
    if (this.breadcumbType === 'coworking') {
      queryParam = JSON.parse(localStorage.getItem(AppConstant.LS_COWORKING_FILTER_KEY));
    }
    if (this.breadcumbType === 'coliving') {
      queryParam = JSON.parse(localStorage.getItem(AppConstant.LS_COLIVING_FILTER_KEY));
    }
    this.getQueryParam(queryParam);
  }

  onPriceChange(priceRange: PriceFilter) {
    this.selectedPriceRange = priceRange;
    this.priceFilterChanged.emit(priceRange);
  }

  onSizeChange(sizeRange: SizeFilter) {
    this.selectedSizeRange = sizeRange;
    this.sizeFilterChanged.emit(sizeRange);
  }

  onTypeChange(type) {
    this.selectedType = type;
    this.typeFilterChanged.emit(type);
  }

  onSortChange(type) {
    this.selectedSort = type;
    this.sortTypeChanged.emit(type);
  }
  removeLocalStorage() {
    localStorage.removeItem('minPrice');
    localStorage.removeItem('maxPrice');
    localStorage.removeItem('featuredColiving');
  }

  getPriceFilter(): PriceFilter[] {
    return [
      {
        minPrice: 1000,
        maxPrice: 6000,
        isTitle: true,
        postTitleSign: true,
        preTitle: 'Below',
        postTitle: '6000',
      },
      {
        minPrice: 6000,
        maxPrice: 8000,
        isTitle: false,
      },
      {
        minPrice: 8000,
        maxPrice: 12000,
        isTitle: false,
      },
      {
        minPrice: 12000,
        maxPrice: 15000,
        isTitle: false,
      },
      {
        minPrice: 15000,
        maxPrice: 150000,
        preTitle: '15000',
        postTitle: 'plus',
        isTitle: true,
      },
    ];
  }

  toggleMapView(event) {
    this.mapViewChanged.emit(event.target.checked);
  }
  onChange(data) {
    this.filterChanged.emit(data);
  }

  resetFilter() {
    this.selectedPriceRange = null;
    this.selectedSizeRange = null;
    this.selectedType = null;
    this.selectedSort = null;
    this.onResetFilter.emit(true);
  }
}
