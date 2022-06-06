import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { WorkSpaceService } from '@core/services/workspace.service';
import { City } from '@app/core/models/city.model';




@Component({
  selector: 'app-curated-city-popup',
  templateUrl: './curated-city-popup.component.html',
  styleUrls: ['./curated-city-popup.component.scss']
})
export class CuratedCityPopupComponent implements OnInit {
  cities: City[];
  price: string;

  constructor(private bsModalRef: BsModalRef,
    private workSpaceService: WorkSpaceService,
  ) {
  }

  ngOnInit() {
    this.workSpaceService.getCity("6231ae062a52af3ddaa73a39").subscribe((res: any) => {
      this.cities = res.data.filter(city => city.for_coWorking === true);
      console.log(this.price);
    })
  }
  removedash(name: string) {
    return name.replace(/-/, ' ')
  }
  closeModal() {
    this.bsModalRef.hide();
  }
}
