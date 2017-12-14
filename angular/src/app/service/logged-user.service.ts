import {Injectable} from '@angular/core';
import {UserModel} from '../model/user-model';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class LoggedUserService {
  public loggedUser: BehaviorSubject<UserModel> = new BehaviorSubject<UserModel>(null);
  public token: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor() { }
}
