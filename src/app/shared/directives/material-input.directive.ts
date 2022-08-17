import { Directive, ElementRef, HostListener, Input, DoCheck, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appMaterialInput]',
})
export class MaterialInputDirective implements DoCheck {
  filled: boolean;

  constructor(public el: ElementRef, private renderer: Renderer2) {}

  ngDoCheck() {
    this.updateFilledState();
  }

  // To trigger change detection to manage state filled for material labels when there is no value binding
  @HostListener('input', ['$event'])
  onInput(e) {
    this.updateFilledState();
  }

  @HostListener('focus', ['$event']) onFocus(e: any) {
    this.renderer.addClass(this.el.nativeElement.parentElement, 'focused');
    return;
  }

  @HostListener('blur', ['$event']) onblur(e: any) {
    this.renderer.removeClass(this.el.nativeElement.parentElement, 'focused');
    return;
  }

  updateFilledState() {
    this.filled = this.el.nativeElement.value && this.el.nativeElement.value.length;
    if (this.filled) {
      this.renderer.addClass(this.el.nativeElement.parentElement, 'filled');
    } else {
      this.renderer.removeClass(this.el.nativeElement.parentElement, 'filled');
    }
  }
}
