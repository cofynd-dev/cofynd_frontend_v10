import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { AuthType } from '@core/enum/auth-type.enum';
import { ApiResponse } from '@core/models/api-response.model';
import { User } from '@core/models/user.model';
import { AuthDialogComponent } from '@shared/components/auth-dialog/auth-dialog.component';
import { AppConstant } from '@shared/constants/app.constant';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedInUser: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  readonly loggedInUser$ = this.loggedInUser.asObservable();
  dialogConfirmation$ = new Subject<boolean>();
  private authModalRef: BsModalRef;

  // required id for sign up on first time user
  private inflightUser: User;
  // Send Return URL from components
  private loginRedirectUrl: string;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private http: HttpClient,
    private router: Router,
    private modalService: BsModalService,
  ) {}

  openAuthDialog(authType: AuthType) {
    this.authModalRef = this.modalService.show(AuthDialogComponent, {
      class: 'modal-dialog-centered auth-modal',
    });
    this.authModalRef.content.authType = authType;
  }

  openReviewDialog(param) {
    this.authModalRef = this.modalService.show(AuthDialogComponent, {
      class: 'modal-dialog-centered auth-modal',
    });
    this.authModalRef.content.authType = param.authType;
    this.authModalRef.content.shouldOpenReviewModal = param.shouldOpenReviewModal;
    this.authModalRef.content.space = param.space;
    this.authModalRef.content.review = param.review;
  }

  closeAuthDialog() {
    if (this.authModalRef) {
      this.authModalRef.hide();
    }
  }

  /**
   * @params phone
   * @return OTP
   */
  signInWithOtp(phone: string) {
    const params = new FormData();
    params.append('phone_number', phone);

    return this.http.post<any>('/user/login', params).pipe(map((response: any) => response));
  }

  /**
   * @params phone, otp
   * @return <User>
   */
  verifyOtp(phone: string, otp: string, shouldCloseDialog = true): Observable<User> {
    const params = new FormData();
    params.append('phone_number', phone);
    params.append('otp', otp);

    return this.http.post<ApiResponse<User>>('/user/validate', params).pipe(
      map((response: ApiResponse<User>) => {
        if (response.token && response.data.is_profile_updated) {
          this.setTokenInLocalStorage(response.token);
          this.saveUserInLocalStorage(response.data);
          if (shouldCloseDialog) {
            this.closeAuthDialog();
          }
        } else {
          this.inflightUser = response.data;
        }
        return response.data;
      }),
    );
  }

  signInWithEmailAndPassword(userPayload: User) {
    return this.http.post<User>('/user/login', userPayload).pipe(
      map((user: User) => {
        this.setTokenInLocalStorage(user.token);
        this.closeAuthDialog();
        return user;
      }),
    );
  }

  signUp(userPayload: User, shouldCloseDialog = true) {
    const payload = userPayload;
    payload.id = this.inflightUser.id;
    return this.http.post<ApiResponse<User>>('/user/signUp', payload).pipe(
      map((response: ApiResponse<User>) => {
        this.setTokenInLocalStorage(response.token);
        this.saveUserInLocalStorage(response.data);
        if (shouldCloseDialog) {
          this.closeAuthDialog();
        }
        return response.data;
      }),
    );
  }

  verifyOtpForContact(phone: string, otp: string): Observable<User> {
    const params = new FormData();
    params.append('phone_number', phone);
    params.append('otp', otp);

    return this.http.post<ApiResponse<User>>('/user/validate', params).pipe(
      map((response: ApiResponse<User>) => {
        return response.data;
      }),
    );
  }

  /**
   * @returns token
   */
  getToken() {
    if (isPlatformBrowser(this.platformId)) {
      const token = JSON.parse(localStorage.getItem(AppConstant.LS_TOKEN_KEY));
      return token ? token : null;
    }
  }

  /**
   * @returns User
   */
  getLoggedInUser() {
    const user: User = JSON.parse(localStorage.getItem(AppConstant.LS_USER_KEY));
    return user ? user : null;
  }

  setLoginRedirectUrl(url: string) {
    this.loginRedirectUrl = url;
  }

  getLoginRedirectUrl() {
    return this.loginRedirectUrl;
  }

  /**
   * @required `access_token`
   */
  logOut() {
    this.clearLocalStorage();
    // TODO: API REFRESH TOKEN
    // this.http.get('/user/logout').subscribe(() => {
    //   this.clearLocalStorage();
    // });
  }

  /**
   * @param <token>
   * @description Store user token in local storage for authenticate logged in user
   */
  private setTokenInLocalStorage(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(AppConstant.LS_TOKEN_KEY, JSON.stringify(token));
    }
  }

  /**
   * @param <User>
   * @description Store user in local storage
   */
  private saveUserInLocalStorage(user: User): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loggedInUser.next(user);
      localStorage.setItem(AppConstant.LS_USER_KEY, JSON.stringify(user));
    }
  }

  /**
   * @returns User
   */
  public get currentUserDetail(): User {
    return this.loggedInUser.value;
  }

  /**
   * @description clear all local storage at time of logout
   */
  clearLocalStorage() {
    // Reset logged in user
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(AppConstant.LS_TOKEN_KEY);
      localStorage.removeItem(AppConstant.LS_USER_KEY);
      this.loggedInUser.next(null);
      // this.router.navigateByUrl('/');
      // location.reload();
    }
  }
}
