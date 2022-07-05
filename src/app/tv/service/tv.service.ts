import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { Tv } from '../domain/tv';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../../user/service/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class TvService {
  public host = environment.apiUrl;
  private jwtHelper = new JwtHelperService();
  private loggedInUsername: string;

  constructor(private http: HttpClient, private authService: AuthenticationService) { }


  public getTvsByUsersEmail(email: string): Observable<Tv[]> {
    return this.http.get<Tv[]>(`${this.host}/tv/${email}`);
  }
  public getNotRepairedTvsByUsersEmail(email: string): Observable<Tv[]> {
    return this.http.get<Tv[]>(`${this.host}/tv/not-repaired-yet/${email}`);
  }

  public addNewTv(tv: Tv): Observable<Tv | HttpErrorResponse | null> {
    return this.http.post<Tv>(`${this.host}/tv/new`, tv);
  }

  public updateTvByAdmin(tv: Tv): Observable<Tv | HttpErrorResponse> {
    return this.http.post<Tv>(`${this.host}/tv/update`, tv);
  }

  public fetchAllTvs(): Observable<Tv[]> {
    return this.http.get<Tv[]>(`${this.host}/tv/all-tv`);
  }

  public updateReservedDate(tv: Tv): Observable<Tv | HttpErrorResponse | null> {
    return this.http.post<Tv>(`${this.host}/tv/update-reserved-date`,tv);
  }

  public findATv(id: string): Observable<Tv | HttpErrorResponse> {
    return this.http.get<Tv>(`${this.host}/tv/find/${id}`);
  }
}
