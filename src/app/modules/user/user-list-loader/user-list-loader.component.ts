import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-list-loader',
  templateUrl: './user-list-loader.component.html',
  styleUrls: ['./user-list-loader.component.scss'],
})
export class UserListLoaderComponent implements OnInit {
  loadingItems = new Array(6);
  constructor() {}

  ngOnInit() {}
}
