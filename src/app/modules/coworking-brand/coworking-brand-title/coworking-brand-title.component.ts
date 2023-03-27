import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Brand } from '@core/models/brand.model';

@Component({
  selector: 'app-coworking-brand-title',
  templateUrl: './coworking-brand-title.component.html',
  styleUrls: ['./coworking-brand-title.component.scss']
})
export class CoworkingBrandTitleComponent {
  @Input() brand: Brand;
  @Input() pageTitle: string;
  @Input() selectedCity: string;
  @Input() url: string[];
  @Output() onCityEvent = new EventEmitter<string>();
  @Input() isColiving: boolean;
  workspaceName: string = 'Coworking';
  constructor(private router: Router) { }

  ngOnInit(): void {
    if (this.isColiving) {
      this.workspaceName = 'Coliving';
    }
  }

  onChangeCity(city): void {
    this.router.navigateByUrl(`/coworking-brand/${this.url[0]}/${city.name.toLocaleLowerCase()}`);
    this.onCityEvent.emit(city.id);
  }

}
