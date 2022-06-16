import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {Subject} from 'rxjs';
import {SubSink} from 'subsink';
import {Person} from '../../domain/person';
import {Tv} from '../../../tv/domain/tv';
import {AuthenticationService} from '../../service/authentication.service';
import {PersonService} from '../../service/person.service';
import {TvService} from '../../../tv/service/tv.service';

@Component({
  selector: 'app-admin-index',
  templateUrl: './admin-index.component.html',
  styleUrls: ['./admin-index.component.scss']
})
export class AdminIndexComponent implements OnInit, OnDestroy, AfterViewInit {
  private subs = new SubSink();
  public users: Person[];
  public selectedUser: Person;
  public selectedUsersTvs: Tv[];
  public updateTv = new Tv();

  public editUser = new Person();
  private currentUsername: string;

  //datatable
  public displayedColumns: string[] = ['name', 'email', 'username'];
  public dataSource: any;

  constructor(private personService: PersonService, private authService: AuthenticationService,
              private tvService: TvService, private http: HttpClient) {
  }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
    }



  ngOnInit(): void {
    this.getAllUsers();
    this.selectedUser = new Person();
    this.selectedUsersTvs = new Array();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public getAllUsers(): void {
    this.subs.add(
      this.personService.getUsers().subscribe(
        (response: Person[]) => {
          this.personService.addUsersToLocalCache(response);
          this.users = response;
          this.dataSource = new MatTableDataSource(response);
        },
        (error: HttpErrorResponse) => {
          console.log(error.error.message);
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

          console.log(response);
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
    const formData = this.personService.createPersonFormData(this.selectedUser.username,editUserForm.value);
    this.subs.add(
      this.personService.updateUser(formData).subscribe(
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
    const formData = this.tvService.updateTvByAdminForm(this.updateTv, this.updateTv.repairedError, this.updateTv.price);
    this.subs.add(
      this.tvService.updateTvByAdmin(formData).subscribe(
        (response: Tv) => {
          console.log(response);
          this.clickButton('closeEditTvModalButton');
          this.getUserTvs();
        },
        (err: HttpErrorResponse) => {
          console.log(err.error.message);
        }
      )
    );
  }

  private clickButton(buttonId: string): void {
    document.getElementById(buttonId).click();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();

  }



}
