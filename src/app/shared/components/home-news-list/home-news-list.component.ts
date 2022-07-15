import { Component, OnInit } from '@angular/core';
import { WorkSpaceService } from '@app/core/services/workspace.service';

@Component({
  selector: 'app-home-news-list',
  templateUrl: './home-news-list.component.html',
  styleUrls: ['./home-news-list.component.scss'],
})
export class HomeNewsListComponent implements OnInit {
  newsList: any;
  pageTitle = 'CoFynd in the News';
  newsMedia = ['your-story', 'the-statesman', 'et-prime', 'daily-hunt', 'inc42', 'tech-circle'];
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
