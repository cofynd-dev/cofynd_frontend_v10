import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthType } from '@core/enum/auth-type.enum';
import { WorkSpace } from '@core/models/workspace.model';
import { AuthService } from '@core/services/auth.service';
import { UserService } from '@core/services/user.service';

@Component({
  selector: 'app-workspace-banner-blank',
  templateUrl: './workspace-banner-blank.component.html',
  styleUrls: ['./workspace-banner-blank.component.scss'],
})
export class WorkspaceBannerBlankComponent implements OnInit {
  @Input() isFavorite: boolean;
  @Input() workspaceId: string;
  loading: boolean;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private toastrService: ToastrService,
  ) {}

  ngOnInit() {}

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
          `${workspace.name} is ${workspace.is_favorite ? 'added to' : 'removed from'} your favorites list`,
          'Favorites Updated',
        );
      },
      error => {
        this.loading = false;
      },
    );
  }
}
