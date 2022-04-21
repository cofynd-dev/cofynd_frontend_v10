import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-placeholder',
  templateUrl: './loading-placeholder.component.html',
  styleUrls: ['./loading-placeholder.component.scss'],
})
export class LoadingPlaceholderComponent {
  @Input() height: string;
  @Input() width: string;
  @Input() radius: string;
  @Input() marginTop: string;
  @Input() marginBottom: string;
  @Input() marginLeft: string;
  @Input() marginRight: string;
  @Input() display: string;
}
