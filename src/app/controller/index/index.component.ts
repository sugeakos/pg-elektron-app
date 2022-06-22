import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatMenuModule, MatMenuTrigger} from '@angular/material/menu';
import {MatSidenavModule} from '@angular/material/sidenav';
import {FormControl} from '@angular/forms'
import {PersonService} from 'src/app/user/service/person.service';
import {SubSink} from 'subsink';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from 'src/app/custom-features/notification.service';
import {NotificationType} from 'src/app/enumeration/notification.type';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {
  private code: string = '';

  constructor(private personService: PersonService, private route: ActivatedRoute, private router: Router, private notifier: NotificationService) {
  }

  private subs = new SubSink();

  ngOnInit(): void {
    if (this.route.snapshot.queryParams['code']) {
      this.code = this.route.snapshot.queryParams['code'];
      this.subs.add(
        this.personService.verifyEmailAddress(this.code).subscribe(
          (response) => {
            this.router.navigateByUrl('/login');
            this.sendNotification(NotificationType.SUCCESS, `Köszönjük, hogy megerősítette az email címét, mostmár beléphet.`);
          },
          (error: HttpErrorResponse) => {
            this.router.navigateByUrl('/login');
            this.sendNotification(NotificationType.ERROR, `Hiba történt, próbálja meg később.`);
          }
        )
      );
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
