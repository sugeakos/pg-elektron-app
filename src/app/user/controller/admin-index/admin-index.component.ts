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
  CellClickedEvent,
  CellDoubleClickedEvent,
  ColDef,
  GridOptions,
  GridReadyEvent,
  SelectionChangedEvent
} from 'ag-grid-community';
import {ChartOptions, ChartType, ChartDataset, Color} from 'chart.js';

import {NotificationService} from 'src/app/custom-features/notification.service';
import {NotificationType} from 'src/app/enumeration/notification.type';
import {Router} from '@angular/router';
import {Label} from 'ag-charts-community/dist/cjs/es5/chart/label';


@Component({
  selector: 'app-admin-index',
  templateUrl: './admin-index.component.html',
  styleUrls: ['./admin-index.component.scss']
})
export class AdminIndexComponent implements OnInit, OnDestroy, AfterViewInit {
  private subs = new SubSink();
  public tvs: any[] = new Array();
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
      headerName: 'Vezetéknév', field: 'lastName', sortable: true, filter: 'agTextColumnFilter',
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
      headerName: 'Felhasználónév', field: 'username', filter: 'agTextColumnFilter',
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
    {
      headerName: 'Javított hiba', field: 'repairedError', filter: 'agTextColumnFilter',
      filterParams: {
        caseSensitive: false,
        filterOptions: ['contains', 'startsWith', 'endsWith'],
        defaultOption: 'contains',
      }
    },
    {headerName: 'Javítás ára', field: 'price'}

  ];
  public defaultColDef: ColDef = {
    flex: 100,
    width: 200,
    sortable: true,
    filter: true,
  };
  public gridOptions: GridOptions = null;
  //chart start

  public lg: number ;
  public samsung: number ;
  public toshiba: number ;
  public philips: number ;
  public vox: number ;
  public colossus: number ;
  public vivax: number;
  public fox: number;
  public tesla: number ;
  public telefunken: number;
  public egyeb: number;
  private year: number = +new Date().getFullYear();
  public showChart: boolean;

  public barChartOptions: ChartOptions = {
    responsive: true,

  };

  public barChartLabels: string[] = ['Samsung', 'LG', 'Toshiba', 'Philips', 'Vox', 'Colossus', 'Fox', 'Vivax', 'Tesla', 'Telefunken', 'Egyéb'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartData: ChartDataset[];

  //chart end
  public counter: number;

  constructor(private personService: PersonService, private authService: AuthenticationService,
              private tvService: TvService, private http: HttpClient, private notifier: NotificationService, private router: Router) {

  }


  ngAfterViewInit(): void {
    this.getChart();
  }


  ngOnInit(): void {
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
    //this.getAllTvs();
    this.showChart = false;

  }


  public onTvGridCellClicked(e: CellClickedEvent): void {
    this.onEditTvByAdmin(e.data);
  }

  public getAllUsers(): void {
    this.subs.add(
      this.personService.getUsers().subscribe(
        (response: Person[]) => {
          this.rowData = response;

        },
        (error: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, error.error.message);
        }
      )
    );
  }

  public getChart(): void {
    this.fox = 0;
    this.lg = 0;
    this.samsung = 0;
    this.toshiba= 0;
    this.philips = 0;
    this.vox = 0;
    this.colossus = 0;
    this.vivax =0;
    this.tesla = 0;
    this.telefunken = 0;
    this.egyeb = 0;
    this.getAllTvs();
    if (this.tvs.length != 0) {
      this.showChart = true;

      for (const responseElement of this.tvs) {
        switch (responseElement.tvCategoryDescription.trim()) {
          case 'Fox': {
            this.fox++;
            break;
          }
          case 'LG':
            this.lg++;
            break;
          case 'Samsung':
            this.samsung++;
            break;
          case 'Toshiba':
            this.toshiba++;
            break;

          case 'Philips':
            this.philips++;
            break;
          case 'Vox':
            this.vox++;
            break;
          case 'Colossus':
            this.colossus++;
            break;
          case 'Vivax':
            this.vivax++;
            break;

          case 'Tesla':
            this.tesla++;
            break;
          case 'Telefunken':
            this.telefunken++;
            break;
          default :
            this.egyeb++;
            break;
        }

      }

      this.barChartData = [
        {
          data: [
            this.samsung,
            this.lg,
            this.toshiba,
            this.philips,
            this.vox,
            this.colossus,
            this.fox,
            this.vivax,
            this.tesla,
            this.telefunken,
            this.egyeb
          ], label: 'Márkák',
          backgroundColor: '#6ea6d7',
          hoverBackgroundColor: 'rgba(85,189,215,0.58)',
        },
      ];

    }

  }

  public getAllTvs(): void {
    this.subs.add(
      this.tvService.fetchAllTvs().subscribe(
        (response: Tv[]) => {
          this.tvs = response;

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

  public onGridReady($event: GridReadyEvent) {
    this.getAllTvs();
  }

  public onEditTvByAdmin(tv: Tv): void {
    this.updateTv = tv;
    this.clickButton('openTvEdit');
  }

  public onUpdateTvByAdmin(): void {

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
