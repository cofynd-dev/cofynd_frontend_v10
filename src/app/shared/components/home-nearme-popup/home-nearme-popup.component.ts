import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { MapsAPILoader } from '@core/map-api-loader/maps-api-loader';
import { Router } from '@angular/router';




@Component({
  selector: 'app-home-nearme-popup',
  templateUrl: './home-nearme-popup.component.html',
  styleUrls: ['./home-nearme-popup.component.scss']
})
export class HomeNearmePopupComponent implements OnInit {

  constructor(private mapsAPILoader: MapsAPILoader,
    private router: Router,
    private toastrService: ToastrService,
    private bsModalService: BsModalService,
    private bsModalRef: BsModalRef) { }

  ngOnInit() {
  }

  searchCoworking() {
    this.mapsAPILoader
      .load()
      .then(() => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(position => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            this.router.navigateByUrl(`/search?coworking-latitude=${pos.lat}&longitude=${pos.lng}`);
          });
        } else {
          this.toastrService.error('Your browser does not support this feature');
        }
      })
      .catch(error => console.log(error));
    this.bsModalRef.hide();
  }
  searchColiving() {
    this.mapsAPILoader
      .load()
      .then(() => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(position => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            this.router.navigateByUrl(`/search?coliving-latitude=${pos.lat}&longitude=${pos.lng}`);
          });
        } else {
          this.toastrService.error('Your browser does not support this feature');
        }
      })
      .catch(error => console.log(error));
    this.bsModalRef.hide();
  }
}
