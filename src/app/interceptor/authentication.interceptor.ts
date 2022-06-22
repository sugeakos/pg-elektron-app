import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthenticationService} from '../user/service/authentication.service';
import { environment } from 'src/environments/environment';


@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

  constructor(private authService: AuthenticationService) {
  }
  private host = environment.apiUrl;
  intercept(httpRequest: HttpRequest<any>, httpHandler: HttpHandler): Observable<HttpEvent<any>> {
    if (httpRequest.url.includes(`${this.authService.host}/login`)) {
      return httpHandler.handle(httpRequest);
    }
    if (httpRequest.url.includes(`${this.authService.host}/index`)) {
      return httpHandler.handle(httpRequest);
    }
    if (httpRequest.url.includes(`${this.authService.host}/registration`)) {
      return httpHandler.handle(httpRequest);
    }
    if (httpRequest.url.includes(`${this.authService.host}/person/reset-password`)) {
      return httpHandler.handle(httpRequest);
    }
    if (httpRequest.url.includes(`${this.authService.host}/index?code=**`)) {
      return httpHandler.handle(httpRequest);
    }
    if(httpRequest.url.includes(`${this.authService.host}/verify`)) {
      return httpHandler.handle(httpRequest);
    }

    this.authService.loadToken();
    const token = this.authService.getToken();
    const request = httpRequest.clone({setHeaders: { Authorization: `Bearer ${token}`}});
    return httpHandler.handle(request);
  }
}
