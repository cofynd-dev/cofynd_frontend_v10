import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private AUTH_HEADER = 'token';
  private AUTHORIZATION_TYPE = 'Bearer ';

  constructor(private injector: Injector) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authService = this.injector.get(AuthService);

    if (authService.getToken()) {
      request = request.clone({
        headers: request.headers.set(this.AUTH_HEADER, authService.getToken()),
      });
    }

    return next.handle(request);
  }
}
