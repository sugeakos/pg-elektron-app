import {Injectable} from '@angular/core';
import {NotifierService} from "angular-notifier";
import { NotificationType } from '../enumeration/notification.type';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {


  constructor(private notifier: NotifierService) {
  }

  public sendNotification(type: NotificationType, message: string): void {
    this.notifier.notify(type, message);
  }


}
