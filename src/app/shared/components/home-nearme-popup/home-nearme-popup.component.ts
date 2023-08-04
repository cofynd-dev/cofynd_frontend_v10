import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { Observable, Subscriber } from 'rxjs';

@Component({
  selector: 'app-home-nearme-popup',
  templateUrl: './home-nearme-popup.component.html',
  styleUrls: ['./home-nearme-popup.component.scss'],
})
export class HomeNearmePopupComponent implements OnInit {
  constructor(private router: Router, private bsModalRef: BsModalRef) {}

  ngOnInit() {}

  getCurrentPosition(): any {
    return new Observable((observer: Subscriber<any>) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position: any) => {
          observer.next({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          observer.complete();
        });
      } else {
        observer.error();
      }
    });
  }

  searchCoworking() {
    this.getCurrentPosition().subscribe((position: any) => {
      this.router.navigateByUrl(`/search?coworking-latitude=${position.latitude}&longitude=${position.longitude}`);
      this.bsModalRef.hide();
    });
  }

  searchColiving() {
    this.getCurrentPosition().subscribe((position: any) => {
      this.router.navigateByUrl(`/search?coliving-latitude=${position.latitude}&longitude=${position.longitude}`);
      this.bsModalRef.hide();
    });
  }
}
