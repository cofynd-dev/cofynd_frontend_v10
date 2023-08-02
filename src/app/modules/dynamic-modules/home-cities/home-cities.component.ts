import { ChangeDetectorRef, Component, Input, OnInit, ViewRef } from '@angular/core';
import { Router } from '@angular/router';
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
  countryCities: City[] = [];
  title: string;
  constructor(
    private router: Router,
    private toastrService: ToastrService,
    private bsModalService: BsModalService,
    private cdr: ChangeDetectorRef,
    private workSpaceService: WorkSpaceService,
  ) {
    var someString = this.router.url;
    someString = someString.replace(/\//g, '');
    this.title = someString;
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
      });
    });
  }

  removedash(name: string) {
    return name.replace(/-/, ' ');
  }

  openModal(city, country) {
    this.bsModalService.show(HomeCityPopupComponent, {
      class: 'modal-dialog-centered',
      initialState: {
        city,
        country,
      },
    });
  }
}
