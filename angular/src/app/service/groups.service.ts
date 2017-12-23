import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {GroupModel} from '../model/group-model';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class GroupsService {
  constructor(private http: Http) {
  }

  getGroups(): Observable<GroupModel[]> {
    return this.http.get('http://localhost:5000/groups').map(response => response.json());
  }
}
