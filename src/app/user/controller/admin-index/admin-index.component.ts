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
import {CellClickedEvent, CellDoubleClickedEvent, ColDef, GridOptions, SelectionChangedEvent} from 'ag-grid-community';
import {NotificationService} from 'src/app/custom-features/notification.service';
import { NotificationType } from 'src/app/enumeration/notification.type';

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
    {field: 'email', sortable: true},
    {field: 'lastName', sortable: true},
    {field: 'firstName'},
    {field: 'username'}
  ];
  public colDefTv: ColDef[] = [
    {headerName: 'Brend', field: 'tvCategoryDescription', sortable: true},
    {headerName: `Felhasználó által látott hiba`, field: 'errorSeenByCustomer'},
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

  constructor(private personService: PersonService, private authService: AuthenticationService,
              private tvService: TvService, private http: HttpClient, private notifier: NotificationService) {
  }


  ngAfterViewInit(): void {

  }


  ngOnInit(): void {
    this.gridOptions = {
      rowSelection: 'single',
      animateRows: true,
      // onSelectionChanged: (event: SelectionChangedEvent) => {
      //   event.api.getSelectedRows();
      //
      // },
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
          this.personService.addUsersToLocalCache(response);
          this.users = response;
          this.rowData = response;

        },
        (error: HttpErrorResponse) => {

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
          console.log(error.error.message);
        }
      )
    );

  }

  public onEditUserByAdmin(user: Person): void {
    this.editUser = user;
    this.clickButton('openUserEdit');
  }

  public onUpdateUserByAdmin(editUserForm: NgForm): void {
    //const formData = this.personService.createPersonFormData(this.selectedUser.username,editUserForm.value);
    this.subs.add(
      this.personService.updateUser(editUserForm.value).subscribe(
        (response: Person) => {
          this.clickButton('closeEditUserModalButton');
          this.getAllUsers();
          window.location.reload();
        },
        (err: HttpErrorResponse) => {
          console.log(err.error.message);
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
          this.sendNotification(NotificationType.ERROR,`${err.error.message}`);
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
