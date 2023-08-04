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
// import { MapsAPILoader } from '@core/map-api-loader/maps-api-loader';
import { WorkSpace } from '@core/models/workspace.model';
import { icon, latLng, marker, tileLayer, Layer } from 'leaflet';
import { environment } from '@env/environment';
import * as L from 'leaflet';

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
  // map: google.maps.Map;
  // zoom: number;
  // marker: google.maps.Marker;
  // // markers: google.maps.Marker[] = [];
  // placeService: google.maps.places.PlacesService;
  // infoWindow: google.maps.InfoWindow;
  // bounds: google.maps.LatLngBounds;
  // mapOptions: google.maps.MapOptions;

  // boxScroll: string;
  // isSticky: boolean;
  //locationIq Map code
  options: any;
  markers: Layer[] = [];
  map: L.Map;
  newMarker: any;
  type: string;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    // private mapsAPILoader: MapsAPILoader,
    private router: Router,
  ) {}

  ngOnInit() {
    if (this.workspaces && this.workspaces.length) {
      this.addLocationIqMap(this.workspaces, this.spaceType);
    }
    this.type = this.spaceType;
  }

  addLocationIqMap(workspaces: WorkSpace[], spaceType) {
    this.options = {
      layers: [
        tileLayer(
          `https://{s}-tiles.locationiq.com/v3/streets/r/{z}/{x}/{y}.png?key=${environment.keys.LOCATIONIQ_MAP}`,
          { maxZoom: 18, attribution: 'Open Street Map' },
        ),
      ],
      zoom: 12,
      attributionControl: false,
      dragging: true,
      center: latLng(workspaces[0].geometry.coordinates[1], workspaces[0].geometry.coordinates[0]),
    };
    for (const workspace of workspaces) {
      this.createLocationMarkersLocationIQ(workspace, spaceType);
    }
  }

  createLocationMarkersLocationIQ(workspace: WorkSpace, spaceType) {
    this.newMarker = marker([workspace.geometry.coordinates[1], workspace.geometry.coordinates[0]], {
      title: workspace.slug,
      icon: icon({
        iconSize: [25, 41],
        iconAnchor: [13, 41],
        iconUrl: 'assets/images/marker-icon.png',
        iconRetinaUrl: 'assets/images/marker-icon.png',
        // shadowUrl: 'assets/images/marker-icon.png'
      }),
    });
    this.newMarker.on('click', function() {
      if (
        workspace.country_dbname &&
        workspace.country_dbname !== 'india' &&
        workspace.country_dbname !== 'India' &&
        workspace.country_dbname !== 'INDIA'
      ) {
        window.open(`/${workspace.country_dbname}/${spaceType}-details/${workspace.slug}`);
      } else {
        window.open(`/${spaceType}/${workspace.slug}`);
      }
    });
    this.markers.push(this.newMarker);
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
    }
  }
}
