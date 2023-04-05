import { Component, OnInit, Input } from '@angular/core';
import { AVAILABLE_CITY } from '@app/core/config/cities';
import { City } from '@app/core/models/city.model';

@Component({
  selector: 'app-brand-search-no-result',
  templateUrl: './brand-search-no-result.component.html',
  styleUrls: ['./brand-search-no-result.component.scss']
})
export class BrandSearchNoResultComponent implements OnInit {
  @Input() title: string;
  @Input() url: string;
  @Input() shouldShowContactForm: boolean = false;
  availableCities: City[] = AVAILABLE_CITY;
  @Input() type: string = 'for_office';
  constructor() { }

  ngOnInit() {
  }

}
