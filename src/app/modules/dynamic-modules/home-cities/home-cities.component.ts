import { ChangeDetectorRef, Component, Input, OnInit, ViewRef } from '@angular/core';
import { Router } from '@angular/router';
// import { MapsAPILoader } from '@core/map-api-loader/maps-api-loader';
import { City } from '@core/models/city.model';
import { BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { WorkSpaceService } from '@app/core/services/workspace.service';
import { HomeCityPopupComponent } from '../home-city-popup/home-city-popup.component';

@Component({
  selector: 'app-home-cities',
  templateUrl: './home-cities.component.html',
  styleUrls: ['./home-cities.component.scss'],
})
export class HomeCitiesComponent implements OnInit {
  // not showing Faridabad city for now
  countryCities: City[] = [];
  title: string;
  // newarray: ['sachin', 'chandan']
  constructor(
    // private mapsAPILoader: MapsAPILoader,
    private router: Router,
    private toastrService: ToastrService,
    private bsModalService: BsModalService,
    private cdr: ChangeDetectorRef,
    private workSpaceService: WorkSpaceService,
  ) {
    // this.router.routeReuseStrategy.shouldReuseRoute = function () {
    //   return false;
    // };
    var someString = this.router.url;
    someString = someString.replace(/\//g, '');
    this.title = someString
  }

  ngOnInit(): void {
    this.getCities();
  }

  getCities() {
    this.workSpaceService.getCountryByName(this.title).subscribe((res: any) => {
      localStorage.setItem('country_name', res.data.name);
      localStorage.setItem('country_id', res.data.id);
      this.workSpaceService.getCity(res.data.id).subscribe((res: any) => {
        this.countryCities = res.data.filter(city => city.for_coWorking === true);
      })
    })
  }

  locateMyLocation() {
    // this.mapsAPILoader
    //   .load()
    //   .then(() => {
    //     if (navigator.geolocation) {
    //       navigator.geolocation.getCurrentPosition(position => {
    //         const pos = {
    //           lat: position.coords.latitude,
    //           lng: position.coords.longitude,
    //         };
    //         this.router.navigateByUrl(`/search?latitude=${pos.lat}&longitude=${pos.lng}`);
    //       });
    //     } else {
    //       this.toastrService.error('Your browser does not support this feature');
    //     }
    //   })
    //   .catch(error => console.log(error));
  }
  removedash(name: string) {
    return name.replace(/-/, ' ')
  }
  openModal(city, country) {
    this.bsModalService.show(HomeCityPopupComponent, {
      class: 'modal-dialog-centered',
      initialState: {
        city,
        country
      },
    });
  }

  // ngAfterViewInit() {
  //   if (!(this.cdr as any).destroyed) {
  //     this.cdr.detectChanges();
  //   }
  // }
}
