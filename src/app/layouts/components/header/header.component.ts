import { AVAILABLE_CITY, AVAILABLE_CITY_CO_LIVING } from './../../../core/config/cities';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { Component, OnInit, AfterViewInit, ChangeDetectorRef, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DEFAULT_APP_DATA } from '@core/config/app-data';
import { AuthType } from '@core/enum/auth-type.enum';
import { City } from '@core/models/city.model';
import { AuthService } from '@core/services/auth.service';
import { WorkSpaceService } from '@core/services/workspace.service';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { AppConfig } from '@core/interface/config.interface';
import { ConfigService } from '@core/services/config.service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [{ provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true } }],
})
export class HeaderComponent implements AfterViewInit {
  userNameInitial: string;
  contactInfo = DEFAULT_APP_DATA.contact;
  clearSearchAddressText: string;
  showSearch: boolean;
  country: any;
  isSearchModal: boolean;

  // On layout settings changed handler
  settings: AppConfig;
  onSettingsChanged: Subscription;

  menuPopularCoWorkings: City[];
  menuPopularOffices: City[];
  menuPopularCoLiving: City[];

  isMobileMenuOpen: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    private location: Location,
    private workSpaceService: WorkSpaceService,
    private configService: ConfigService,
    private cdr: ChangeDetectorRef,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.menuPopularCoWorkings = AVAILABLE_CITY.filter(city => city.for_coWorking === true && city.id !== '5f8d3541c2502350f24feeb6');
    this.menuPopularOffices = AVAILABLE_CITY.filter(city => city.for_office === true);
    this.menuPopularCoLiving = AVAILABLE_CITY_CO_LIVING.filter(city => city.id !== '5f9bf559c2502350f2500152');
    router.events.subscribe(() => {
      if (this.location.path() === '') {
        this.showSearch = false;
      } else {
        this.showSearch = true;
      }
    });

  }

  isAuthenticated() {
    return this.authService.getToken() ? true : false;
  }

  onLogOut() {
    this.authService.logOut();
    this.closeMobileMenu();
    this.router.navigateByUrl('', { skipLocationChange: true }).then(() => {
      this.router.navigate([this.location.path()]);
    });
  }

  openLoginModal() {
    this.authService.openAuthDialog(AuthType.LOGIN);
    this.closeMobileMenu();
  }

  openSignUpModal() {
    this.authService.openAuthDialog(AuthType.SIGN_UP);
  }

  getUserName() {
    return this.authService.getLoggedInUser() ? this.authService.getLoggedInUser().name.substring(0, 1) : 'C';
  }

  getUser() {
    return this.authService.getLoggedInUser() ? this.authService.getLoggedInUser().name : 'User';
  }

  onCityChange(city: City) {
    this.router.navigateByUrl(`/coworking/${city.name.toLowerCase().trim()}`);
    this.workSpaceService.setSearchAddress(city.name);
  }

  redirectToblog() {
    window.open(`${environment.blogUrl}`, '_blank');
  }

  openMobileSearch() {
    this.isSearchModal = true;
  }

  closeMobileSearch() {
    this.isSearchModal = false;
  }

  openMobileMenu() {
    this.isMobileMenuOpen = true;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  ngAfterViewInit(): void {
    // Subscribe to all the settings change events
    this.onSettingsChanged = this.configService.onAppConfigChanged.subscribe((newSettings: AppConfig) => {
      this.settings = newSettings;
      this.cdr.detectChanges();
    });
  }
  logoClick() {
    localStorage.removeItem('minPrice');
    localStorage.removeItem('maxPrice');
    console.log("removeItem");
    this.workSpaceService.getCountry({ "for_coWorking": true }).subscribe((res: any) => {
      this.country = res.data.filter(country => country.name === "India" || country.name === "india" || country.name === "INDIA");
      if (this.country.length > 0) {
        localStorage.setItem('country_name', this.country[0].name);
        localStorage.setItem('country_id', this.country[0].id);
      }
    })
  }
}
