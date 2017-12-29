import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {GroupDetailsModel, GroupModel} from '../model/group-model';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {UserModel} from '../model/user-model';
import {InvitationModel} from '../model/invitation-model';

@Injectable()
export class GroupsService {
  groups: GroupModel[] = [
    {owner: {password: 'qwer', id: 0, username: 'Wojtek'}, owner_id: 1, id: 1, name: 'StaraGrupa'},
    {owner: {password: 'qwer', id: 1, username: 'Krzysio'}, owner_id: 2, id: 2, name: 'NowaGrupa'}
  ];
  groupUsers: GroupDetailsModel = {
    group: this.groups[0],
    users: [
      {password: 'qwer', id: 0, username: 'Wojtek'},
      {password: 'qwer', id: 1, username: 'Krzysio'}
    ]
  };

  constructor(private http: Http) {
  }

  addGroup(group: GroupModel) {
    console.log('add group');
  }

  deleteGroup(group: GroupModel) {
    console.log('delete group');
  }

  removeUser(group: GroupModel, user: UserModel) {
    console.log('remove user');
  }

  getGroups(): Observable<GroupModel[]> {
    return Observable.of(this.groups);
    // return this.http.get('http://localhost:5000/groups').map(response => response.json());
  }

  getGroupDetails(groupId: number): Observable<GroupDetailsModel> {
    return Observable.of(this.groupUsers);
  }

  createInvitation(invitation: InvitationModel) {
    console.log('create invitation');
  }

  deleteInvitation(invitation: InvitationModel) {
    console.log('delete invitation');
  }

  processInvitation(invitation: InvitationModel, decision: boolean) {
    console.log('process invitation');
  }
}
