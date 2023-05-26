import { Component, OnInit, ViewChild } from '@angular/core';
import { WorkSpaceService } from '@app/core/services/workspace.service';


import { NguCarousel, NguCarouselConfig, NguCarouselStore } from '@ngu/carousel';

interface newsLogoList {
  name: string;
  address: string;
  image: string;
  id: string;
  slug?: string;
}

@Component({
  selector: 'app-home-news-list',
  templateUrl: './home-news-list.component.html',
  styleUrls: ['./home-news-list.component.scss'],
})
export class HomeNewsListComponent implements OnInit {
  loading: boolean;
  newsList: any;
  pageTitle = 'CoFynd in the News';
  newsMedia = ['your-story', 'the-statesman', 'et-prime', 'daily-hunt', 'inc42', 'tech-circle'];

  // @ViewChild('myCarousel', { static: false })

  @ViewChild('myCarousel', { static: false })
  popularSpaceCarousel: NguCarousel<newsLogoList>;

  active = 0;

  // imgags = [
  //   'http://localhost:5300/assets/images/newsLogo/your-story.png',
  //   'http://localhost:5300/assets/images/newsLogo/the-statesman.png',
  //   'http://localhost:5300/assets/images/newsLogo/et-prime.png',
  //   'http://localhost:5300/assets/images/newsLogo/daily-hunt.png',
  //   'http://localhost:5300/assets/images/newsLogo/daily-hunt.png',
  //   'http://localhost:5300/assets/images/newsLogo/tech-circle.png'
  // ];
  public carouselTileItems: Array<any> = [0, 1, 2, 3, 4, 5];
  public carouselTiles = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: []
  };
  public carouselTile: NguCarouselConfig = {
    grid: { xs: 3, sm: 5, md: 5, lg: 6, all: 0 },
    slide: 1,
    speed: 250,
    point: {
      visible: true
    },
    interval: { timing: 4000, initialDelay: 1000 },
    load: 4,
    velocity: 0,
    touch: true,
    easing: 'cubic-bezier(0, 0, 0.2, 1)'
  };

  // newsLogoCarousel: NguCarousel<newsLogoList>;
  // active = 0;
  // carouselConfig: NguCarouselConfig = {
  //   grid: { xs: 3, sm: 5, md: 5, lg: 6, all: 0 },
  //   slide: 1,
  //   speed: 250,
  //   point: {
  //     visible: true,
  //   },
  //   interval: { timing: 4000, initialDelay: 1000 },
  //   load: 4,
  //   velocity: 0,
  //   touch: true,
  //   easing: 'cubic-bezier(0, 0, 0.2, 1)',
  // };

  // goToPrev() {
  //   this.myCarousel.moveTo(this.active - 1);
  // }

  // goToNext() {
  //   this.myCarousel.moveTo(this.active + 1);
  // }

  onSliderMove(slideData: NguCarouselStore) {
    this.active = slideData.currentSlide;
  }

  constructor(private readonly workSpaceService: WorkSpaceService) { }

  ngOnInit() {
    this.getBlogs();
  }

  // coworkingBrandsList = [
  //   {
  //     id: 1,
  //     name: 'Wework',
  //     image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/93f7fa099b87eccf93812fbff5d13f83a2cc487a.png',
  //     url: '/coworking-brand/wework'
  //   },
  //   {
  //     id: 2,
  //     name: 'Awfis',
  //     image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/24d34a77dafecc24635767dee0ae7fd250cb3649.jpg',
  //     url: '/coworking-brand/awfis'
  //   },
  //   {
  //     id: 3,
  //     name: 'Innov8',
  //     image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/9c0c2a58819ef996fd210b7cad122dd15d761ed0.png',
  //     url: '/coworking-brand/innov8'
  //   },
  //   {
  //     id: 4,
  //     name: '91SpringBoard',
  //     image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/9d0d32fd1a689722ed5f719d9eab7dbbceeff9f5.png',
  //     url: '/coworking-brand/91-spring-board'
  //   },
  //   {
  //     id: 5,
  //     name: 'instaoffice',
  //     image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/17870b28354c41ede388e5c30c67d196cfb05f08.png',
  //     url: '/coworking-brand/instaoffice'
  //   },
  //   {
  //     id: 6,
  //     name: 'Indiqube',
  //     image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/31965e7c65101640fa945260d7fc2d2430a5b5fd.jpg',
  //     url: '/coworking-brand/indiqube'
  //   },
  // ]

  getBlogs() {
    this.workSpaceService.getBlogs().subscribe(res => {
      this.newsList = res;
    });
  }

  redirect(item) {
    window.open(`${item.url}`, '_blank');
  }
}
