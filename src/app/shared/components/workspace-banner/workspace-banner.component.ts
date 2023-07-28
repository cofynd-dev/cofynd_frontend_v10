import { Component, Input, OnInit, HostListener, Output, EventEmitter } from '@angular/core';
import { AuthType } from '@core/enum/auth-type.enum';
import { Image, WorkSpace } from '@core/models/workspace.model';
import { AuthService } from '@core/services/auth.service';
import { UserService } from '@core/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { HelperService } from '@core/services/helper.service';

@Component({
  selector: 'app-workspace-banner',
  templateUrl: './workspace-banner.component.html',
  styleUrls: ['./workspace-banner.component.scss'],
})
export class WorkspaceBannerComponent implements OnInit {
  @Input() images: Image[];
  @Input() isFavorite: boolean;
  @Input() workspaceId: string;
  @Input() title: string;
  @Input() activeSliderItem: number;
  @Input() favoriteOption = true;
  @Output() selectedImageEvent: EventEmitter<number> = new EventEmitter<number>();
  loading: boolean;

  mainImg: Image;
  imgTL: Image;
  imgTR: Image;
  imgBL: Image;
  imgBR: Image;

  showImageGallery: boolean;
  tempImages: Image[] = [];

  isMobileMode: boolean;
  isSliderMode: boolean;
  hideBannerView: boolean;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private toastrService: ToastrService,
    private helperService: HelperService,
  ) {
    // initial set activeSliderItem to 0 otherwise not work because of undefined value
    this.activeSliderItem = 0;
  }

  openGallery() {
    if (this.helperService.getIsMobileMode()) {
      this.isMobileMode = false;
      this.isSliderMode = true;
    } else {
      this.showImageGallery = true;
      this.isSliderMode = true;
    }
  }

  closeImageGallery() {
    if (this.helperService.getIsMobileMode()) {
      this.isMobileMode = true;
      this.isSliderMode = false;
    } else {
      this.showImageGallery = !this.showImageGallery;
      this.isSliderMode = false;
    }
  }

  ngOnInit() {
    if (this.helperService.getIsMobileMode()) {
      this.initSlideSettings();
    }

    // TODO: Fix Me
    if (this.images.length) {
      this.images.forEach(image => {
        if (image.image && image.image.s3_link) {
          this.tempImages.push(image);
          this.mainImg = this.tempImages[0];
          this.imgTL = this.tempImages[1];
          this.imgTR = this.tempImages[2];
          this.imgBL = this.tempImages[3];
          this.imgBR = this.tempImages[4];
        }
      });
    }
  }

  addToFavorite() {
    if (!this.authService.getToken()) {
      this.authService.openAuthDialog(AuthType.LOGIN);
      return;
    }

    this.loading = true;
    this.userService.addToFavorite(this.workspaceId, !this.isFavorite).subscribe(
      (workspace: WorkSpace) => {
        this.loading = false;
        this.isFavorite = !this.isFavorite;
        this.toastrService.success(
          `${workspace.name} is ${this.isFavorite ? 'added to' : 'removed from'} your favorites list`,
          'Favorites Updated',
        );
      },
      error => {
        this.loading = false;
      },
    );
  }

  initSlideSettings() {
    this.isMobileMode = true;
    this.showImageGallery = true;
    this.hideBannerView = true;
    this.isSliderMode = false;
  }

  resetSliderSettings() {
    this.isMobileMode = false;
    this.showImageGallery = false;
    this.hideBannerView = false;
    this.isSliderMode = true;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isMobileMode = this.helperService.getIsMobileMode();
    if (this.helperService.getIsMobileMode()) {
      this.initSlideSettings();
    } else {
      this.resetSliderSettings();
    }
  }

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.closeImageGallery();
    }
  }
}
