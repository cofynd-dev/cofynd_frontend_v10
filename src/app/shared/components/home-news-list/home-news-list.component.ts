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

  onSliderMove(slideData: NguCarouselStore) {
    this.active = slideData.currentSlide;
  }

  constructor(private readonly workSpaceService: WorkSpaceService) { }

  ngOnInit() {
    this.getBlogs();
  }

  getBlogs() {
    this.workSpaceService.getBlogs().subscribe(res => {
      this.newsList = res;
    });
  }

  redirect(item) {
    window.open(`${item.url}`, '_blank');
  }
}
