import { Component, OnInit } from '@angular/core';
import { icon, latLng, Map, marker, point, polyline, tileLayer, Layer } from 'leaflet';


@Component({
  selector: 'app-location-iq-import',
  templateUrl: './location-iq-import.component.html',
  styleUrls: ['./location-iq-import.component.scss']
})
export class LocationIqImportComponent implements OnInit {
  options = {
    layers: [
      tileLayer('https://{s}-tiles.locationiq.com/v3/streets/r/{z}/{x}/{y}.png?key=${environment.keys.LOCATIONIQ_MAP}', { maxZoom: 18, attribution: '...' })
    ],
    zoom: 7,
    attributionControl: false,
    dragging: false,
    center: latLng(28.6326204, 77.22187869999999)
  };

  markers: Layer[] = [];

  constructor() { }

  ngOnInit() {
    this.addMarker();
  }

  addMarker() {
    const newMarker = marker(
      [28.6326204, 77.22187869999999],
      {
        icon: icon({
          iconSize: [25, 41],
          iconAnchor: [13, 41],
          iconUrl: 'assets/images/marker-icon.png',
          iconRetinaUrl: 'assets/images/marker-icon.png',
          shadowUrl: 'assets/images/marker-icon.png1'
        })
      }
    );
    this.markers.push(newMarker);
  }

}
