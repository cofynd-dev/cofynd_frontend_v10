import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  Component,
  Output,
  EventEmitter,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { DEFAULT_APP_DATA } from '@app/core/config/app-data';
import { AuthService } from '@app/core/services/auth.service';
import { HelperService } from '@app/core/services/helper.service';
import { ENQUIRY_TYPES } from '@app/shared/components/workspace-enquire/workspace-enquire.component';
import { VisibilityState } from '@core/enum/visibility-state.enum';
import { SeoSocialShareData } from '@core/models/seo.model';
import { WorkSpace } from '@core/models/workspace.model';
import { SeoService } from '@core/services/seo.service';
import { environment } from '@env/environment';
import { appAnimations } from '@shared/animations/animation';
import { CoLiving } from '../../co-living/co-living.model';
import { CoLivingService } from '../../co-living/co-living.service';
import { icon, latLng, marker, tileLayer, Layer } from 'leaflet';
import { Review } from '@app/core/models/review.model';
import { AuthType } from '@app/core/enum/auth-type.enum';

@Component({
  selector: 'app-co-living-detail',
  templateUrl: './co-living-detail.component.html',
  styleUrls: ['./co-living-detail.component.scss'],
  animations: appAnimations,
})
export class CoLivingDetailComponent implements OnInit {
  @Output() enquireButtonClick: EventEmitter<boolean> = new EventEmitter<boolean>();
  loading = true;
  workspace: CoLiving;
  activeWorkSpaceId: string;
  isSticky: boolean;
  stickyElementOffset: number;

  isEnquireModal: boolean;
  shouldReloadEnquiryForm: boolean;
  rating: number = 0;
  userReview: Review;
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
  enquiryType: number = ENQUIRY_TYPES.COLIVING;
  mySubscription: any;
  supportPhone = DEFAULT_APP_DATA.contact.phone;
  country_name: string;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(DOCUMENT) private document: Document,
    private activatedRoute: ActivatedRoute,
    private coLivingService: CoLivingService,
    // private mapsAPILoader: MapsAPILoader,
    private helperService: HelperService,
    private seoService: SeoService,
    private router: Router,
    private authService: AuthService,
  ) {
    this.activatedRoute.params.subscribe((param: Params) => {
      if (param && param.workspacename) {
        this.activeWorkSpaceId = param.workspacename;
      }
      if (param && param.id) {
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

  ngOnInit() {}

  getWorkSpace(workspaceId: string) {
    this.loading = true;
    this.coLivingService.getCoLiving(workspaceId).subscribe(
      workspaceDetail => {
        this.workspace = workspaceDetail;
        this.country_name = this.workspace.country_dbname;
        this.workspace.amenties = this.workspace.amenties.filter((amenty: any) => amenty.for_coLiving === true);
        this.workspace.amenties = this.workspace.amenties.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
        this.loading = false;
        this.addSeoTags(this.workspace);
        if (workspaceDetail.geometry) {
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
            dragging: true,
            center: latLng(workspaceDetail.geometry.coordinates[1], workspaceDetail.geometry.coordinates[0]),
          };
          this.addMarker(workspaceDetail.geometry.coordinates[1], workspaceDetail.geometry.coordinates[0]);
        }

        if (workspaceDetail.images.length) {
          this.shareImageUrl = workspaceDetail.images[0].image.s3_link;
        }
      },
      error => {
        if (error.status === 404) {
          this.router.navigate(['/404'], { skipLocationChange: true });
        }
      },
    );
  }

  routetoCountryPage() {
    if (this.country_name === 'India' || this.country_name === 'india' || this.country_name === 'INDIA') {
      this.router.navigate(['/coworking']);
    } else {
      this.router.navigate([`${this.country_name}/co-living`]);
    }
  }
  isAuthenticated() {
    return this.authService.getToken() ? true : false;
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
  getAverageRating(workspaceId: string) {
    this.coLivingService.getAverageRating(workspaceId).subscribe(res => {
      this.rating = Math.round(res.average);
    });
  }
  scrollOnRating() {
    document.getElementById('reviewSection').scrollIntoView();
  }
  addSeoTags(workspace: WorkSpace) {
    const seoData: SeoSocialShareData = {
      title: workspace.seo.title ? workspace.seo.title : 'CoFynd - ' + workspace.name,
      description: workspace.seo.description ? workspace.seo.description : workspace.description,
      keywords: workspace.seo.keywords ? workspace.seo.keywords : '',
      url: environment.appUrl + '/co-living/' + workspace.slug,
      image: this.shareImageUrl,
      type: 'website',
    };
    this.seoService.setData(seoData);
  }

  addMarker(latitute, longitute) {
    const newMarker = marker([latitute, longitute], {
      icon: icon({
        iconSize: [25, 41],
        iconAnchor: [13, 41],
        iconUrl: 'assets/images/marker-icon.png',
        iconRetinaUrl: 'assets/images/marker-icon.png',
      }),
    });
    this.markers.push(newMarker);
  }

  setMarker(position: google.maps.LatLng) {
    const infoWindowText = `<div id="map-title"><h4>${this.workspace.other_detail.building_name}</h4><p>${this.workspace.location.address}</p></div>`;

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

  checkAmenityIsAvailable(facility: string) {
    const availableFacility = this.workspace.amenties.map(amenity => amenity.name);
    return availableFacility.includes(facility);
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

  onEnquire() {
    this.helperService.notifyEnquiryFormToAnimate();
    this.enquireButtonClick.emit(true);
  }

  removeSpecialCharacter(text: string) {
    return text.replace('-', ' ');
  }

  addSpecialCharacter(text: string) {
    if (text == 'Veg & Non-Veg') {
      return 'veg-non-veg';
    }
    if (text == 'Netflix/Amazon') {
      return 'ott-subscription';
    }
    return text
      .toLocaleLowerCase()
      .split(' ')
      .join('-');
  }

  scrollOnMap(scrollId: any) {
    document.getElementById(scrollId).scrollIntoView();
  }
  haftAmenities: boolean = true;
  toggleAmenitiesDiv() {
    this.haftAmenities = !this.haftAmenities;
  }

  seeMore: boolean = true;
  toggleAboutMore() {
    this.seeMore = !this.seeMore;
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }
}
