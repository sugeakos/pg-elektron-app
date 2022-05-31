import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { Tv } from 'src/app/domain/tv/tv';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class TvService {
  public host = environment.apiUrl;
  private jwtHelper = new JwtHelperService();
  private loggedInUsername: string;

  constructor(private http: HttpClient, private authService: AuthenticationService) { }

  public addTvToLocalCache(tv: Tv): void {
    localStorage.setItem('tv', JSON.stringify(tv));
  }

  public getTvFromLocalCache(): Tv {
    return JSON.parse(localStorage.getItem('tv'));
  }
  public getTvsByUsersEmail(email: string): Observable<Tv[] | HttpErrorResponse> {
    return this.http.get<Tv[]>(`${this.host}/tv/${email}`);
  }

  public addNewTv(formData: FormData): Observable<Tv | HttpErrorResponse> {
    return this.http.post<Tv>(`${this.host}/tv/new`, formData);
  }

  public updateTvByAdmin(formData: FormData): Observable<Tv | HttpErrorResponse> {
    return this.http.post<Tv>(`${this.host}/tv/update`, formData);
  }

  public addTvsToLocalCache(tvs: Tv[]): void {
    localStorage.setItem('tvs', JSON.stringify(tvs));
  }

  public getTvsFromLocalCache(): Tv[] {
    if (localStorage.getItem('tvs')) {
      return JSON.parse(localStorage.getItem('tvs'));
    } else {
      return null;
    }
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
