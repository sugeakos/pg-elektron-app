import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {JwtHelperService} from "@auth0/angular-jwt";
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Person} from '../../user/domain/person';
import {Observable} from 'rxjs';
import { Role } from '../../enumeration/role.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public host = environment.apiUrl;
  private token: string;
  private loggedInUsername: string;
  private jwtHelper = new JwtHelperService();


  constructor(private http: HttpClient) {
  }

  public login(user: Person): Observable<HttpResponse<Person>> {
    return this.http.post<Person>(`${this.host}/login`, user, {observe: 'response'});
  }

  public register(user: Person): Observable<Person> {
    return this.http.post<Person>(`${this.host}/registration`, user);
  }

  public logout(): void {
    this.token = null;
    this.loggedInUsername = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  public saveTokenToLocalStorage(token: string): void {
    this.token = token;
    localStorage.setItem('token',token);
  }

  public addUserToLocalCache(user: Person): void {
    localStorage.setItem('user', JSON.stringify(user));
  }


  public getUserFromLocalCache(): Person {
    return JSON.parse(localStorage.getItem('user'));
  }

  public loadToken(): void {
    this.token = localStorage.getItem('token');
  }
  
  public getToken(): string {
    return this.token;
  }

  public isLoggedIn(): boolean {
    this.loadToken();
    if ((this.token != null && this.token !== '')
      && (this.jwtHelper.decodeToken(this.token).sub != null || '')
      && (!this.jwtHelper.isTokenExpired(this.token) )) {
      this.loggedInUsername = this.jwtHelper.decodeToken(this.token).sub;
      return true;
    } else {
      this.logout();
      return false;
    }

  }

  private getUserRole(): string {
    return this.getUserFromLocalCache().role;
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


  public isAdminLoggedIn(): boolean {
    if (this.isLoggedIn() && this.isAdmin) {
      return true
    } else {
      return false;
    }

  }
}
