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
  newsMedia = ['daily-hunt', 'et-prime', 'inc42', 'tech-circle', 'the-statesman', 'your-story'];
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
