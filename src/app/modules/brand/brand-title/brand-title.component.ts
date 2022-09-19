import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Brand } from '@core/models/brand.model';

@Component({
  selector: 'app-brand-title',
  templateUrl: './brand-title.component.html',
  styleUrls: ['./brand-title.component.scss'],
})
export class BrandTitleComponent {
  @Input() brand: Brand;
  @Input() pageTitle: string;
  @Input() selectedCity: string;
  @Input() url: string[];
  @Output() onCityEvent = new EventEmitter<string>();
  @Input() isColiving: boolean;
  workspaceName: string = 'Coworking';
  constructor(private router: Router) {}

  ngOnInit(): void {
    if (this.isColiving) {
      this.workspaceName = 'Coliving';
    }
  }

  onChangeCity(city): void {
    this.router.navigateByUrl(`/brand/${this.url[0]}/${city.name.toLocaleLowerCase()}`);
    this.onCityEvent.emit(city.id);
  }
}
