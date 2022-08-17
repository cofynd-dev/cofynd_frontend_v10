import { Directive, HostListener, Input, Inject } from '@angular/core';

@Directive({
  selector: '[opneNewTab]',
})
export class OpenLinkInNewWindowDirective {
  //@Input('olinwLink') link: string; //intro a new attribute, if independent from routerLink
  @Input('routerLink') link: string;

  constructor() {}

  @HostListener('mousedown') onMouseEnter() {
    window.open(this.link || '');
  }
}
