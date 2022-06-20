import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {AsyncSubject, Observable, Subject} from 'rxjs';
import {SubSink} from 'subsink';
import {Person} from '../../domain/person';
import {Tv} from '../../../tv/domain/tv';
import {TvCategory} from '../../../tv-category/domain/tv-category';
import {Role} from '../../../enumeration/role.enum';
import {AuthenticationService} from '../../service/authentication.service';
import {PersonService} from '../../service/person.service';
import {TvService} from '../../../tv/service/tv.service';
import {TvCategoryService} from '../../../tv-category/service/tv-category.service';
import {NgForm} from '@angular/forms';
import {ThemePalette} from '@angular/material/core';
import {CellClickedEvent, ColDef, GridReadyEvent} from 'ag-grid-community';
import {AgGridAngular} from 'ag-grid-angular'
import { NotificationService } from 'src/app/custom-features/notification.service';
import { NotificationType } from 'src/app/enumeration/notification.type';
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
  styleUrls: ['./user-index.component.scss'],
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
  public rowData$: any[];
  //dataGrid
  public columnDefs: ColDef[] = [
    {headerName: 'ID', field: 'externalId', sortable: true},
    {headerName: 'Customer', field: 'personEmail', sortable: true},
    {headerName: 'Brand', field: 'tvCategoryDescription', sortable: true},
    {headerName: 'Error', field: 'errorSeenByCustomer'},
    {headerName: 'Reserved Date', field: 'reservedDateToRepair'},
    {headerName: 'Date of Correction', field: 'dateOfCorrection'},
    {headerName: 'Repaired Error', field: 'repairedError'},
    {headerName: 'Price', field: 'price'},
    {headerName: 'In progress', field: 'isItStillInProgress'},
  ];

  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
  };

  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  constructor(private personServie: PersonService, private authService: AuthenticationService, private router: Router,
              private tvService: TvService, private tvCatService: TvCategoryService, private http: HttpClient,
              private notifier: NotificationService) {
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

  //DataGrid
  public onGridReady(params: GridReadyEvent) {
    //this.rowData$ = this.tvService.fetchAllTvs();


  }

  public onCellClicked(e: CellClickedEvent): void {
    console.log('cellClicked', e);
  }

  public clearSelection(): void {
    this.agGrid.api.deselectAll();
  }

  //DataGridEnd
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
          this.loggedInUsersTvs = response;

        //   this.rowData$ = [
        //     {externalId: response[0].externalId,
        //       personEmail: response[0].personEmail,
        //       tvCategoryDescription: response[0].tvCategoryDescription,
        //       errorSeenByCustomer: response[0].errorSeenByCustomer,
        //       reservedDateToRepair: response[0].reservedDateToRepair,
        //       dateOfCorrection: response[0].dateOfCorrection,
        //       repairedError: response[0].repairedError,
        //       price: response[0].price,
        //       itStillInProgress: response[0].isItStillInProgress
        //
        //     },
        //     {externalId: response[1].externalId,
        //       personEmail: response[1].personEmail,
        //       tvCategoryDescription: response[1].tvCategoryDescription,
        //       errorSeenByCustomer: response[1].errorSeenByCustomer,
        //       reservedDateToRepair: response[1].reservedDateToRepair,
        //       dateOfCorrection: response[1].dateOfCorrection,
        //       repairedError: response[1].repairedError,
        //       price: response[1].price,
        //       itStillInProgress: response[1].isItStillInProgress,
        //
        //     },
        //   ];
        // console.log(this.rowData$);
          if(response.length > 0){
            this.sendNotification(NotificationType.SUCCESS,`Sikeresen be lett olvasva ${response.length} tv.`);
          } else {
            this.sendNotification(NotificationType.INFO,`Még nincs hozzárendelve TV a profiljához.`);
          }

        },
        (error: HttpErrorResponse) => {
          console.log(error.error.message);
          this.sendNotification(NotificationType.ERROR,error.error.message);
        }
      )
    );

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



  public onSelectTv(selectedTv: Tv): void {
    this.selectedTv = selectedTv;
    this.clickButton('openTvInfo');
    this.sendNotification(NotificationType.INFO,"asda");
  }

  // public onUpdateTv(updateTvForm: NgForm): void {
  //   const formData = this.tvService.updateTvFormDate(this.selectedTv.externalId, updateTvForm.value);
  //   this.subs.add(
  //     this.tvService.addNewTv(formData).subscribe(
  //       (response: Tv) => {
  //         this.clickButton('new-tv-close');
  //         this.getUserTvs();
  //         updateTvForm.reset();
  //       },
  //       (err: HttpErrorResponse) => {
  //         updateTvForm.reset();
  //         console.log(err.error.message);
  //         this.clickButton('new-tv-close');
  //       }
  //     )
  //   );
  // }

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
    this.sendNotification(NotificationType.WARNING,'Sikeresen kijelentkezett.');
  }

  public onUpdateSelectedTv(tv: Tv): void {
    this.router.navigateByUrl(`/tv/update/${tv.externalId}`);
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
