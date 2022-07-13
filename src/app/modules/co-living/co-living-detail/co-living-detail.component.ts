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
// import { MapsAPILoader } from '@core/map-api-loader/maps-api-loader';
import { SeoSocialShareData } from '@core/models/seo.model';
import { WorkSpace } from '@core/models/workspace.model';
import { SeoService } from '@core/services/seo.service';
import { environment } from '@env/environment';
import { appAnimations } from '@shared/animations/animation';
import { CoLiving } from './../co-living.model';
import { CoLivingService } from './../co-living.service';
import { icon, latLng, Map, marker, point, polyline, tileLayer, Layer, Control } from 'leaflet';


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
      this.activeWorkSpaceId = param.id;
      if (param.id) {
        this.getWorkSpace(this.activeWorkSpaceId);
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

  ngOnInit() { }

  getWorkSpace(workspaceId: string) {
    this.loading = true;
    this.coLivingService.getCoLiving(workspaceId).subscribe(
      workspaceDetail => {
        this.workspace = workspaceDetail;
        this.workspace.amenties = this.workspace.amenties.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
        this.loading = false;
        this.addSeoTags(this.workspace);
        if (workspaceDetail.geometry) {
          // lng , lat from api
          // this.createMap(workspaceDetail.geometry.coordinates[1], workspaceDetail.geometry.coordinates[0]);
          this.options = {
            layers: [
              tileLayer(`https://{s}-tiles.locationiq.com/v3/streets/r/{z}/{x}/{y}.png?key=${environment.keys.LOCATIONIQ_MAP}`, { maxZoom: 18, attribution: 'Open Cofynd Map' })
            ],
            attributionControl: false,
            zoom: 10,
            center: latLng(workspaceDetail.geometry.coordinates[1], workspaceDetail.geometry.coordinates[0])
          }
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

  // createMap(lat, lng) {
  //   this.mapsAPILoader
  //     .load()
  //     .then(() => {
  //       const mapOrigin = new google.maps.LatLng(lat, lng);
  //       const mapOptions = this.getGoogleMapOptions(mapOrigin);
  //       this.map = new google.maps.Map(this.workspaceMap.nativeElement, mapOptions);
  //       this.setMarker(mapOrigin);
  //     })
  //     .catch(error => console.log(error));
  // }

  addMarker(latitute, longitute) {
    const newMarker = marker(
      [latitute, longitute],
      {
        icon: icon({
          iconSize: [25, 41],
          iconAnchor: [13, 41],
          iconUrl: 'assets/images/marker-icon.png',
          iconRetinaUrl: 'assets/images/marker-icon.png',
          // shadowUrl: 'assets/images/marker-icon.png1'
        })
      }
    );
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
