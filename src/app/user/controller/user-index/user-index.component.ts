import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
import {CellClickedEvent, CellDoubleClickedEvent, ColDef, GridApi, GridReadyEvent} from 'ag-grid-community';
import {AgGridAngular} from 'ag-grid-angular'
import {NotificationService} from 'src/app/custom-features/notification.service';
import {NotificationType} from 'src/app/enumeration/notification.type';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css';

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
})
export class UserIndexComponent implements OnInit, OnDestroy, AfterViewInit {

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
  public rowData: any[];
  public rowStyle: string | string[];
  //dataGrid
  public columnDef: ColDef[] = [
    {headerName: 'Brend', field: 'tvCategoryDescription', sortable: true},
    {headerName: `Felhasználó által látott hiba`, field: 'errorSeenByCustomer'},
    {headerName: 'Lefoglalt időpont', field: 'reservedDateToRepair', sortable: true},
    {headerName: 'Javítás időpontja', field: 'dateOfCorrection'},
    {headerName: 'Javított hiba', field: 'repairedError'},
    {headerName: 'Javítás ára', field: 'price'},
    {headerName: 'Javítás alatt áll', field: 'isItStillInProgress'}
  ];

  public defaultColDef: ColDef = {
    flex: 100,
    width: 200,
    sortable: true,
    filter: true,
  };
  private gridApi!: GridApi;


  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  constructor(private personServie: PersonService, private authService: AuthenticationService, private router: Router,
              private tvService: TvService, private tvCatService: TvCategoryService, private http: HttpClient,
              private notifier: NotificationService) {
  }


  ngOnInit(): void {
    this.loggedInUsersTvs = [];
    this.loggedInUser = this.authService.getUserFromLocalCache();
    this.getAllCategories();
    this.getUserTvs();
    this.selectedTv = null;
  }



  ngAfterViewInit(): void {

  }

  //DataGrid
  public onGridReady(params: GridReadyEvent) {
    //this.rowData = this.loggedInUsersTvs;
    this.agGrid.api.setRowData(this.rowData);
  }

  public onCellClicked(e: CellClickedEvent): void {
    this.selectedTv = e.data;
    this.onSelectTv(this.selectedTv);
  }

  public cellContextMenu(e: CellDoubleClickedEvent): void {
    this.selectedTv = e.data;
    this.onUpdateSelectedTv(this.selectedTv);
  }

  public clearSelection(): void {

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
          this.rowData = response;


          if (response.length > 0) {
            this.sendNotification(NotificationType.SUCCESS, `Sikeresen be lett olvasva ${response.length} tv.`);
          } else {
            this.sendNotification(NotificationType.INFO, `Még nincs hozzárendelve TV a profiljához.`);
          }

        },
        (error: HttpErrorResponse) => {
          console.log(error.error.message);
          this.sendNotification(NotificationType.ERROR, error.error.message);
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
    this.sendNotification(NotificationType.WARNING, 'Sikeresen kijelentkezett.');
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
