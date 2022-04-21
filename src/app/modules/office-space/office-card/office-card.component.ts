import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OfficeSpace } from '@core/models/office-space.model';
import { NguCarouselConfig } from '@ngu/carousel';
import { intToOrdinalNumberString } from '@app/shared/utils';

@Component({
  selector: 'app-office-card',
  templateUrl: './office-card.component.html',
  styleUrls: ['./office-card.component.scss'],
})
export class OfficeCardComponent implements OnInit, AfterViewInit {
  @Input() office: OfficeSpace;
  @Input() loading: boolean;
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

  ngOnInit() {}

  openWorkSpace(slug: string) {
    const url = this.router.serializeUrl(this.router.createUrlTree([`/office-space/rent/${slug}`]));
    window.open(url, '_blank');
  }

  getFloorSuffix(floor: number) {
    return !isNaN(floor) ? intToOrdinalNumberString(floor) : floor;
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }
}
