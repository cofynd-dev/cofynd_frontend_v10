import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ConfigService } from '@core/services/config.service';
import { PageNotFoundService } from './page-not-found.service';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
})
export class PageNotFoundComponent implements OnInit, OnDestroy {
  public status: { code: number; message: string };

  constructor(
    @Inject(DOCUMENT) private document: any,
    private pageNotFoundService: PageNotFoundService,
    private configService: ConfigService,
    private title: Title,
  ) {
    this.title.setTitle('Page Not Found - CoFynd');
    this.document.getElementsByTagName('html')[0].classList.add('full-height');
    this.configService.configs.footer = false;
  }

  ngOnInit(): void {
    this.pageNotFoundService.setStatus(404, 'Not Found');
  }

  ngOnDestroy() {
    this.document.getElementsByTagName('html')[0].classList.remove('full-height');
    this.configService.setDefaultConfigs();
  }
}
