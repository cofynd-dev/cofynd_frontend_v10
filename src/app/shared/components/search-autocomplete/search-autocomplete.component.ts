import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { AVAILABLE_CITY } from '@app/core/config/cities';
import { City } from '@app/core/models/city.model';
import { SearchResult } from '@app/core/models/search-result.model';
import { WorkSpace } from '@app/core/models/workspace.model';
import { CoLivingService } from '@app/modules/co-living/co-living.service';
import { OfficeSpaceService } from '@app/modules/office-space/office-space.service';
import { generateSlug } from '@app/shared/utils';
import { DEFAULT_APP_DATA } from '@core/config/app-data';
import { WorkSpaceService } from '@core/services/workspace.service';
import { forkJoin, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-search-autocomplete',
  templateUrl: './search-autocomplete.component.html',
  styleUrls: ['./search-autocomplete.component.scss'],
})
export class SearchAutocompleteComponent implements OnInit, OnDestroy {
  @ViewChild('hiddenMap', { static: true }) hiddenMap: ElementRef;
  // topLinks = DEFAULT_APP_DATA.footerLinks;
  @Input() placeholder = '';
  @Input() isHomeSearch: boolean;
  @Output() locationSelected: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('search', { static: true }) search: ElementRef;

  private searchSubject: Subject<string> = new Subject();
  showTopSearches: boolean;
  isLoading$: Subject<boolean> = new Subject();
  clearSearch = new Subject();
  searchResult$: Observable<SearchResult>;
  isResultSelected: boolean;
  cities: City[];
  navigationUrl: string;

  constructor(
    private readonly router: Router,
    private readonly workSpaceService: WorkSpaceService,
    private readonly coLivingService: CoLivingService,
    private readonly officeSpaceService: OfficeSpaceService,
    private readonly el: ElementRef,
  ) {}

  ngOnInit() {
    this.searchResult$ = this.searchSubject.pipe(
      debounceTime(250),
      distinctUntilChanged(),
      tap(() => this.isLoading$.next(true)),
      switchMap(keyword => this.combinedApiCall(keyword)),
      tap(() => {
        this.showTopSearches = false;
        this.isResultSelected = false;
        this.isLoading$.next(false);
      }),
    );
  }

  combinedApiCall(keyword): Observable<SearchResult> {
    this.isResultSelected = true;
    return forkJoin([
      this.workSpaceService.searchWorkspaces(keyword),
      this.coLivingService.searchColiving(keyword),
      this.officeSpaceService.searchOffice(keyword),
    ]).pipe(
      map(searchResult => {
        let response: SearchResult = new SearchResult();
        searchResult.map(res => {
          response.data = [...response.data, ...res.data];
        });
        return response;
      }),
    );
  }

  updateSearch(searchTextValue: string) {
    this.searchSubject.next(searchTextValue);
  }

  openList(slug: string) {
    this.clearResult();
    this.locationSelected.emit(true);
    this.router.navigateByUrl(`/search/${slug}`);
  }

  openListing(address: string) {
    this.clearResult();
    this.locationSelected.emit(true);
    this.router.navigateByUrl(`/search/${generateSlug(address)}`);
  }

  openWorkspace(ws: WorkSpace) {
    this.clearResult();
    this.locationSelected.emit(true);
    this.router.navigate([`/${ws.space_type}/${ws.slug}`]);
  }

  clearResult() {
    this.isLoading$.next(false);
    this.showTopSearches = false;
    this.isResultSelected = true;
    if (this.search) {
      this.search.nativeElement.value = '';
    }
  }

  @HostListener('document:click', ['$event'])
  clickOut(event) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.clearResult();
    }
  }

  onTypeChange(menuType: string) {
    if (menuType === 'coworking') {
      this.cities = AVAILABLE_CITY.filter(city => city.for_coWorking === true);
      this.navigationUrl = '/coworking/';
    }
    if (menuType === 'offices') {
      this.cities = AVAILABLE_CITY.filter(city => city.for_office === true);
      this.navigationUrl = '/office-space/rent/';
    }
    if (menuType === 'coliving') {
      this.cities = AVAILABLE_CITY.filter(city => city.for_coLiving === true);
      this.navigationUrl = '/co-living/';
    }
  }

  onCityChange(cityName: string) {
    this.navigationUrl = this.navigationUrl + cityName;
    this.router.navigateByUrl(this.navigationUrl);
  }

  ngOnDestroy() {
    this.searchSubject.unsubscribe();
  }
}
