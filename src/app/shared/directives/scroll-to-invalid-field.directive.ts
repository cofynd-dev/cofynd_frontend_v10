import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgForm } from '@angular/forms';

@Directive({
  selector: '[appScrollToInvalidField]',
})

/**
 * @param  {NgForm}
 *  add appScrollToInvalidField on NgForm to Scroll on invalid form field
 */
export class ScrollToInvalidField {
  @Input() formGroup: NgForm;

  constructor(private el: ElementRef) {}

  /**
   * @params Invalid {FormControl}
   */
  static scrollToInvalidField(element: any) {
    if (element) {
      const distance = window.pageYOffset - Math.abs(element.getBoundingClientRect().y);

      window.scroll({
        behavior: 'smooth',
        left: 0,
        top: element.getBoundingClientRect().top + window.scrollY - 150,
      });

      setTimeout(() => {
        element.focus();
        element.blur();
        element.focus();
      }, distance);
    }
  }

  @HostListener('submit', ['$event'])
  onSubmit(event) {
    event.preventDefault();

    if (!this.formGroup.valid) {
      const formControlInvalid = this.el.nativeElement.querySelector('.ng-invalid');

      if (formControlInvalid) {
        return ScrollToInvalidField.scrollToInvalidField(formControlInvalid);
      } else {
        const formGroupInvalid = this.el.nativeElement.querySelectorAll('form .ng-invalid');
        if (formGroupInvalid && formGroupInvalid.length) {
          return ScrollToInvalidField.scrollToInvalidField(formGroupInvalid[0]);
        }
      }

      return ScrollToInvalidField.scrollToInvalidField(this.el.nativeElement);
    }
  }
}
