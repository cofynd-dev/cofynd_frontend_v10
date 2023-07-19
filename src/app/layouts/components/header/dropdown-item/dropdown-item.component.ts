import { Component, HostListener, Input, OnInit } from '@angular/core';
import { WorkSpaceService } from '@core/services/workspace.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AVAILABLE_CITY } from '@app/core/config/cities';
import { AVAILABLE_CITY_VIRTUAL_OFFICE } from '@app/core/config/cities';

@Component({
  selector: 'app-dropdown-item',
  templateUrl: './dropdown-item.component.html',
  styleUrls: ['./dropdown-item.component.scss'],
})
export class DropdownItemComponent {
  virtualOfficeCities = AVAILABLE_CITY_VIRTUAL_OFFICE.filter(city => city.for_virtualOffice === true);
  cities12: any[] = AVAILABLE_CITY;
  open: boolean = false;
  open1: boolean = false;
  flag: string = '/assets/images/country/india-flag.png';
  @Input() cities: any[];
  @Input() title: string;
  @Input() relativeUrl: string;
  @Input() isSingle: boolean;
  cities1: any;
  country_id: any;
  image_url: string = 'http://localhost:8081/img/';
  countryNameGloble: string;
  constructor(private workSpaceService: WorkSpaceService, private Router: Router) {}

  open_menu(data: any, type: any) {
    if (this.relativeUrl == '/coworking/') {
      this.workSpaceService.getCountry({ for_coWorking: true }).subscribe((res: any) => {
        for (const key in res.data) {
          if (res.data[key].name == 'India' || res.data[key].name == 'india' || res.data[key].name == 'INDIA') {
            res.data[key].flag_image = '/assets/images/country/india-flag.png';
          }
          if (
            res.data[key].name == 'singapore' ||
            res.data[key].name == 'Singapore' ||
            res.data[key].name == 'SINGAPORE'
          ) {
            res.data[key].flag_image = '/assets/images/country/singapore-flag1.jpg';
          }
          if (res.data[key].name == 'Dubai' || res.data[key].name == 'dubai' || res.data[key].name == 'DUBAI') {
            res.data[key].flag_image = '/assets/images/country/dubai-flag.png';
          }
        }
        this.cities = res.data.filter(city => city.for_coWorking === true);
        if (this.cities.length > 6) {
          this.isSingle = false;
        } else {
          this.isSingle = true;
        }
        this.relativeUrl = '/coworking/';
        this.open = !this.open;
        if (data) {
          this.country_id = data._id;
          this.countryNameGloble = data.name;
          this.open1 = !this.open1;
          this.workSpaceService.getCityForCoworking(data._id).subscribe((res: any) => {
            this.cities1 = res.data.filter(city => city.for_coWorking === true);
            if (this.cities1.length > 6) {
              this.isSingle = false;
            } else {
              this.isSingle = true;
            }
          });
        } else {
          this.open1 = false;
        }
      });
    }
    if (this.relativeUrl == '/office-space/rent/') {
      this.open = !this.open;
      this.cities = this.cities12.filter(city => city.for_office === true);
      if (this.cities.length > 6) {
        this.isSingle = false;
      } else {
        this.isSingle = true;
      }
    }
    if (this.relativeUrl == '/virtual-office/') {
      this.workSpaceService.getCityForVirtualOffice('6231ae062a52af3ddaa73a39').subscribe((res: any) => {
        this.virtualOfficeCities = res.data;
        this.open = !this.open;
        this.cities = this.virtualOfficeCities.slice(0, 17);
        if (this.cities.length > 6) {
          this.isSingle = false;
        } else {
          this.isSingle = true;
        }
      });
    }
    if (this.relativeUrl == '/co-living/') {
      this.workSpaceService.getCountry({ for_coLiving: true }).subscribe((res: any) => {
        for (const key in res.data) {
          if (res.data[key].name == 'India' || res.data[key].name == 'india' || res.data[key].name == 'INDIA') {
            res.data[key].flag_image = '/assets/images/country/india-flag.png';
          }
          if (
            res.data[key].name == 'singapore' ||
            res.data[key].name == 'Singapore' ||
            res.data[key].name == 'SINGAPORE'
          ) {
            res.data[key].flag_image = '/assets/images/country/singapore-flag1.jpg';
          }
          if (res.data[key].name == 'Dubai' || res.data[key].name == 'dubai' || res.data[key].name == 'DUBAI') {
            res.data[key].flag_image = '/assets/images/country/dubai-flag.png';
          }
        }
        this.cities = res.data.filter(city => city.for_coLiving === true);
        if (this.cities.length > 6) {
          this.isSingle = false;
        } else {
          this.isSingle = true;
        }
        this.relativeUrl = '/co-living/';
        this.open = !this.open;
        if (data) {
          this.country_id = data._id;
          this.countryNameGloble = data.name;
          this.open1 = !this.open1;
          this.workSpaceService.getCityForColiving(data._id).subscribe((res: any) => {
            this.cities1 = res.data.filter(city => city.for_coLiving === true);
            if (this.cities1.length > 6) {
              this.isSingle = false;
            } else {
              this.isSingle = true;
            }
          });
        } else {
          this.open1 = false;
        }
      });
    }
  }
  viewAllStaticCountry() {
    localStorage.setItem('country_name', this.countryNameGloble);
    localStorage.setItem('country_id', this.country_id);
    this.open = !this.open;
    this.open1 = !this.open1;
    this.Router.navigate([this.relativeUrl]);
  }

  viewAllDynamicCountry() {
    localStorage.setItem('country_name', this.countryNameGloble);
    localStorage.setItem('country_id', this.country_id);
    this.open = !this.open;
    this.open1 = !this.open1;
    if (this.relativeUrl === '/co-living/') {
      this.Router.navigate([`/${this.countryNameGloble.toLowerCase().trim()}/co-living`]);
    }
    if (this.relativeUrl === '/coworking/') {
      this.Router.navigate([`/${this.countryNameGloble.toLowerCase().trim()}/coworking`]);
    }
  }

  @HostListener('document:click', ['$event'])
  clickOut(event) {
    if (this.open1 == true) {
      this.open1 = false;
    }
  }

  closePopUp(url, city) {
    localStorage.setItem('country_name', this.countryNameGloble);
    localStorage.setItem('country_id', this.country_id);
    this.open = false;
    this.open1 = false;
    if (
      this.countryNameGloble === 'india' ||
      this.countryNameGloble === 'India' ||
      this.countryNameGloble === 'INDIA'
    ) {
      this.Router.navigate([url.toLowerCase().trim()]);
    }
    if (
      this.countryNameGloble !== 'india' &&
      this.countryNameGloble !== 'India' &&
      this.countryNameGloble !== 'INDIA' &&
      this.relativeUrl === '/coworking/'
    ) {
      this.Router.navigate([`/${this.countryNameGloble.toLowerCase().trim()}/coworking/${city.toLowerCase().trim()}`]);
    }
    if (
      this.countryNameGloble !== 'india' &&
      this.countryNameGloble !== 'India' &&
      this.countryNameGloble !== 'INDIA' &&
      this.relativeUrl === '/co-living/'
    ) {
      this.Router.navigate([`/${this.countryNameGloble.toLowerCase().trim()}/co-living/${city.toLowerCase().trim()}`]);
    }
  }
  removedash(name: string) {
    return name.replace(/-/, ' ');
  }
}
