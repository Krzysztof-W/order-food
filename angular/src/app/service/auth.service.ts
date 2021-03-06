import {Injectable} from '@angular/core';
import {LoggedUserService} from './logged-user.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {UserFullModel, UserModel} from '../model/user-model';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Parameters} from './parameters';
import {Subject} from 'rxjs/Subject';
import {BaseHttpService} from "./base-http.service";

export class UserLoginModel {
  username: string;
  password: string;
}

export interface LoginResponse {
  duration: number;
  token: string;
}

@Injectable()
export class AuthService extends BaseHttpService {

  constructor(protected http: HttpClient, private loggedUserService: LoggedUserService) {
    super(http);
    const token: string = localStorage.getItem('token');
    if (token != null) {
      this.login().subscribe();
    }
  }

  public register(body: UserLoginModel): Observable<UserModel> {
    return this.http.post<UserModel>(Parameters.SERVICES_ADDRESS + 'register', body);
  }

  public login(userLogin?: UserLoginModel): Observable<LoginResponse> {
    const token: string = userLogin ? btoa(userLogin.username + ':' + userLogin.password) : localStorage.getItem('token');
    if (token == null) {
      return Observable.of(null);
    }
    let headers: HttpHeaders = new HttpHeaders({['Authorization']: 'Basic ' + token});
    const response$: Subject<LoginResponse> = new Subject<LoginResponse>();
    this.http.get<LoginResponse>(Parameters.SERVICES_ADDRESS + 'login', {headers}).subscribe(
      response => {
        // localStorage.setItem('token', response.token);
        localStorage.setItem('token', token);
        // headers = new HttpHeaders({['Authorization']: 'Bearer ' + response.token});
        this.get<UserFullModel>('account').subscribe(user => {
          this.loggedUserService.loggedUser.next(user);
          response$.next(response);
          response$.complete();
        });
      },
      error => {
        response$.error(error);
      }
    );
    return response$;
  }

  public logout(): void {
    this.loggedUserService.loggedUser.next(null);
    localStorage.removeItem('token');
  }
}
