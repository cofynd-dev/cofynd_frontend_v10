import { NguCarouselConfig } from '@ngu/carousel';
import { environment } from '@env/environment';
import { AuthService } from '@core/services/auth.service';
import { Component, Input, ChangeDetectorRef, AfterViewInit, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { WorkSpace } from '@app/core/models/workspace.model';
import { UserService } from '@core/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { AuthType } from '@app/core/enum/auth-type.enum';

@Component({
  selector: 'app-search-card',
  templateUrl: './search-card.component.html',
  styleUrls: ['./search-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchCardComponent implements AfterViewInit {
  S3_URL = environment.images.S3_URL;
  @Input() workspace: WorkSpace;
  @Input() city: string;
  @Input() locality: string;
  @Input() forAll: boolean = true;
  loading: boolean;

  carouselTile: NguCarouselConfig = {
    grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
    slide: 1,
    speed: 250,
    point: {
      visible: true,
    },
    load: 5,
    velocity: 0,
    touch: true,
    loop: true,
    easing: 'cubic-bezier(0, 0, 0.2, 1)',
  };

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private toastrService: ToastrService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) { }

  openWorkSpace(workspace) {
    localStorage.setItem('country_name', workspace.country_dbname);
    localStorage.setItem('country_id', workspace.location.country);
    if (
      (workspace.country_dbname == 'india' ||
        workspace.country_dbname == 'India' ||
        workspace.country_dbname == 'INDIA' || workspace.location.country.name == 'India') && (workspace.plans)
    ) {
      const url = this.router.serializeUrl(this.router.createUrlTree([`/coworking/${workspace.slug}`]));
      // this.router.navigateByUrl(url);
      window.open(url, '_blank');
    }
    if (
      (workspace.country_dbname !== 'india' ||
        workspace.country_dbname !== 'India' ||
        workspace.country_dbname !== 'INDIA' || workspace.location.country.name !== 'India') && (workspace.plans)
    ) {
      let country_name;
      if (workspace.country_dbname) {
        country_name = workspace.country_dbname
      } else {
        country_name = workspace.location.country.name
      }
      var url = `/${country_name
        .toLowerCase()
        .trim()}/coworking-details/${workspace.slug.toLowerCase().trim()}`;
      // this.router.navigate([url]);
      window.open(url, '_blank');
    }

    if (
      (workspace.country_dbname == 'india' ||
        workspace.country_dbname == 'India' ||
        workspace.country_dbname == 'INDIA' || workspace.location.country.name == 'India') && (workspace.coliving_plans)
    ) {
      const url = this.router.serializeUrl(this.router.createUrlTree([`/co-living/${workspace.slug}`]));
      // this.router.navigateByUrl(url);
      window.open(url, '_blank');
    }

    if (
      (workspace.country_dbname !== 'india' ||
        workspace.country_dbname !== 'India' ||
        workspace.country_dbname !== 'INDIA' || workspace.location.country.name !== 'India') && (workspace.coliving_plans)
    ) {
      let country_name;
      if (workspace.country_dbname) {
        country_name = workspace.country_dbname
      } else {
        country_name = workspace.location.country.name
      }
      var url = `/${country_name
        .toLowerCase()
        .trim()}/co-living-details/${workspace.slug.toLowerCase().trim()}`;
      // this.router.navigate([url]);
      window.open(url, '_blank');
    }

  }
  openDetailsPage(workspace) {
    localStorage.setItem('country_name', workspace.country_dbname);
    localStorage.setItem('country_id', workspace.location.country);
    if (
      workspace.country_dbname == 'india' ||
      workspace.country_dbname == 'India' ||
      workspace.country_dbname == 'INDIA'
    ) {
      this.router.navigate([`/coworking/${workspace.slug.toLowerCase().trim()}`]);
    } else {
      var url = `/${workspace.country_dbname
        .toLowerCase()
        .trim()}/coworking-details/${workspace.slug.toLowerCase().trim()}`;
      this.router.navigate([url]);
    }
  }

  markAsFavorite(isFavorite: boolean) {
    if (!this.authService.getToken()) {
      this.authService.openAuthDialog(AuthType.LOGIN);
      return;
    }

    this.loading = true;
    this.userService.addToFavorite(this.workspace.id, !isFavorite).subscribe(
      () => {
        this.loading = false;
        this.workspace.is_favorite = !isFavorite;
        this.toastrService.success(
          `${this.workspace.name} is ${!isFavorite ? 'added to' : 'removed from'} your favorites list`,
          'Favorites Updated',
        );
      },
      error => {
        this.loading = false;
      },
    );
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }
}
