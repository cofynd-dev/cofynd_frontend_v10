import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  HostListener,
  Inject,
  PLATFORM_ID,
  Output,
  EventEmitter,
} from '@angular/core';
import { Router } from '@angular/router';
import { MapsAPILoader } from '@core/map-api-loader/maps-api-loader';
import { WorkSpace } from '@core/models/workspace.model';

@Component({
  selector: 'app-search-map-view',
  templateUrl: './search-map-view.component.html',
  styleUrls: ['./search-map-view.component.scss'],
})
export class SearchMapViewComponent implements OnInit {
  @Input() workspaces: WorkSpace[];
  @Input() spaceType: string = 'coworking';
  @Output() pageScrollEvent: EventEmitter<{ scroll: boolean; count: number }> = new EventEmitter<{
    scroll: boolean;
    count: number;
  }>();
  // Map
  @ViewChild('nearbyMap', { static: true }) nearbyMap: ElementRef;
  map: google.maps.Map;
  zoom: number;
  marker: google.maps.Marker;
  markers: google.maps.Marker[] = [];
  placeService: google.maps.places.PlacesService;
  infoWindow: google.maps.InfoWindow;
  bounds: google.maps.LatLngBounds;
  mapOptions: google.maps.MapOptions;

  boxScroll: string;
  isSticky: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private mapsAPILoader: MapsAPILoader,
    private router: Router,
  ) { }

  ngOnInit() {
    console.log("><<<<<<<<<<<<<??????????????", this.workspaces);

    if (this.workspaces && this.workspaces.length) {
      this.addMap(this.workspaces);
    }
  }

  addMap(workspaces: WorkSpace[]) {
    this.mapsAPILoader
      .load()
      .then(() => {
        const mapOrigin = new google.maps.LatLng(
          workspaces[0].geometry.coordinates[1],
          workspaces[0].geometry.coordinates[0],
        );
        const mapOptions = this.getGoogleMapOptions(mapOrigin);
        this.map = new google.maps.Map(this.nearbyMap.nativeElement, mapOptions);
        this.bounds = new google.maps.LatLngBounds();
        this.infoWindow = new google.maps.InfoWindow();

        for (const workspace of workspaces) {
          this.createLocationMarkers(workspace);
        }

        // this.getCircleRadius(workspaces);

        this.map.fitBounds(this.bounds);
      })
      .catch(error => console.log(error));
  }

  createLocationMarkers(workspace: WorkSpace) {
    const price = workspace.starting_price ? workspace.starting_price.toString() : '0';
    const markerPosition = new google.maps.LatLng(workspace.geometry.coordinates[1], workspace.geometry.coordinates[0]);

    const markerIcon = {
      url: '/assets/images/map-marker.svg',
      size: new google.maps.Size(40, 40),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(0, 40),
      scaledSize: new google.maps.Size(40, 40),
    };
    const placeMarker = new google.maps.Marker({
      position: markerPosition,
      map: this.map,
      icon: markerIcon,
    });

    placeMarker.addListener('click', event => {
      this.router.navigate([`/${this.spaceType}/${workspace.slug}`]);
    });

    // Add Markers
    this.markers.push(placeMarker);

    // Fit To Bounds
    this.bounds.extend(markerPosition);

    // Display Info
    const workspaceName = '<h4>' + workspace.name + '</h4>';
    const workspacePrice = '<span class="price-on-map"><i class="icon-rupee"></i>' + price + '</span>';
    const workspaceImage = workspace.images[0] ? workspace.images[0].image.s3_link : '/assets/images/no-img.svg';
    const workspaceImageDiv =
      '<a href="/coworking/' +
      workspace.slug +
      '" target="_blank"><div class="map-img">' +
      workspacePrice +
      '<img src="' +
      workspaceImage +
      '" /></div>' +
      workspaceName +
      '</a>';
    const workspaceAddress =
      ('<p>' + workspace.location.address1 && workspace.location.address1) || workspace.location.address + '</p>';
    const contentString = '<div class="map-infoWindow">' + workspaceImageDiv + workspaceAddress + '</div>';
    google.maps.event.addListener(placeMarker, 'mouseover', () => {
      this.infoWindow.setContent(contentString);
      this.infoWindow.open(this.map, placeMarker);
    });
    google.maps.event.addListener(placeMarker, 'mouseout', () => {
      this.infoWindow.close();
    });
  }

  getGoogleMapOptions(center: google.maps.LatLng) {
    return {
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      center,
      zoom: 15,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_RIGHT,
      },
      streetViewControl: false,
      scrollWheel: false,
    };
  }

  getCircleRadius(workspaces) {
    const searchArea = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.5,
      strokeWeight: 0.4,
      fillColor: '#4343e8',
      fillOpacity: 0.4,
      map: this.map,
      center: new google.maps.LatLng(workspaces[0].geometry.coordinates[1], workspaces[0].geometry.coordinates[0]),
      radius: 20000,
    });

    const searchAreaMarker = new google.maps.Marker({
      position: new google.maps.LatLng(workspaces[0].geometry.coordinates[1], workspaces[0].geometry.coordinates[0]),
      map: this.map,
      draggable: true,
      animation: google.maps.Animation.DROP,
      title: 'searchAreaMarker',
    });

    google.maps.event.addListener(searchAreaMarker, 'dragend', function (e) {
      searchArea.setOptions({
        center: e.latLng,
      });
    });
  }

  @HostListener('window:scroll', ['$event'])
  onScrollPage($event): void {
    if (isPlatformBrowser(this.platformId)) {
      // // TODO: Make it dynamic
      const offsetTop = 80;
      const currPos = window.pageYOffset;
      if (currPos >= offsetTop) {
        this.pageScrollEvent.emit({ scroll: true, count: 80 });
      } else {
        this.pageScrollEvent.emit({ scroll: false, count: currPos });
      }
      // const endBlockHeight = document.getElementById('endBlock').clientHeight;
      // const endBlockId = document.getElementById('endBlock');
      // const contentHeight = document.getElementById('vehicleInformationBox').clientHeight;
      // if (endBlockId) {
      //   const endBlock = endBlockId.offsetTop + endBlockHeight - contentHeight - 105;
      //   const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      //   const topOffset = 40;
      //   if (scrollPosition > endBlock) {
      //     this.boxScroll = -(scrollPosition - endBlock) + 'px';
      //     this.isSticky = false;
      //   } else {
      //     this.boxScroll = 0 + 'px';
      //     this.isSticky = true;
      //   }
      //   if (scrollPosition > topOffset) {
      //     this.isSticky = true;
      //   } else {
      //     this.isSticky = false;
      //   }
      // }
    }
  }
}
