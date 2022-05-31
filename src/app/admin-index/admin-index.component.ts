import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {SubSink} from 'subsink';
import {Person} from '../domain/person/person';
import { Tv } from '../domain/tv/tv';
import {AuthenticationService} from '../service/authentication/authentication.service';
import {PersonService} from '../service/person/person.service';
import { TvService } from '../service/tv/tv.service';

@Component({
  selector: 'app-admin-index',
  templateUrl: './admin-index.component.html',
  styleUrls: ['./admin-index.component.css']
})
export class AdminIndexComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  public users: Person[];
  public selectedUser: Person;
  public selectedUsersTvs: Tv[];
  public updateTv = new Tv();
  constructor(private personService: PersonService, private authService: AuthenticationService,
              private tvService: TvService) {
  }



  ngOnInit(): void {
    this.getAllUsers();
    this.selectedUser = new Person();
    this.selectedUsersTvs = new Array();
  }

  public getAllUsers(): void {
    this.subs.add(
      this.personService.getUsers().subscribe(
        (response: Person[]) => {
          this.personService.addUsersToLocalCache(response);
          this.users = response;
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
          this.tvService.addTvsToLocalCache(response);
          this.selectedUsersTvs = response;

          console.log(response);
        },
        (error: HttpErrorResponse) => {
          console.log(error.error.message);
        }
      )
    );

  }

  public onEditTvByAdmin(tv: Tv): void {
    this.updateTv = tv;
    this.clickButton('openTvEdit');
  }
  public onUpdateTvByAdmin(): void {
    const formData = this.tvService.updateTvByAdminForm(this.updateTv,this.updateTv.repairedError,this.updateTv.price);
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
