import { environment } from '@env/environment';
import { isPlatformBrowser } from '@angular/common';
import { Directive, HostListener, Input, Inject, PLATFORM_ID } from '@angular/core';
interface CustomEventJson {
  category: string;
  action: string;
  label?: string;
  value?: any;
}

declare let ga: any;

@Directive({
  selector: '[appCustomEventAnalytics]',
})
export class CustomEventAnalyticsDirective {
  @Input() appCustomEventAnalytics: CustomEventJson;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  @HostListener('click', ['$event']) onClick($event) {
    if (environment.options.GA_ENABLED && isPlatformBrowser(this.platformId)) {
      ga(
        'send',
        'event',
        this.appCustomEventAnalytics.category,
        this.appCustomEventAnalytics.action,
        this.appCustomEventAnalytics.label,
        this.appCustomEventAnalytics.value,
      );
    }
  }
}
