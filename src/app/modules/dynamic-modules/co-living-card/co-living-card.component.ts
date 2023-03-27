import { AfterViewInit, ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { intToOrdinalNumberString } from '@app/shared/utils';
import { NguCarouselConfig } from '@ngu/carousel';
import { CoLiving } from '../../co-living/co-living.model';

@Component({
  selector: 'app-co-living-card',
  templateUrl: './co-living-card.component.html',
  styleUrls: ['./co-living-card.component.scss'],
})
export class CoLivingCardComponent implements OnInit, AfterViewInit {
  @Input() coLiving: CoLiving;
  @Input() loading: boolean;
  isMobileResolution: boolean;
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

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    if (window.innerWidth < 768) {
      this.isMobileResolution = true;
    } else {
      this.isMobileResolution = false;
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize($event: Event): void {
    this.ngOnInit();
    // this.getScreenWidth = window.innerWidth;
    // this.getScreenHeight = window.innerHeight;
  }

  openWorkSpace(coLiving) {
    if (
      coLiving.country_dbname !== 'India' &&
      coLiving.country_dbname !== 'INDIA' &&
      coLiving.country_dbname !== 'india'
    ) {
      var url = `/${coLiving.country_dbname
        .toLowerCase()
        .trim()}/co-living-details/${coLiving.slug.toLowerCase().trim()}`;
      // this.router.navigate([url]);
      // window.open(url, '_blank');
      if (this.isMobileResolution) {
        this.router.navigate([url]);
      } else {
        window.open(url, '_blank');
      }
    } else {
      const url = this.router.serializeUrl(this.router.createUrlTree([`/co-living/${coLiving.slug}`]));
      // this.router.navigate([url]);
      // window.open(url, '_blank');
      if (this.isMobileResolution) {
        this.router.navigate([url]);
      } else {
        window.open(url, '_blank');
      }
    }
  }

  getFloorSuffix(floor: number) {
    return !isNaN(floor) ? intToOrdinalNumberString(floor) : floor;
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }
}
