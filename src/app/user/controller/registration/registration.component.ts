import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, NgForm, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {NotificationService} from 'src/app/custom-features/notification.service';
import {NotificationType} from 'src/app/enumeration/notification.type';
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
  private registerPerson: Person = new Person();
  private passRegex = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[#$@$!%?&])[A-Za-z\\d$@$!#%?&]{8,}$';
  private emailRegex = '^(?=.{1,64}@)[A-Za-z0-9_-]+(.[A-Za-z0-9_-]+)*@[^-][A-Za-z0-9-]+(.[A-Za-z0-9-]+)*(.[A-Za-z]{2,})$';
  public hide: boolean = true;
  constructor(private router: Router, private authService: AuthenticationService, private notifier: NotificationService) {
  }

  public firstNameControl: FormControl = new FormControl('', [Validators.required]);
  public lastNameControl: FormControl = new FormControl('', [Validators.required]);
  public usernameControl: FormControl = new FormControl('', [Validators.required]);
  public addressControl: FormControl = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(255)]);
  public emailControl: FormControl = new FormControl('', [Validators.required, Validators.email, Validators.pattern(this.emailRegex)]);
  public passwordControl: FormControl = new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(this.passRegex)]);
  public passwordCheckControl: FormControl = new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(this.passRegex)]);
  public phoneFixControl: FormControl = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]);
  public phoneMobileControl: FormControl = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(12)]);


  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/user/index');
    }
  }

  public onRegister(userForm: NgForm): void {
    this.registerPerson.firstName = this.firstNameControl.value;
    this.registerPerson.lastName = this.lastNameControl.value;
    this.registerPerson.username = this.usernameControl.value;
    this.registerPerson.address = this.addressControl.value;
    this.registerPerson.email = this.emailControl.value;
    this.registerPerson.password = this.passwordControl.value;
    this.registerPerson.phoneFix = this.phoneFixControl.value;
    this.registerPerson.phoneMobile = this.phoneMobileControl.value;
    console.log(this.passwordControl.value);
    if (this.passwordControl.value == this.passwordCheckControl){
      this.subs.add(
        this.authService.register(this.registerPerson).subscribe(
          (response: Person) => {
            this.showLoading = true;
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
    } else {
      this.sendNotification(NotificationType.WARNING,`A két jelszó nem egyezik.`);
    }

  }

  public checkPasswords(event : any): boolean {
    if (this.passwordControl.value === event.target.value.toString()) {
      return this.validPass = true;
    } else {
      return this.validPass = false;
    }
    console.log(this.validPass);
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
