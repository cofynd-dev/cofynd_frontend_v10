import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { HttpBackend } from '@angular/common/http';
import { Component, ElementRef, HostListener, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { DEFAULT_APP_DATA } from '@app/core/config/app-data';
import { AuthType } from '@app/core/enum/auth-type.enum';
import { Review } from '@app/core/models/review.model';
import { AuthService } from '@app/core/services/auth.service';
import { HelperService } from '@app/core/services/helper.service';
import { ENQUIRY_TYPES } from '@app/shared/components/workspace-enquire/workspace-enquire.component';
import { VisibilityState } from '@core/enum/visibility-state.enum';
// import { MapsAPILoader } from '@core/map-api-loader/maps-api-loader';
import { SeoSocialShareData } from '@core/models/seo.model';
import { WorkSpace } from '@core/models/workspace.model';
import { SeoService } from '@core/services/seo.service';
import { WorkSpaceService } from '@core/services/workspace.service';
import { environment } from '@env/environment';
import { appAnimations } from '@shared/animations/animation';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import axios from 'axios';
import { icon, latLng, Map, marker, point, polyline, tileLayer, Layer, Control } from 'leaflet';

@Component({
  selector: 'app-work-space',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss'],
  animations: appAnimations,
})
export class WorkSpaceComponent implements OnInit {
  loading = true;
  workspace: WorkSpace;
  activeWorkSpaceId: string;
  rating: number = 3;
  isSticky: boolean;
  stickyElementOffset: number;
  userReview: Review;
  isEnquireModal: boolean;

  //locationIq Map code
  options: any;
  markers: Layer[] = [];

  //Google Map
  @ViewChild('workspaceMap', {
    static: true,
  })
  workspaceMap: ElementRef;
  map: google.maps.Map;
  zoom: number;
  marker: google.maps.Marker;
  infoWindow: google.maps.InfoWindow;
  mapMarkerImage = '/assets/images/marker.png';

  // Sticky Header
  isStickyHeaderVisible = VisibilityState.Hidden;
  visibilityState = VisibilityState;

  shareImageUrl: string;
  ENQUIRY_TYPE: number = ENQUIRY_TYPES.COWORKING;
  shouldReloadEnquiryForm: boolean;
  mySubscription: any;
  supportPhone = DEFAULT_APP_DATA.contact.phone;
  unsubscribe$: Subject<boolean> = new Subject();
  country_name: string;
  isMobileResolution: boolean;
  content: any;
  limit: any = 250;
  isContentToggled: boolean;
  nonEditedContent: string;
  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(DOCUMENT) private document: Document,
    private activatedRoute: ActivatedRoute,
    private workSpaceService: WorkSpaceService,
    // private mapsAPILoader: MapsAPILoader,
    private helperService: HelperService,
    private seoService: SeoService,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
  ) {
    this.workSpaceService
      .getProfileReviewByUser()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(review => {
        if (review) {
          this.userReview = review;
        }
      });
    this.activatedRoute.params.subscribe((param: Params) => {
      if (param && param.workspacename) {
        this.activeWorkSpaceId = param.workspacename;
        this.workSpaceService.getCountryByName(param.country).subscribe((res: any) => {
          if (res && res.data == null) {
            this.router.navigate(['/404'], { skipLocationChange: true });
          }
          localStorage.setItem('country_name', res.data.name);
          localStorage.setItem('country_id', res.data.id);
        });
      }
      if (param && param.id) {
        this.workSpaceService.getCountryByName('India').subscribe((res: any) => {
          if (res && res.data == null) {
            this.router.navigate(['/404'], { skipLocationChange: true });
          }
          localStorage.setItem('country_name', res.data.name);
          localStorage.setItem('country_id', res.data.id);
        });
        this.activeWorkSpaceId = param.id;
      }
      let country = localStorage.getItem('country_name');
      if ((country == 'india' || country == 'India' || country == 'INDIA') && param && param.id) {
        this.activeWorkSpaceId = param.id;
      }
      if (this.activeWorkSpaceId) {
        this.getWorkSpace(this.activeWorkSpaceId);

        this.getAverageRating(this.activeWorkSpaceId);
      }
    });

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
    if (window.innerWidth < 768) {
      this.isMobileResolution = true;
    } else {
      this.isMobileResolution = false;
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize($event: Event): void {
    this.ngOnInit();
    // this.getScreenWidth = window.innerWidth;
    // this.getScreenHeight = window.innerHeight;
  }
  ngAfterViewInit() { }
  addMarker(latitute, longitute) {
    const newMarker = marker([latitute, longitute], {
      icon: icon({
        iconSize: [25, 41],
        iconAnchor: [13, 41],
        iconUrl: 'assets/images/marker-icon.png',
        iconRetinaUrl: 'assets/images/marker-icon.png',
        // shadowUrl: 'assets/images/marker-icon.png1'
      }),
    });
    this.markers.push(newMarker);
  }

  seeMore: boolean = true;
  toggleAboutMore() {
    this.seeMore = !this.seeMore;
  }
  getWorkSpace(workspaceId: string) {
    this.loading = true;
    this.workSpaceService.getWorkspace(workspaceId).subscribe(
      workspaceDetail => {
        this.workspace = workspaceDetail;
        this.country_name = this.workspace.country_dbname;
        if (
          this.workspace.country_dbname === 'india' ||
          this.workspace.country_dbname === 'India' ||
          this.workspace.country_dbname === 'INDIA'
        ) {
          this.router.navigate([`coworking/${this.workspace.slug}`]);
          this.loading = false;
        }
        if (
          this.workspace.country_dbname !== 'india' &&
          this.workspace.country_dbname !== 'India' &&
          this.workspace.country_dbname !== 'INDIA'
        ) {
          this.router.navigate([
            `${this.workspace.country_dbname.toLocaleLowerCase().trim()}/coworking-details/${this.workspace.slug}`,
          ]);
          this.loading = false;
        }
        this.addSeoTags(this.workspace);
        if (workspaceDetail.geometry) {
          // lng , lat from api
          // this.createMap(workspaceDetail.geometry.coordinates[1], workspaceDetail.geometry.coordinates[0]);
          this.options = {
            layers: [
              tileLayer(
                `https://{s}-tiles.locationiq.com/v3/streets/r/{z}/{x}/{y}.png?key=${environment.keys.LOCATIONIQ_MAP}`,
                { maxZoom: 18, attribution: 'Open Street Map' },
              ),
            ],

            zoom: 10,
            attributionControl: false,
            scrollWheelZoom: false,
            dragging: false,
            center: latLng(workspaceDetail.geometry.coordinates[1], workspaceDetail.geometry.coordinates[0]),
          };
          this.addMarker(workspaceDetail.geometry.coordinates[1], workspaceDetail.geometry.coordinates[0]);
        }

        if (workspaceDetail.images.length) {
          this.shareImageUrl = workspaceDetail.images[0].image.s3_link;
        }
        if (this.isAuthenticated()) {
          this.getSpaceReviewByUser();
        }
      },
      error => {
        if (error.status === 404) {
          let city = localStorage.getItem('city_name');
          console.log('city', city);
          if (city == 'co-living') {
            this.router.navigate(['/co-living']);
          } else if (city == 'coworking') {
            this.router.navigate(['/coworking']);
          } else {
            this.router.navigate(['/coworking/' + city]);
          }
          // this.router.navigate(['/404'], { skipLocationChange: true });
        }
      },
    );
  }

  getAverageRating(workspaceId: string) {
    this.workSpaceService.getAverageRating(workspaceId).subscribe(res => {
      this.rating = Math.round(res.average);
    });
  }

  addSeoTags(workspace: WorkSpace) {
    const seoData: SeoSocialShareData = {
      title: workspace.seo.title ? workspace.seo.title : 'CoFynd - ' + workspace.name,
      description: workspace.seo.description ? workspace.seo.description : workspace.description,
      keywords: workspace.seo.keywords ? workspace.seo.keywords : '',
      url: environment.appUrl + '/coworking/' + workspace.slug,
      image: this.shareImageUrl,
      type: 'website',
    };
    this.seoService.setData(seoData);
  }
  routetoCountryPage() {
    if (this.country_name === 'India' || this.country_name === 'india' || this.country_name === 'INDIA') {
      this.router.navigate(['/coworking']);
    } else {
      this.router.navigate([`${this.country_name}/coworking`]);
    }
  }
  // createMap(lat, lng) {
  //   this.mapsAPILoader
  //     .load()
  //     .then(() => {
  //       const mapOrigin = new google.maps.LatLng(lat, lng);
  //       console.log(mapOrigin);
  //       const mapOptions = this.getGoogleMapOptions(mapOrigin);
  //       this.map = new google.maps.Map(this.workspaceMap.nativeElement, mapOptions);
  //       this.setMarker(mapOrigin);
  //     })
  //     .catch(error => console.log(error));
  // }

  createMap1(lat, lng) {
    axios
      .get(
        `https://us1.locationiq.com/v1/reverse.php?key=${environment.keys.LOCATIONIQ_MAP}&lat=${lat}&lon=${lng}&format=json`,
        {},
      )
      .then(function (response) {
        console.log(response);
      });
  }

  setMarker(position: google.maps.LatLng) {
    const infoWindowText = `<div id="map-title"><h4>${this.workspace.name}</h4><p>${this.workspace.location.address1}</p></div>`;

    this.infoWindow = new google.maps.InfoWindow({
      content: infoWindowText,
    });

    this.marker = new google.maps.Marker({
      position,
      map: this.map,
      icon: this.mapMarkerImage,
    });

    this.marker.addListener('click', () => {
      this.infoWindow.open(this.map, this.marker);
    });
  }

  getGoogleMapOptions(center: google.maps.LatLng) {
    return {
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      center,
      zoom: 12,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_RIGHT,
      },
      streetViewControl: false,
      scrollWheel: false,
    };
  }

  openEnquireModal() {
    this.isEnquireModal = true;
    this.helperService.notifyEnquiryFormToAnimate();
  }

  closeEnquireModal() {
    this.isEnquireModal = false;
  }

  @HostListener('document:scroll', ['$event'])
  onWindowScroll(event): void {
    if (isPlatformBrowser(this.platformId) && !this.helperService.getIsMobileMode()) {
      const body = this.document.body;
      const html = this.document.documentElement;

      const documentHeight = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight,
      );

      const scrollFinishOffset = documentHeight - (590 + 800);
      const windowOffsetTop =
        window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
      if (windowOffsetTop >= 500 && windowOffsetTop <= scrollFinishOffset) {
        this.isSticky = true;
        this.isStickyHeaderVisible = VisibilityState.Visible;
      } else {
        this.isSticky = false;
      }

      // For Sticky Header hide do not conflict with footer space
      if (windowOffsetTop <= 500) {
        this.isStickyHeaderVisible = VisibilityState.Hidden;
      }
    }
  }

  isAuthenticated() {
    return this.authService.getToken() ? true : false;
  }

  getSpaceReviewByUser() {
    const userId = this.authService.getLoggedInUser().id;
    this.workSpaceService.getSpaceReviewByUser(userId, this.workspace.id).subscribe(res => {
      this.workSpaceService.setProfileReviewByUser(res);
    });
  }

  openModal(dialogType = AuthType.LOGIN, openAuthDialog = false) {
    if (this.isAuthenticated()) {
      dialogType = AuthType.REVIEW;
    }
    const param = Object.assign({
      space: this.workspace,
      review: new Review(),
      authType: dialogType,
      shouldOpenReviewModal: dialogType === AuthType.LOGIN,
    });
    this.authService.openReviewDialog(param);
  }

  scrollOnRating() {
    document.getElementById('reviewSection').scrollIntoView();
  }

  haftAmenities: boolean = true;
  toggleAmenitiesDiv() {
    this.haftAmenities = !this.haftAmenities;
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}
