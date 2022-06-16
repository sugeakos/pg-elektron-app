import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TvCategory } from '../domain/tv-category';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TvCategoryService {
  private host = environment.apiUrl;
  constructor(private http: HttpClient) { }

  public getCategories(): Observable<TvCategory[] | HttpErrorResponse> {
    return this.http.get<TvCategory[]>(`${this.host}/tv-categories`);
  }

  public addNewTvCategory(formData: FormData): Observable<TvCategory | HttpErrorResponse> {
    return this.http.post<TvCategory>(`${this.host}/tv-categories/new`,formData);
  }
  
}
