import { Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { HelperService } from '@core/services/helper.service';
import { environment } from '@env/environment';

declare const FB: any;

@Component({
  selector: 'app-social-share',
  templateUrl: './social-share.component.html',
  styleUrls: ['./social-share.component.scss'],
})
export class SocialShareComponent {
  url: string;
  @Input() image: string;
  @Input() title: string;
  @Input() description: string;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private helperService: HelperService,
    private router: Router,
  ) {
    this.url = environment.appUrl + this.router.url;
  }

  getTwitterShareUrl() {
    const url = `https://twitter.com/intent/tweet?url=${this.url}&text=Check out this co-working space on CoFynd!`;
    window.open(url, '_blank');
  }

  getWhatsAppShareUrl() {
    const desktopUrl = `https://web.whatsapp.com/send?text=Check out this co-working space on CoFynd! ${this.url}`;

    const deviceUrl = `https://wa.me/?text=${this.url}`;

    if (this.helperService.getIsMobileMode()) {
      window.open(deviceUrl, '_blank');
    } else {
      window.open(desktopUrl, '_blank');
    }
  }

  getFbShareUrl() {
    const fbUrl = `https://www.facebook.com/share.php?u=${this.url}`;
    window.open(fbUrl, '_blank');
  }
}
