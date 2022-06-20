import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Params} from '@angular/router';
import {NotificationService} from 'src/app/custom-features/notification.service';
import {NotificationType} from 'src/app/enumeration/notification.type';
import {TvCategoryService} from 'src/app/tv-category/service/tv-category.service';
import { Person } from 'src/app/user/domain/person';
import {AuthenticationService} from 'src/app/user/service/authentication.service';
import {SubSink} from 'subsink';
import {Tv} from '../../domain/tv';
import {TvService} from '../../service/tv.service';

@Component({
  selector: 'app-update-tv',
  templateUrl: './update-tv.component.html',
  styleUrls: ['./update-tv.component.scss']
})
export class UpdateTvComponent implements OnInit, OnDestroy {

  private subs = new SubSink();
  private selectedTvId: string;
  public selectedTv: Tv;
  public loggedInUser: Person;
  constructor(private authService: AuthenticationService, private route: ActivatedRoute, private tvService: TvService,
              private tvCatService: TvCategoryService, private notifier: NotificationService) {
  }

  ngOnInit(): void {
    this.loggedInUser = this.authService.getUserFromLocalCache();
    this.subs.add(
      this.route.params.subscribe(
        (params: Params) => {
          this.selectedTvId = params['id'];
        }
      )
    );

    this.getTv();
  }

  public getTv(): void {
    this.selectedTv = new Tv();

    this.subs.add(
      this.tvService.findATv(this.selectedTvId).subscribe(
        (response: Tv) => {
          this.selectedTv = response;
          console.log(response);
          this.sendNotification(NotificationType.SUCCESS, 'Sikerült megtalálni a keresett TV-t.');
        },
        (error: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, error.error.message);
        }
      )
    );
  }

  public onUpdateReservedDate(tvForm: NgForm): void {

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
