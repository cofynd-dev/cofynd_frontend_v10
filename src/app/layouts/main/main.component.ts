import { Component, OnDestroy } from '@angular/core';
import { DEFAULT_APP_DATA } from '@core/config/app-data';
import { AppConfig } from '@core/interface/config.interface';
import { Subscription } from 'rxjs';
import { ConfigService } from '@core/services/config.service';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnDestroy {
  phone = DEFAULT_APP_DATA.contact.phone;
  phoneflag: boolean = true;
  /**
   * On layout settings changed handler
   */
  onConfigChanged: Subscription;

  /**
   * Current configuration object
   */
  appConfig: AppConfig;
  constructor(private router: Router, public configService: ConfigService) {
    // Subscribe to all the settings change events
    this.onConfigChanged = this.configService.onAppConfigChanged.subscribe(
      (config: AppConfig) => (this.appConfig = config),
    );
    console.log("main called1", router.url.search(/co-living/i));
    if (router.url.search(/co-living/i) != -1) {
      this.phoneflag = false;
    }
  }

  ngOnDestroy(): void {
    this.onConfigChanged.unsubscribe();
  }
}
