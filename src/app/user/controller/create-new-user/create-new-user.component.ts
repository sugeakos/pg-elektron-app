import { HttpErrorResponse } from '@angular/common/http';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, NgForm, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import {NotificationService} from 'src/app/custom-features/notification.service';
import { NotificationType } from 'src/app/enumeration/notification.type';
import {SubSink} from 'subsink';
import {Person} from '../../domain/person';
import {AuthenticationService} from '../../service/authentication.service';
import {PersonService} from '../../service/person.service';

@Component({
  selector: 'app-create-new-user',
  templateUrl: './create-new-user.component.html',
  styleUrls: ['./create-new-user.component.scss']
})
export class CreateNewUserComponent implements OnInit, OnDestroy {

  private newUser: Person = new Person();

  private subs = new SubSink();
  public showLoading: boolean = false;
  private emailRegex = '^(?=.{1,64}@)[A-Za-z0-9_-]+(.[A-Za-z0-9_-]+)*@[^-][A-Za-z0-9-]+(.[A-Za-z0-9-]+)*(.[A-Za-z]{2,})$';

  public firstNameControl: FormControl = new FormControl('', [Validators.required]);
  public lastNameControl: FormControl = new FormControl('', [Validators.required]);
  public usernameControl: FormControl = new FormControl('', [Validators.required]);
  public addressControl: FormControl = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(255)]);
  public emailControl: FormControl = new FormControl('', [Validators.required, Validators.email, Validators.pattern(this.emailRegex)]);
  public phoneFixControl: FormControl = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]);
  public phoneMobileControl: FormControl = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(12)]);
  public roleControl: FormControl = new FormControl('Válasszon rangot', [Validators.required]);

  constructor(private personService: PersonService, private notifier: NotificationService, private authService: AuthenticationService,
  private router: Router) {
  }

  ngOnInit(): void {
    if (!this.authService.isAdminLoggedIn()) {
      this.router.navigateByUrl('/user/index');
      this.sendNotification(NotificationType.WARNING,`Nincs joga ezen az oldalon tartózkodnia.`);
    }
  }

  public onAddNewUser(userForm: NgForm): void {
    this.newUser.firstName = this.firstNameControl.value;
    this.newUser.lastName = this.lastNameControl.value;
    this.newUser.username = this.usernameControl.value;
    this.newUser.address = this.addressControl.value;
    this.newUser.email = this.emailControl.value;
    this.newUser.role = this.roleControl.value;
    this.newUser.phoneFix = this.phoneFixControl.value;
    this.newUser.phoneMobile = this.phoneMobileControl.value;

    this.subs.add(
      this.personService.addUser(this.newUser).subscribe(
        (response: Person) => {
          this.showLoading = true;
          this.sendNotification(NotificationType.SUCCESS, `A megerősítő email el lett küldve.`);
          userForm.reset();
          this.router.navigateByUrl('/user/index');
        },
        (error: HttpErrorResponse) => {
          this.showLoading = false;
          this.sendNotification(NotificationType.ERROR, `Hiba történk, kérem próbálja meg később. \n ${error.error.message}`);
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
