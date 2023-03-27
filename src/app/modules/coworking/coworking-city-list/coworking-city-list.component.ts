import { Component } from '@angular/core';
import { City } from '@core/models/city.model';
import { AVAILABLE_CITY } from '@core/config/cities';

@Component({
  selector: 'app-coworking-city-list',
  templateUrl: './coworking-city-list.component.html',
  styleUrls: ['./coworking-city-list.component.scss'],
})
export class CoworkingCityListComponent {
  cities: City[] = AVAILABLE_CITY;
}
