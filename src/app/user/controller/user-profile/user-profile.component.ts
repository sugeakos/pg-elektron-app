import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubSink } from 'subsink';
import { Person } from '../../domain/person';
import { RegistrationComponent } from '../registration/registration.component';
import { AuthenticationService } from '../../service/authentication.service';
import { PersonService } from '../../service/person.service';
import { NotificationService } from 'src/app/custom-features/notification.service';
import { NotificationType } from 'src/app/enumeration/notification.type';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss','../../../../styles.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {

  private subs = new SubSink();
  public user: Person;
  public editUser = new Person();
  private currentUsername: string;
  public refreshing: boolean;
  public isAdmin: boolean;
  public validPass: boolean;
  public passErrorString: string;
  private passRegex= '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}';
  constructor(private authService: AuthenticationService,private personServie: PersonService, private router: Router,
              private notifier: NotificationService) { }



  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin;
    this.user = this.authService.getUserFromLocalCache();
  }

  public onUpdateCurrentUser(person: Person): void {
    this.refreshing = true;
    this.currentUsername = this.authService.getUserFromLocalCache().username;
    //const formData = this.personServie.createPersonFormData(this.currentUsername, person );
    this.subs.add(
      this.personServie.updateUser(person,this.currentUsername).subscribe(
        (response: Person) => {
          this.authService.addUserToLocalCache(response);
          this.refreshing = false;
          this.sendNotification(NotificationType.SUCCESS,`Sikeresen frissítve lett ${response.lastName} ${response.firstName} felhasználó adatai.`);
        },
        (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse.error.message);
          this.refreshing = false;
          this.sendNotification(NotificationType.ERROR,`Hiba történt az adatok mentése közben.`);
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
