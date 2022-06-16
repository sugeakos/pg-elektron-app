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

  public addNewTv(formData: FormData): Observable<Tv | HttpErrorResponse> {
    return this.http.post<Tv>(`${this.host}/tv/new`, formData);
  }

  public updateTvByAdmin(formData: FormData): Observable<Tv | HttpErrorResponse> {
    return this.http.post<Tv>(`${this.host}/tv/update`, formData);
  }

  public fetchAllTvs(): Observable<Tv[]> {
    return this.http.get<Tv[]>(`${this.host}/tv/all-tv`);
  }

  public createNewTvFormData(loggedInUsersEmal: string, tv: Tv): FormData {
    const formData = new FormData();
    formData.append('personEmail', loggedInUsersEmal);
    formData.append('tvCategoryDescription', tv.tvCategoryDescription);
    formData.append('errorSeenByCustomer',tv.errorSeenByCustomer);
    formData.append('reservedDateToRepair', tv.reservedDateToRepair.toString());

    return formData;
  }

  public updateTvFormDate(externalId: string,tv: Tv): FormData {
    const formData = new FormData();
    formData.append('tvExternalId', externalId);
    formData.append('tvCategoryDescription', tv.tvCategoryDescription);
    formData.append('errorSeenByCustomer',tv.errorSeenByCustomer);
    formData.append('reservedDateToRepair', tv.reservedDateToRepair.toString());

    return formData;
  }

  public updateTvByAdminForm(tv: Tv, repairedError: string, price: number): FormData {
    const formData = new FormData();
    formData.append('externalTvId',tv.externalId);
    formData.append('repairedError', repairedError);
    formData.append('price', price.toString());
    return formData;
  }
}
