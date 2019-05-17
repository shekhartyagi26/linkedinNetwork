import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient, HttpParams, } from '@angular/common/http';
import { Observable } from 'rxjs';

import { JwtService } from './jwt.service';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import _ from 'lodash';

@Injectable()
export class ApiService {
  constructor(
    private http: HttpClient,
    private jwtService: JwtService
  ) { }

  headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });


  private formatErrors(error: any) {
    return throwError(error.error);
  }

  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http.get(`${environment.api_url}${path}`, { params })
      .pipe(catchError(this.formatErrors));
  }

  put(path: string, body: Object = {}): Observable<any> {
    return this.http.put(`${environment.api_url}${path}`, JSON.stringify(body), { headers: this.headers }).pipe(catchError(this.formatErrors));
  }

  post(path: string, body: Object = {}): Observable<any> {
    return this.http.post(
      `${environment.api_url}${path}`,
      JSON.stringify(body),
      { headers: this.headers }
    ).pipe(catchError(this.formatErrors));
  }

  delete(path): Observable<any> {
    return this.http.delete(
      `${environment.api_url}${path}`,
      { headers: this.headers }
    ).pipe(catchError(this.formatErrors));
  }

  postFile(path, fileToUpload: File, data: Object = {}): Observable<any> {

    const formData: FormData = new FormData();
    if (fileToUpload) formData.append('image', fileToUpload, fileToUpload.name);
    _.map(data, (value, key) => {
      if (value) formData.append(key, value);
    })
    return this.http.put(`${environment.api_url}${path}`, formData)
      .pipe(catchError(this.formatErrors));

    // .map(() => { return true; })
    // .catch((e) => this.handleError(e));
  }
}
