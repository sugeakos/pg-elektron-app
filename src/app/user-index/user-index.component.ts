import {HttpErrorResponse} from '@angular/common/http';
import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {SubSink} from 'subsink';
import {Person} from '../domain/person/person';
import {Tv} from '../domain/tv/tv';
import {TvCategory} from '../domain/tv-category/tv-category';
import {Role} from '../enumeration/role.enum';
import {AuthenticationService} from '../service/authentication/authentication.service';
import {PersonService} from '../service/person/person.service';
import {TvService} from '../service/tv/tv.service';
import {TvCategoryService} from '../service/tv-category/tv-category.service';
import {NgForm} from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
//
// import {
//   MAT_MOMENT_DATE_FORMATS,
//   MomentDateAdapter,
//   MAT_MOMENT_DATE_ADAPTER_OPTIONS,
// } from '@angular/material-moment-adapter';
// import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
// import 'moment/locale/ja';
// import 'moment/locale/fr';
// import 'moment/locale/hu';
// private _adapter: DateAdapter<any>,
// @Inject(MAT_DATE_LOCALE) private _locale: string
//

@Component({
  selector: 'app-user-index',
  templateUrl: './user-index.component.html',
  styleUrls: ['./user-index.component.css'],
  // providers:[
  //   {provide: MAT_DATE_LOCALE, useValue:'hu-HU'},
  //   {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],},
  //   {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  // ],
})
export class UserIndexComponent implements OnInit, OnDestroy {

  private subs = new SubSink();
  public loggedInUser: Person; //logged in user
  public loggedInUsersTvs: Tv[];
  public tvCategory: string;
  public selectedTv: Tv;
  public editUser = new Person();
  private currentUsername: string;
  public isStillInProgress: boolean;
  public reservedTime: string;
  public tvCategories: TvCategory[];

  constructor(private personServie: PersonService, private authService: AuthenticationService, private router: Router,
              private tvService: TvService, private tvCatService: TvCategoryService, ) {
  }


  ngOnInit(): void {
    this.loggedInUser = this.authService.getUserFromLocalCache();
    this.getAllCategories();
    this.getUserTvs();
  }
  // public hungarian(): void {
  //   this._locale = 'hu';
  //   this._adapter.setLocale(this._locale);
  // }
  public myFilter = (d: Date): boolean => {
    const day = d.getUTCDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 5 && day !== 6;
  }

  private getUserRole(): string {
    return this.authService.getUserFromLocalCache().role;
  }

  public get isAdmin(): boolean {
    return this.getUserRole() === Role.ADMIN || this.getUserRole() === Role.SUPER_ADMIN;
  }

  public get isManager(): boolean {
    return this.isAdmin || this.getUserRole() === Role.MANAGER;
  }

  public get isAdminOrManager(): boolean {
    return this.isAdmin || this.isManager;
  }

  public getUserTvs(): void {
    this.subs.add(
      this.tvService.getTvsByUsersEmail(this.loggedInUser.email).subscribe(
        (response: Tv[]) => {
          this.tvService.addTvsToLocalCache(response);
          this.loggedInUsersTvs = response;

          //console.log(response);
        },
        (error: HttpErrorResponse) => {
          console.log(error.error.message);
        }
      )
    );

  }

  public getAllCategories(): void {
    this.subs.add(
      this.tvCatService.getCategories().subscribe(
        (response: TvCategory[]) => {
          this.tvCategories = response;
          console.log(response);
        },
        (err: HttpErrorResponse) => {
          console.log(err.error.message);
        }
      )
    );
  }

  public onAddNewTv(tvForm: NgForm): void {
    const formData = this.tvService.createNewTvFormData(this.loggedInUser.email, tvForm.value);
    this.subs.add(
      this.tvService.addNewTv(formData).subscribe(
        (response: Tv) => {
          this.clickButton('new-tv-close');
          this.getUserTvs();
          tvForm.reset();
        },
        (err: HttpErrorResponse) => {
          tvForm.reset();
          console.log(err.error.message);
          this.clickButton('new-tv-close');
        }
      )
    );
  }

  public onSelectTv(selectedTv: Tv): void {
    this.selectedTv = selectedTv;
    this.clickButton('openTvInfo');
  }

  public onUpdateTv(updateTvForm: NgForm): void {
    const formData = this.tvService.updateTvFormDate(this.selectedTv.externalId,updateTvForm.value);
    this.subs.add(
      this.tvService.addNewTv(formData).subscribe(
        (response: Tv) => {
          this.clickButton('new-tv-close');
          this.getUserTvs();
          updateTvForm.reset();
        },
        (err: HttpErrorResponse) => {
          updateTvForm.reset();
          console.log(err.error.message);
          this.clickButton('new-tv-close');
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

  public isItInProgress(inProgress: boolean): boolean {
    return this.isStillInProgress = inProgress;
  }

  public onLogOut(): void {
    this.authService.logout();
    this.router.navigate(['/index']);

  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }



}
