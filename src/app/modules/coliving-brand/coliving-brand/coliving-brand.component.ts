import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-coliving-brand',
  templateUrl: './coliving-brand.component.html',
  styleUrls: ['./coliving-brand.component.scss']
})
export class ColivingBrandComponent implements OnInit {

  constructor(
    private router: Router,
  ) {
    this.router.navigate(['/404'], { skipLocationChange: true });
  }

  ngOnInit() {
  }

}
