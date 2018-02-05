import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Parameters} from './parameters';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class BaseHttpService {
  constructor(protected http: HttpClient) {}

  get<T>(url: string, headers?: HttpHeaders): Observable<T> {
    const httpHeaders = this.addAuthorizationHeader(headers);
    return this.http.get<T>(Parameters.SERVICES_ADDRESS + url, {headers: httpHeaders});
  }

  post<T>(url: string, body: T, headers?: HttpHeaders): Observable<Object> {
    const httpHeaders = this.addAuthorizationHeader(headers);
    return this.http.post<T>(Parameters.SERVICES_ADDRESS + url, body, {headers: httpHeaders});
  }

  put<T>(url: string, body: T, headers?: HttpHeaders): Observable<Object> {
    const httpHeaders = this.addAuthorizationHeader(headers);
    return this.http.put<T>(Parameters.SERVICES_ADDRESS + url, body, {headers: httpHeaders});
  }

  delete(url: string, headers?: HttpHeaders): Observable<Object> {
    const httpHeaders = this.addAuthorizationHeader(headers);
    return this.http.delete(Parameters.SERVICES_ADDRESS + url, {headers: httpHeaders});
  }

  private addAuthorizationHeader(headers: HttpHeaders) {
    const token: string = localStorage.getItem('token');
    let httpHeaders: HttpHeaders = new HttpHeaders({['Authorization']: 'Basic ' + token});
    if (headers) {
      httpHeaders = this.joinHeaders(httpHeaders, headers);
    }
    return httpHeaders;
  }

  private joinHeaders(headers1: HttpHeaders, headers2: HttpHeaders): HttpHeaders {
    const httpHeaders = new HttpHeaders();
    headers1.keys().forEach(key => httpHeaders.append(key, headers1.get(key)));
    headers2.keys().forEach(key => httpHeaders.append(key, headers2.get(key)));
    return httpHeaders;
  }
}
