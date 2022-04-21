import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from '@core/models/user.model';
import { UserService } from '@core/services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  user: User;
  userForm: FormGroup;
  loading: boolean;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
  ) {
    this.buildForm();
  }

  ngOnInit() {
    this.getUserDetail();
  }

  getUserDetail() {
    this.userService.getUser().subscribe(userData => {
      this.userForm.patchValue((this.user = userData[0]));
    });
  }

  onSubmit() {
    this.userForm.markAllAsTouched();
    if (this.userForm.invalid) {
      return;
    }

    this.updateProfile();
  }

  updateProfile() {
    this.loading = true;
    const formValues = this.userForm.getRawValue();
    this.userService.updateUser(formValues).subscribe(
      () => {
        this.loading = false;
        this.toastrService.success('Profile updated successfully', 'Profile Updated');
      },
      error => {
        this.loading = false;
        this.toastrService.error(error.message);
      },
    );
  }

  private buildForm() {
    this.userForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      phone_number: ['', Validators.required],
      gender: ['', Validators.required],
      dob: ['', Validators.required],
    });
  }
}
