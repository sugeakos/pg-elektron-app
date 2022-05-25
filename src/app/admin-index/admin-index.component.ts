import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {SubSink} from 'subsink';
import {Person} from '../domain/person/person';
import {AuthenticationService} from '../service/authentication/authentication.service';
import {PersonService} from '../service/person/person.service';

@Component({
  selector: 'app-admin-index',
  templateUrl: './admin-index.component.html',
  styleUrls: ['./admin-index.component.css']
})
export class AdminIndexComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  public users: Person[];

  constructor(private personService: PersonService, private authService: AuthenticationService) {
  }



  ngOnInit(): void {
    this.getAllUsers();
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

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
