import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CustomHttpResponse} from 'src/app/domain/custom-http-response/custom-http-response';
import {Person} from 'src/app/domain/person/person';
import {environment} from 'src/environments/environment';

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

  public addUser(formData: FormData): Observable<Person | HttpErrorResponse> {
    return this.http.post<Person>(`${this.host}/person/add`, formData);
  }

  public updateUser(formData: FormData): Observable<Person | HttpErrorResponse> {
    return this.http.post<Person>(`${this.host}/person/update`, formData);
  }

  public resetPassword(email: string): Observable<CustomHttpResponse | HttpErrorResponse> {
    return this.http.get<CustomHttpResponse>(`${this.host}/person/reset-password/${email}`);
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

  // public createPersonUpdateFormData(loggedInUsername: string, user: Person): FormData {
  //   const formData = new FormData();
  //   formData.append('currentUsername', loggedInUsername);
  //   formData.append('firstName', user.firstName);
  //   formData.append('lastName', user.lastName);
  //   formData.append('username', user.username);
  //   formData.append('email', user.email);
  //   formData.append('firstName', user.firstName);
  //   formData.append('firstName', user.firstName);
  //   formData.append('firstName', user.firstName);
  //   formData.append('firstName', user.firstName);
  //   formData.append('firstName', user.firstName);
  //   formData.append('firstName', user.firstName);
  //   formData.append('firstName', user.firstName);
  //
  // }
}