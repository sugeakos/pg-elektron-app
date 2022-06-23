import { HttpErrorResponse } from '@angular/common/http';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, NgForm, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/custom-features/notification.service';
import { NotificationType } from 'src/app/enumeration/notification.type';
import {SubSink} from 'subsink';
import {PersonService} from '../../service/person.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {

  private subs = new SubSink();
  
  public showLoading: boolean = false;
  public emailFormControl: FormControl = new FormControl('', [Validators.required, Validators.email]);

  constructor(private personService: PersonService, private notifier: NotificationService, private router: Router) {
  }

  ngOnInit(): void {

  }

  public onResetPassword(): void {
    this.showLoading = true;
    this.subs.add(
      this.personService.resetPassword(this.emailFormControl.value).subscribe(
        (response) => {
          this.showLoading = false;
          this.router.navigateByUrl('/login');
          this.sendNotification(NotificationType.SUCCESS,`${response.message}, nézze meg a 'Spam' mappát is.`);
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
