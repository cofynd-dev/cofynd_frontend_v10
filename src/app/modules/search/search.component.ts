import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfigService } from '@core/services/config.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, OnDestroy {
  isMapView: boolean;

  constructor(private configService: ConfigService) { }

  ngOnInit(): void {
    // this.configService.updateConfig({ headerClass: 'search-listing' });
  }

  ngOnDestroy(): void {
    this.configService.setDefaultConfigs();
  }
}
