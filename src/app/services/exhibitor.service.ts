import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Company } from '../interfaces/company';
import { AddRequestBody } from '../interfaces/add-request-body';

@Injectable({
  providedIn: 'root'
})
export class ExhibitorService {
  baseUrl = environment.baseUrl;
  countryList = environment.countryList;

  constructor(private http: HttpClient) { }

  getCountryList() {
    return this.http.get(`${this.countryList}`).pipe(
      catchError((err) => throwError(() => err))
    );
  }

  getCompanyList() {
    return this.http.post<{ status: boolean; message: Company[] }>(`${this.baseUrl}/exhibitor-company-list`, {}).pipe(
      catchError((err) => throwError(() => err))
    );
  }

  postRequest(req: AddRequestBody) {
    return this.http.post(`${this.baseUrl}/add-exhibitor`, req).pipe(
      catchError((err) => throwError(() => err))
    );
  }
}
