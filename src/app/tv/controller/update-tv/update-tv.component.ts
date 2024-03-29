import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, NgForm, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
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
  public currentReservedDate: number;
  public minDate: Date;
  public maxDate: Date;
  public stepMinute;
  public defaultTime: any[];
  public minTime = 9;
  public maxTime = 17;
  public validDateTime: boolean = false;
  private selectedDateTime: Date;
  public reservedDateToRepair: FormControl = new FormControl('', [Validators.required]);
  constructor(private authService: AuthenticationService, private route: ActivatedRoute, private tvService: TvService,
              private tvCatService: TvCategoryService, private notifier: NotificationService, private router: Router) {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    this.minDate = new Date(currentYear - 0, currentMonth, new Date().getDate());
    this.maxDate = new Date(currentYear + 0, currentMonth + 3, 31);
    this.stepMinute = 10;
    this.defaultTime = [9, 0, 0];
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

  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  };

  public getTv(): void {
    this.selectedTv = new Tv();

    this.subs.add(
      this.tvService.findATv(this.selectedTvId).subscribe(
        (response: Tv) => {
          this.selectedTv = response;
          if(this.selectedTv.dateOfCorrection != null) {
            this.router.navigateByUrl('/user/index');
            this.sendNotification(NotificationType.WARNING,`A válsztott TV már meg lett javítva.`);
          }
          this.currentReservedDate = response.reservedDateToRepair;
          this.sendNotification(NotificationType.SUCCESS, 'Sikerült megtalálni a keresett TV-t.');
        },
        (error: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, error.error.message);
        }
      )
    );
  }

  public onUpdateReservedDate(tvForm: NgForm): void {
    this.selectedTv.personEmail = tvForm.controls['personEmail'].value.toString();
    this.selectedTv.tvCategoryDescription = tvForm.controls['tvCategoryDescription'].value;
    this.selectedTv.errorSeenByCustomer = tvForm.controls['errorSeenByCustomer'].value;
    this.selectedTv.reservedDateToRepair = Date.parse(this.reservedDateToRepair.value);
    this.subs.add(
      this.tvService.updateReservedDate(this.selectedTv).subscribe(
        (response: Tv | null) => {
          if (response == null) {
            this.sendNotification(NotificationType.WARNING, `A választott időpont már foglalt. Kérem válasszon másikat.`)
          }
          if (response != null) {
            tvForm.resetForm();
            this.router.navigateByUrl('/user/index');
            this.sendNotification(NotificationType.SUCCESS, `Sikeresen lefoglalta az időpontot.`);
          }
        },
        (err: HttpErrorResponse) => {
          tvForm.reset();
          this.sendNotification(NotificationType.ERROR, `Hiba történt, próbálja meg később`);
        }
      )
    );
  }

  public addEvent($event: any) {

    this.selectedDateTime = $event.value.getHours();
    if (+this.selectedDateTime >= this.maxTime || +this.selectedDateTime < this.minTime) {
      this.validDateTime = false;
      this.sendNotification(NotificationType.WARNING, `Válasszon időpontot ${this.minTime} és ${this.maxTime} között`);
    } else {
      this.validDateTime = true;
    }
    if ((+this.selectedDateTime < new Date().getHours()) && ($event.value <= new Date())) {
      this.validDateTime = false;
      this.sendNotification(NotificationType.WARNING, `Olyan időpontot választhat ami nem a múltban van`);
    } else {
      this.validDateTime = true;
    }
    if ((+this.selectedDateTime < new Date().getHours()) && ($event.value > new Date())) {
      this.validDateTime = true;
      //this.sendNotification(NotificationType.WARNING, `Válasszon időpontot ${this.minTime} és ${this.maxTime} között`);
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
