import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AVAILABLE_CITY } from '@core/config/cities';
// import { MapsAPILoader } from '@core/map-api-loader/maps-api-loader';
import { City } from '@core/models/city.model';
import { BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { HomeCityPopupComponent } from '@app/shared/components/home-city-popup/home-city-popup.component';
import { HomeNearmePopupComponent } from '@app/shared/components/home-nearme-popup/home-nearme-popup.component';

@Component({
  selector: 'app-home-cities',
  templateUrl: './home-cities.component.html',
  styleUrls: ['./home-cities.component.scss'],
})
export class HomeCitiesComponent {
  // not showing Faridabad city for now
  cities: City[] = AVAILABLE_CITY.filter(city => city.id !== '5fd088bb1be4d8562d3bc9be');

  constructor(
    // private mapsAPILoader: MapsAPILoader,
    private router: Router,
    private toastrService: ToastrService,
    private bsModalService: BsModalService,
  ) { }

  locateMyLocation() {
    this.bsModalService.show(HomeNearmePopupComponent, {
      class: 'modal-dialog-centered',
    });
  }

  openModal(cityData, city) {
    if (cityData.for_coLiving == true && cityData.for_coWorking == true) {
      this.bsModalService.show(HomeCityPopupComponent, {
        class: 'modal-dialog-centered',
        initialState: {
          city,
        },
      });
    }
    if (cityData.for_coWorking == true && cityData.for_coLiving == false) {
      this.router.navigate([`/coworking/${cityData.name}`])
    }
    if (cityData.for_coWorking == false && cityData.for_coLiving == true) {
      this.router.navigate([`/co-living/${cityData.name}`])
    }
  }


}
