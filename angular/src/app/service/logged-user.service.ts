import {Injectable} from '@angular/core';
import {UserFullModel} from '../model/user-model';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class LoggedUserService {
  public loggedUser: BehaviorSubject<UserFullModel> = new BehaviorSubject<UserFullModel>(null);

  constructor() { }
}
