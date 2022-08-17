import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[appLoadingButton]',
})
export class LoadingButtonDirective implements OnChanges {
  @Input() appLoadingButton: boolean;
  btnElement: HTMLElement;
  spinnerTpl = `<span></span>`;

  constructor(private el: ElementRef) {
    this.btnElement = el.nativeElement;
    this.appendSpinnerTpl(this.btnElement);
  }

  ngOnChanges() {
    if (this.appLoadingButton) {
      this.btnElement.setAttribute('disabled', 'disabled');
      this.btnElement.classList.add('is-loading');
    } else {
      this.btnElement.removeAttribute('disabled');
      this.btnElement.classList.remove('is-loading');
    }
  }

  /**
   * compile and append the spinner template to the button.
   * @param <btnEl>
   */
  appendSpinnerTpl(btnEl: HTMLElement) {
    btnEl.insertAdjacentHTML('beforeend', this.spinnerTpl as string);
  }
}
