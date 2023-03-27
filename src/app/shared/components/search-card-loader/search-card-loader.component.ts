import { Component } from '@angular/core';

@Component({
  selector: 'app-search-card-loader',
  templateUrl: './search-card-loader.component.html',
  styleUrls: ['./search-card-loader.component.scss'],
})
export class SearchCardLoaderComponent {
  loadingItems = Array(6);
}
