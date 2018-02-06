import {Injectable} from '@angular/core';
import {UserFullModel} from '../model/user-model';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {BaseHttpService} from './base-http.service';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class LoggedUserService extends BaseHttpService {
  public loggedUser: BehaviorSubject<UserFullModel> = new BehaviorSubject<UserFullModel>(null);

  constructor(protected http: HttpClient) {
    super(http);
  }

  refreshUser(): void {
    this.get<UserFullModel>('account').subscribe(user => this.loggedUser.next(user));
  }
}
