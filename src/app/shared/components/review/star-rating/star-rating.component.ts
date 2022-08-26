import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss'],
})
export class StarRatingComponent implements OnInit, OnChanges {
  @Input() rating: number;
  @Input() shouldDisabled: boolean = true;
  @Input() id: number = new Date().getUTCMilliseconds();

  constructor() { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.editing) {
    }
  }
}
