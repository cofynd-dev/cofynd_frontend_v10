import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { WorkSpace } from '@core/models/workspace.model';
import { UserService } from '@core/services/user.service';

@Component({
  selector: 'app-user-favorite',
  templateUrl: './user-favorite.component.html',
  styleUrls: ['./user-favorite.component.scss'],
})
export class UserFavoriteComponent implements OnInit {
  userWorkspaces: WorkSpace[];
  loading: boolean;
  isLoading: boolean;

  constructor(private userService: UserService, private toastrService: ToastrService) {}

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.loading = true;
    this.userService.getFavorites().subscribe(workspaces => {
      this.loading = false;
      this.userWorkspaces = workspaces;
    });
  }

  removeFromFavorite(workspace: WorkSpace) {
    this.isLoading = true;
    this.userService.addToFavorite(workspace.id, false).subscribe(
      () => {
        this.isLoading = false;
        this.userWorkspaces = this.userWorkspaces.filter(allWorkspaces => allWorkspaces.id !== workspace.id);
        this.toastrService.success(`${workspace.name} is removed from your favorites list`);
      },
      error => (this.isLoading = false),
    );
  }
}
