import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NguCarouselConfig } from '@ngu/carousel';

@Component({
  selector: 'app-gosteps-card',
  templateUrl: './gosteps-card.component.html',
  styleUrls: ['./gosteps-card.component.scss']
})
export class GostepsCardComponent implements OnInit {

  @Input() goStops;
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
  constructor(private router: Router,) { }

  ngOnInit() {
  }

  openWorkSpace(slug: string) {
    const url = this.router.serializeUrl(this.router.createUrlTree([`/workation/${slug}`]));
    window.open(url, '_blank');
  }
}
