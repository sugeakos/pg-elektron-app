import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnDestroy, OnInit} from '@angular/core';
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

@Component({
  selector: 'app-user-index',
  templateUrl: './user-index.component.html',
  styleUrls: ['./user-index.component.css']
})
export class UserIndexComponent implements OnInit, OnDestroy {

  private subs = new SubSink();
  private titleSubject = new BehaviorSubject<string>('TVs');
  public titleAction$ = this.titleSubject.asObservable();
  public loggedInUser: Person; //logged in user
  public loggedInUsersTvs: Tv[];
  public tvCategory: string;
  public selectedTv: Tv;
  public editUser = new Person();
  private currentUsername: string;
  public isStillInProgress: boolean;

  constructor(private personServie: PersonService, private authService: AuthenticationService, private router: Router,
              private tvService: TvService) {
  }


  ngOnInit(): void {
    this.loggedInUser = this.authService.getUserFromLocalCache();

    this.getUserTvs();
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

  

  public isItInProgress(inProgress: boolean): boolean{
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
