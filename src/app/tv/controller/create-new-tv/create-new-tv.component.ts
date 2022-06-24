import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, NgForm, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {DlDateTimePickerChange} from 'angular-bootstrap-datetimepicker';
import {NotificationService} from 'src/app/custom-features/notification.service';
import {NotificationType} from 'src/app/enumeration/notification.type';
import {TvCategory} from 'src/app/tv-category/domain/tv-category';
import {TvCategoryService} from 'src/app/tv-category/service/tv-category.service';
import {Person} from 'src/app/user/domain/person';
import {AuthenticationService} from 'src/app/user/service/authentication.service';
import {PersonService} from 'src/app/user/service/person.service';
import {SubSink} from 'subsink';
import {Tv} from '../../domain/tv';
import {TvService} from '../../service/tv.service';

@Component({
  selector: 'app-create-new-tv',
  templateUrl: './create-new-tv.component.html',
  styleUrls: ['./create-new-tv.component.scss']
})
export class CreateNewTvComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  public loggedInUser: Person; //logged in user
  public tvCategory: string;
  public tvCategories: TvCategory[];
  public newTv: Tv;
  public loggedInUsersEmail: string;

  public minDate: Date;
  public maxDate: Date;
  public stepMinute;
  public defaultTime: any[];
  public minTime = 9;
  public maxTime = 16;
  public validDateTime: boolean = false;
  private emailRegex = '^(?=.{1,64}@)[A-Za-z0-9_-]+(.[A-Za-z0-9_-]+)*@[^-][A-Za-z0-9-]+(.[A-Za-z0-9-]+)*(.[A-Za-z]{2,})$';
  private selectedDateTime: Date;
  public emailControl: FormControl;
  public tvCatControl: FormControl = new FormControl('Válasszon márkát', [Validators.required]);
  public errorTextControl: FormControl = new FormControl('', [Validators.required]);
  public reservedDateToRepair: FormControl = new FormControl('', [Validators.required]);

  constructor(private personService: PersonService, private authService: AuthenticationService, private tvService: TvService,
              private tvCatService: TvCategoryService, private router: Router, private notifier: NotificationService) {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    this.minDate = new Date(currentYear - 0, currentMonth, new Date().getDate() );
    this.maxDate = new Date(currentYear + 0, currentMonth + 3, 31);
    this.stepMinute = 10;
    this.defaultTime = [9, 0, 0];

  }

  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  };

  ngOnInit(): void {
    this.loggedInUser = this.authService.getUserFromLocalCache();
    this.loggedInUsersEmail = this.loggedInUser.email;
    this.emailControl = new FormControl(this.loggedInUsersEmail, [Validators.required, Validators.email, Validators.pattern(this.emailRegex)]);
    this.getAllCategories();
  }

  public getAllCategories(): void {
    this.subs.add(
      this.tvCatService.getCategories().subscribe(
        (response: TvCategory[]) => {
          this.tvCategories = response;

        },
        (err: HttpErrorResponse) => {
          console.log(err.error.message);
        }
      )
    );
  }

  public onAddNewTv(tvForm: NgForm): void {
    this.newTv = new Tv();
    this.newTv.personEmail = this.emailControl.value;
    this.newTv.tvCategoryDescription = this.tvCatControl.value;
    this.newTv.errorSeenByCustomer = this.errorTextControl.value;
    this.newTv.reservedDateToRepair = Date.parse(this.reservedDateToRepair.value);
      this.subs.add(
        this.tvService.addNewTv(this.newTv).subscribe(
          (response: Tv) => {
            tvForm.resetForm();
            //this.router.navigateByUrl('/user/index');
            this.sendNotification(NotificationType.SUCCESS, `Sikeresen lefoglalta az időpontot.`);
          },
          (err: HttpErrorResponse) => {
            tvForm.reset();
            this.sendNotification(NotificationType.ERROR, `Hiba történt, próbálja meg később`);
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
