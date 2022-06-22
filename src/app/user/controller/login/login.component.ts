import {HttpErrorResponse, HttpResponse } from '@angular/common/http';
import {Component, OnDestroy, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { SubSink } from 'subsink';
import { Person } from '../../domain/person';
import { HeaderType } from '../../../enumeration/header.type';
import { AuthenticationService } from '../../service/authentication.service';
import { PersonService } from '../../service/person.service';
import { NotificationService } from 'src/app/custom-features/notification.service';
import { NotificationType } from 'src/app/enumeration/notification.type';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  public showLoading: boolean;
  private subs = new SubSink();
  constructor(private router: Router, private authService: AuthenticationService, private notifier: NotificationService) {
  }


  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/user/index');
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  public onLogin(user: Person): void {
    this.showLoading = true;
    this.subs.add(
      this.authService.login(user).subscribe(
        (response: HttpResponse<Person>) => {
          const token = response.headers.get(HeaderType.JWT_TOKEN);
          this.authService.saveTokenToLocalStorage(token);
          this.authService.addUserToLocalCache(response.body);
          this.router.navigateByUrl('/user/index');
          this.showLoading = false;
          this.sendNotification(NotificationType.SUCCESS,`Üdvözlünk körünkben.`);
        },
        (error: HttpErrorResponse) => {
          this.showLoading = false;
          this.sendNotification(NotificationType.ERROR, `${error.error.message}`);
        }
      )
    );
  }

  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notifier.sendNotification(notificationType, message);
    } else {
      this.notifier.sendNotification(notificationType, 'An error occurred. Please try again.');
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
