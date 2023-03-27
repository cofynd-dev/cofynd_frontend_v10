import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Brand } from '@core/models/brand.model';

@Component({
  selector: 'app-coliving-brand-title',
  templateUrl: './coliving-brand-title.component.html',
  styleUrls: ['./coliving-brand-title.component.scss']
})
export class ColivingBrandTitleComponent {
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
