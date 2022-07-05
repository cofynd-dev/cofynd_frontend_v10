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
      if (this.price && this.price == '10,000') {
        localStorage.setItem("minPrice", '0')
        localStorage.setItem("maxPrice", '10000')
      }
      if (this.price && this.price == '20,000') {
        localStorage.setItem("minPrice", '10000')
        localStorage.setItem("maxPrice", '20000')
      }
      if (this.price && this.price == 'above 20,000') {
        localStorage.setItem("minPrice", '20000')
        localStorage.setItem("maxPrice", '200000')
      }
      if (this.price && this.price == 'Inclusive') {
        localStorage.setItem("featuredColiving", 'Inclusive')
      }
      if (this.price && this.price == '625698d3a91948671a4c590b') {
        localStorage.setItem("featuredColiving", '625698d3a91948671a4c590b')
      }
      if (this.price && this.price == '625698e8a91948671a4c590c') {
        localStorage.setItem("featuredColiving", '625698e8a91948671a4c590c')
      }
    })
  }
  removedash(name: string) {
    return name.replace(/-/, ' ')
  }
  closeModal() {
    this.bsModalRef.hide();
  }
}
