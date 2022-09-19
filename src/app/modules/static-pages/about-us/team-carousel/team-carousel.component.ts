import { NguCarouselConfig } from '@ngu/carousel';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-team-carousel',
  templateUrl: './team-carousel.component.html',
  styleUrls: ['./team-carousel.component.scss'],
})
export class TeamCarouselComponent implements OnInit {
  carouselConfig: NguCarouselConfig = {
    grid: { xs: 1, sm: 1, md: 3, lg: 4, all: 0 },
    slide: 1,
    speed: 250,
    point: {
      visible: true,
    },
    interval: { timing: 4000, initialDelay: 1000 },
    load: 4,
    velocity: 0,
    touch: true,
    easing: 'cubic-bezier(0, 0, 0.2, 1)',
  };

  teams = [
    {
      name: 'Atul Gupta',
      designation: 'Founder & CEO',
      img: '/assets/images/about-us/atul-gupta-2.jpg',
    },
    {
      name: 'Harpreet',
      designation: 'Mentor & Advisor',
      img: '/assets/images/about-us/harpreet-ghumman.jpg',
    },
    {
      name: 'Mr. V Kishan',
      designation: 'Mentor & Advisor',
      img: '/assets/images/about-us/vkishan.jpg',
    },
    {
      name: 'T9L',
      designation: 'Tech Partner',
      img: '/assets/images/about-us/t9l.jpg',
    },
  ];

  constructor() {}

  ngOnInit() {}
}
