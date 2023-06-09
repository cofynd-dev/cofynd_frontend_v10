import { Component, OnInit } from '@angular/core';
import { Builder } from '../builder.model';
import { BuilderService } from '../builder.services';
import { AppConstant } from '@shared/constants/app.constant';

@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.scss'],
})
export class BuilderComponent implements OnInit {
  featuredBuilders: Builder[];
  queryParams: { [key: string]: string | number };

  constructor(private builderService: BuilderService) {
    this.queryParams = { ...AppConstant.DEFAULT_SEARCH_PARAMS };
  }

  ngOnInit() {}

  scrollToElement(element: HTMLElement) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}
