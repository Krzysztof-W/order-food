import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import {LoggedUserService} from './logged-user.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {UserModel} from '../model/user-model';

export class RegistrationModel {
  username: string;
  password: string;
}

@Injectable()
export class AuthService {

  constructor(private http: Http, private loggedUserService: LoggedUserService) {
    this.login();
  }

  public register(body: RegistrationModel): Observable<UserModel> {
    return this.http.post('http://localhost:5000/register', body).map(response => response.json());
  }

  public login(): Observable<boolean> {
    this.loggedUserService.loggedUser.next({id: 0, username: 'Wojtek', password: ''});
    return Observable.of(true);
  }

  public logout(): void {
    this.loggedUserService.loggedUser.next(null);
    this.loggedUserService.token.next(null);
  }
}
