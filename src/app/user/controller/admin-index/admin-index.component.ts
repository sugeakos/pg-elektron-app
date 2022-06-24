import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {Subject} from 'rxjs';
import {SubSink} from 'subsink';
import {Person} from '../../domain/person';
import {Tv} from '../../../tv/domain/tv';
import {AuthenticationService} from '../../service/authentication.service';
import {PersonService} from '../../service/person.service';
import {TvService} from '../../../tv/service/tv.service';
import {
  AgChartOptions,
  CellClickedEvent,
  CellDoubleClickedEvent,
  ColDef,
  GridOptions,
  SelectionChangedEvent
} from 'ag-grid-community';
import {NotificationService} from 'src/app/custom-features/notification.service';
import {NotificationType} from 'src/app/enumeration/notification.type';
import {Router} from '@angular/router';

@Component({
  selector: 'app-admin-index',
  templateUrl: './admin-index.component.html',
  styleUrls: ['./admin-index.component.scss']
})
export class AdminIndexComponent implements OnInit, OnDestroy, AfterViewInit {
  private subs = new SubSink();
  public users: Person[];
  public selectedUser: Person;
  public tempUserSelection: Person = new Person();
  public selectedUsersTvs: Tv[];
  public updateTv = new Tv();
  public editUser = new Person();
  private currentUsername: string;

  public rowData: any[];
  public rowDataTv: any[];
  //dataGrid
  public columnDef: ColDef[] = [
    {
      headerName: 'Email', field: 'email', sortable: true, filter: 'agTextColumnFilter',
      filterParams: {
        caseSensitive: false,
        filterOptions: ['contains', 'startsWith', 'endsWith'],
        defaultOption: 'contains',
      }
    },
    {
      headerName: 'Vezeték név', field: 'lastName', sortable: true, filter: 'agTextColumnFilter',
      filterParams: {
        caseSensitive: false,
        filterOptions: ['contains', 'startsWith', 'endsWith'],
        defaultOption: 'contains',
      }
    },
    {
      headerName: 'Keresztnév', field: 'firstName', filter: 'agTextColumnFilter',
      filterParams: {
        caseSensitive: false,
        filterOptions: ['contains', 'startsWith', 'endsWith'],
        defaultOption: 'contains',
      }
    },
    {
      headerName: 'Felhasználónlv', field: 'username', filter: 'agTextColumnFilter',
      filterParams: {
        caseSensitive: false,
        filterOptions: ['contains', 'startsWith', 'endsWith'],
        defaultOption: 'contains',
      }
    }
  ];
  public colDefTv: ColDef[] = [
    {
      headerName: 'Márka', field: 'tvCategoryDescription', sortable: true, filter: 'agTextColumnFilter',
      filterParams: {
        caseSensitive: false,
        filterOptions: ['contains', 'startsWith', 'endsWith'],
        defaultOption: 'contains',
      }
    },
    {headerName: `Felhasználó által látott hiba`, field: 'errorSeenByCustomer', sortable: true},
    {headerName: 'Lefoglalt időpont', field: 'reservedDateToRepair'},
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
  public gridOptions: GridOptions = null;

  public options: AgChartOptions;

  public tvs: Tv[];

  constructor(private personService: PersonService, private authService: AuthenticationService,
              private tvService: TvService, private http: HttpClient, private notifier: NotificationService, private router: Router) {
  }


  ngAfterViewInit(): void {

  }


  ngOnInit(): void {
    this.getAllTvs();
    this.gridOptions = {
      rowSelection: 'single',
      animateRows: true,
      pagination: true,
      paginationAutoPageSize: true,
      onCellClicked: (event: CellClickedEvent) => {
        this.selectedUser = event.data;
        this.onSelectUser(this.selectedUser);
        this.getUserTvs();
      }
    };
    this.getAllUsers();
    this.selectedUser = new Person();
    this.selectedUsersTvs = new Array();
  }


  public onTvGridCellClicked(e: CellClickedEvent): void {
    this.onEditTvByAdmin(e.data);
  }

  public getAllUsers(): void {
    this.subs.add(
      this.personService.getUsers().subscribe(
        (response: Person[]) => {

          //this.users = response;
          this.rowData = response;
        },
        (error: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, error.error.message);
        }
      )
    );
  }

  public getAllTvs(): void {
    this.subs.add(
      this.tvService.fetchAllTvs().subscribe(
        (response: Tv[]) => {
          this.tvs = response;
        },
        (error: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, "Hiba történt");
        }
      )
    );
  }

  public onSelectUser(selectedUser: Person): void {
    this.selectedUser = selectedUser;
    this.getUserTvs();
    this.clickButton('openUserInfo');
  }

  public getUserTvs(): void {
    this.subs.add(
      this.tvService.getTvsByUsersEmail(this.selectedUser.email).subscribe(
        (response: Tv[]) => {

          this.selectedUsersTvs = response;
          this.rowDataTv = response;
        },
        (error: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, error.error.message);
        }
      )
    );

  }

  public cellContextMenu(e): void {
    this.selectedUser = e.data;
    this.onCreateTvToSelectedUser(this.selectedUser);
  }

  public onCreateTvToSelectedUser(selectedUser: Person) {
    this.router.navigateByUrl(`/tv/create/${selectedUser.email}`);
  }

  public onEditUserByAdmin(user: Person): void {
    this.editUser = user;
    this.currentUsername = user.username

    this.clickButton('openUserEdit');
  }

  public onUpdateUserByAdmin(updatedPerson: Person): void {

    this.editUser.password = '';
    console.log(this.editUser);
    this.subs.add(
      this.personService.updateUser(this.editUser, this.currentUsername).subscribe(
        (response: Person) => {
          this.clickButton('closeEditUserModalButton');
          console.log(response);
          this.getAllUsers();
          this.sendNotification(NotificationType.SUCCESS, `${response.firstName} adatai sikeresn frissítve lettek.`);
          this.currentUsername = null;
        },
        (err: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, err.error.message);
        }
      )
    );

  }

  public onEditTvByAdmin(tv: Tv): void {
    this.updateTv = tv;
    this.clickButton('openTvEdit');
  }

  public onUpdateTvByAdmin(): void {
    //const formData = this.tvService.updateTvByAdminForm(this.updateTv, this.updateTv.repairedError, this.updateTv.price);
    this.subs.add(
      this.tvService.updateTvByAdmin(this.updateTv).subscribe(
        (response: Tv) => {
          console.log(response);
          this.clickButton('closeEditTvModalButton');
          this.getUserTvs();
        },
        (err: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, `${err.error.message}`);
        }
      )
    );
  }

  private clickButton(buttonId: string): void {
    document.getElementById(buttonId).click();
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
