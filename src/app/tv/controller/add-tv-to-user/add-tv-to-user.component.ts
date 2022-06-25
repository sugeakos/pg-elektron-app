import { HttpErrorResponse } from '@angular/common/http';
import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormControl, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import {NotificationService} from 'src/app/custom-features/notification.service';
import { NotificationType } from 'src/app/enumeration/notification.type';
import { TvCategory } from 'src/app/tv-category/domain/tv-category';
import {TvCategoryService} from 'src/app/tv-category/service/tv-category.service';
import {PersonService} from 'src/app/user/service/person.service';
import {SubSink} from 'subsink';
import { Tv } from '../../domain/tv';
import {TvService} from '../../service/tv.service';

@Component({
  selector: 'app-add-tv-to-user',
  templateUrl: './add-tv-to-user.component.html',
  styleUrls: ['./add-tv-to-user.component.scss']
})
export class AddTvToUserComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  private selectedUsersEmail: string;
  public tvCategories: TvCategory[];
  public minDate: Date;
  public maxDate: Date;
  public stepMinute;
  public defaultTime: any[];
  public minTime = 9;
  public maxTime = 17;
  public validDateTime: boolean = false;
  private selectedDateTime: Date;
  public newTv: Tv;
  public emailControl: FormControl;
  public tvCatControl: FormControl = new FormControl('Válasszon márkát', [Validators.required]);
  public errorTextControl: FormControl = new FormControl('', [Validators.required]);
  public reservedDateToRepair: FormControl = new FormControl('', [Validators.required]);

  constructor(private personService: PersonService, private tvService: TvService, private tvCatService: TvCategoryService,
              private notifier: NotificationService, private route: ActivatedRoute) {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDay();

    this.minDate = new Date(currentYear - 0, currentMonth, new Date().getDate() + currentDay);
    this.maxDate = new Date(currentYear + 0, currentMonth + 3, 31);
    this.stepMinute = 10;
    this.defaultTime = [9, 0, 0];
  }


  ngOnInit(): void {
    this.subs.add(
      this.route.params.subscribe(
        (params: Params) => {
          this.selectedUsersEmail = params['email'];
        }
      )
    );
    this.getAllCategories();
    this.emailControl = new FormControl(this.selectedUsersEmail,[Validators.email, Validators.required]);
  }

  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  };

  public getAllCategories(): void {
    this.subs.add(
      this.tvCatService.getCategories().subscribe(
        (response: TvCategory[]) => {
          this.tvCategories = response;

        },
        (err: HttpErrorResponse) => {
          this.notifier.sendNotification(NotificationType.ERROR, `${err.error.message}`);
        }
      )
    );
  }
  public saveNewTv(): void {
    this.clickButton('new-tv-save');
  }

  private clickButton(buttonId: string): void {
    document.getElementById(buttonId).click();
  }
  public onAddNewTv(tvForm: NgForm): void {
    this.newTv = new Tv();
    this.newTv.personEmail = this.emailControl.value;
    this.newTv.tvCategoryDescription = this.tvCatControl.value;
    this.newTv.errorSeenByCustomer = this.errorTextControl.value;
    this.newTv.reservedDateToRepair = Date.parse(this.reservedDateToRepair.value);
    this.subs.add(
      this.tvService.addNewTv(this.newTv).subscribe(
        (response: Tv | null) => {
          if (response == null) {
            this.sendNotification(NotificationType.WARNING, `A választott időpont már foglalt. Kérem válasszon másikat.`)
          }
          if (response != null) {
            tvForm.resetForm();
            //this.router.navigateByUrl('/user/index');
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
    if(+this.selectedDateTime >= this.maxTime || +this.selectedDateTime < this.minTime) {
      this.validDateTime = false;
      this.sendNotification(NotificationType.WARNING, `Válasszon időpontot ${this.minTime} és ${this.maxTime} között`);
    } else {
      this.validDateTime = true;
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
