import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CustomHttpResponse} from '../../domain/custom-http-response/custom-http-response';
import {Person} from '../../user/domain/person'
import {environment} from '../../../environments/environment';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  public getUsers(): Observable<Person[] | HttpErrorResponse> {
    return this.http.get<Person[]>(`${this.host}/person/list`);
  }

  public addUser(person: Person): Observable<Person | HttpErrorResponse> {
    return this.http.post<Person>(`${this.host}/person/add`, person);
  }

  public updateUser(person: Person, currentUsername: string): Observable<Person | HttpErrorResponse> {
    return this.http.post<Person>(`${this.host}/person/update/${currentUsername}`, person);
  }

  public resetPassword(email: string): Observable<CustomHttpResponse | HttpErrorResponse> {
    return this.http.get<CustomHttpResponse>(`${this.host}/person/reset-password/${email}`);
  }

  public verifyEmailAddress(code: string): Observable<CustomHttpResponse | HttpErrorResponse> {
    return this.http.get<CustomHttpResponse>(`${this.host}/verify/${code}`);
  }

  public addUsersToLocalCache(users: Person[]): void {
    localStorage.setItem('users', JSON.stringify(users));
  }

  public getUsersFromLocalCache(): Person[] {
    if (localStorage.getItem('users')) {
      return JSON.parse(localStorage.getItem('users'));
    } else {
      return null;
    }
  }
  
}
