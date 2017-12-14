import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import {LoggedUserService} from './logged-user.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Injectable()
export class AuthService {

  constructor(private http: Http, private loggedUserService: LoggedUserService) { }

  public login(): Observable<boolean> {
    this.loggedUserService.loggedUser.next({id: 0, name: 'Wojtek', password: ''});
    return Observable.of(true);
  }

  public logout(): void {
    this.loggedUserService.loggedUser.next(null);
    this.loggedUserService.token.next(null);
  }
}
