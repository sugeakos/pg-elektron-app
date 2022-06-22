import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/custom-features/notification.service';
import { NotificationType } from 'src/app/enumeration/notification.type';
import { AuthenticationService } from '../../user/service/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public isLoggedIn: boolean;
  public isAdminLoggedIn: boolean;
  constructor(private authService: AuthenticationService, private router: Router, private notifier: NotificationService) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.isAdminLoggedIn = this.authService.isAdminLoggedIn();
  }

  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notifier.sendNotification(notificationType, message);
    } else {
      this.notifier.sendNotification(notificationType, 'An error occurred. Please try again.');
    }
  }


  public onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/index']);
    this.sendNotification(NotificationType.DEFAULT,'Sikeresen kijelentkezett.');
  }
}
