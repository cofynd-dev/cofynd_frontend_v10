import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-builder-resi-com-card',
  templateUrl: './builder-resi-com-card.component.html',
  styleUrls: ['./builder-resi-com-card.component.scss']
})
export class BuilderResiComCardComponent implements OnInit {
  @Input() subbuilder: any;

  constructor() { }

  ngOnInit() {
  }

}
