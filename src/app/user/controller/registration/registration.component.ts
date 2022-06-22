import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { NotificationService } from 'src/app/custom-features/notification.service';
import { NotificationType } from 'src/app/enumeration/notification.type';
import {SubSink} from 'subsink';
import {Person} from '../../domain/person';
import {AuthenticationService} from '../../service/authentication.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit, OnDestroy {
  public showLoading: boolean;
  private subs = new SubSink();
  public validPass: boolean;
  public passErrorString: string;
  private passRegex= '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}';

  constructor(private router: Router, private authService: AuthenticationService, private notifier: NotificationService) {
  }


  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/person/index');
    }
  }

  public onRegister(user: Person): void {

    this.subs.add(
      this.authService.register(user).subscribe(
        (response: Person) => {
          console.log(response);
          this.showLoading = false;
          this.router.navigateByUrl("/login");
          this.sendNotification(NotificationType.SUCCESS, `A megerősítő email el lett küldve. \n Kérem ellenőrizze a SPAM mappát is.`);
        },
        (error: HttpErrorResponse) => {
          console.log(error.error.message);
          this.showLoading = false;
          this.sendNotification(NotificationType.ERROR, `Hiba történk, kérem próbálja meg később.`);
        }
      )
    );
  }

  public checkPasswords(password: string, passwordCheck: string): boolean {
    if (password.match(this.passRegex)) {
      if (password.match(passwordCheck)){
        this.validPass = true;
        this.passErrorString = '';
        return true;

      } else {

        this.validPass = false;
        this.passErrorString = 'A két jelszó nem egyezik.';
        return false;

      }
    } else {
      this.validPass = false;
      this.passErrorString = 'A jelszónak minimum 8 karakter hosszúnak kell lennie, tartalmaznia kell: legalább 1 kisbetűt, 1 nagybetűt, 1 számot, és 1 speciális karaktert: $@$!%&';
      return false;
    }
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
