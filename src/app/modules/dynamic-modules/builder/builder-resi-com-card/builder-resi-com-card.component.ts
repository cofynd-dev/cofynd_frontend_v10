import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-builder-resi-com-card',
  templateUrl: './builder-resi-com-card.component.html',
  styleUrls: ['./builder-resi-com-card.component.scss']
})
export class BuilderResiComCardComponent implements OnInit {
  @Input() subbuilder: any;
  @Input() buildername: string;
  url: any;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goToDetail() {
    this.url = `/${this.subbuilder.location.country.name.toLowerCase()}/${this.subbuilder.builder.slug}/${this.subbuilder.slug}`;
    window.open(this.url, '_blank');
  }
}
