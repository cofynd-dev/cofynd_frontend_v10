import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Brand } from '@core/models/brand.model';

@Component({
  selector: 'app-home-brand-list',
  templateUrl: './home-brand-list.component.html',
  styleUrls: ['./home-brand-list.component.scss'],
})
export class HomeBrandListComponent {
  @Input() coworkingBrands: Brand[] = [];
  @Input() coLivingBrands: Brand[] = [];
  loading: boolean;
  @Input() pageTitle: string = 'Our Coworking Partners';
  @Input() layout: 'grey';
  @Input() shouldCoWorkingVisible: boolean = true;
  @Input() shouldCoLivingVisible: boolean;
  @Input() shouldOtherBrandVisible: boolean;

  constructor(private router: Router) { }

  ngOnInit() {
    this.loading = true;
  }

  goToBrandPage(brand: Brand, isColiving = false) {
    if (isColiving) {
      this.router.navigate([`/brand/co-living/${brand.slug}`]);
      return;
    }
    this.router.navigate([`/brand/${brand.slug}`]);
  }
}
