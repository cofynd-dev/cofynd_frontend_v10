import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { environment } from '@env/environment';
import { filter } from 'rxjs/operators';
import { AuthService } from '@core/services/auth.service';
// declare google analytics
declare let ga: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  constructor(@Inject(PLATFORM_ID) private platformId: any, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // Router change scroll to top
    this.scrollOnTop();
  }

  /**
   * Scroll to top on page change
   */
  scrollOnTop() {
    const navigationEndEvent = this.router.events.pipe(filter(event => event instanceof NavigationEnd));
    navigationEndEvent.subscribe((event: NavigationEnd) => {
      if (isPlatformBrowser(this.platformId)) {
        // Scroll Top On Page Change
        window.scrollTo(0, 0);
      }
    });
  }

  ngAfterViewInit(): void {
    if (environment.options.GA_ENABLED) {
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd && isPlatformBrowser(this.platformId)) {
          ga('set', 'page', event.urlAfterRedirects);
          ga('send', 'pageview');
        }
      });
    }
  }
}
