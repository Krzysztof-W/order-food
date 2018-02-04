import {Injectable} from '@angular/core';
import {GroupFullModel, GroupModel} from '../model/group-model';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {UserModel} from '../model/user-model';
import {InvitationModel} from '../model/invitation-model';
import {HttpClient} from '@angular/common/http';
import {BaseHttpService} from './base-http.service';

@Injectable()
export class GroupsService extends BaseHttpService {
  groups: GroupModel[] = [
    {owner: {password: 'qwer', id: 0, username: 'Wojtek'}, owner_id: 1, id: 1, name: 'StaraGrupa'},
    {owner: {password: 'qwer', id: 1, username: 'Krzysio'}, owner_id: 2, id: 2, name: 'NowaGrupa'}
  ];
  groupUsers: GroupFullModel = {
    owner: {password: 'qwer', id: 0, username: 'Wojtek'}, owner_id: 1, id: 1, name: 'StaraGrupa',
    users: [
      {password: 'qwer', id: 0, username: 'Wojtek'},
      {password: 'qwer', id: 1, username: 'Krzysio'}
    ]
  };

  constructor(protected http: HttpClient) {
    super(http);
  }

  addGroup(groupName: string): Observable<Object> {
    return this.post<{name: string}>('createGroup', {name: groupName});
  }

  deleteGroup(group: GroupModel) {
    console.log('delete group');
  }

  removeUser(group: GroupModel, user: UserModel) {
    console.log('remove user');
  }

  getGroups(): Observable<GroupModel[]> {
    // return Observable.of(this.groups);
    return this.get<{groups: GroupModel[]}>('groups').map(response => response.groups);
  }

  getGroupDetails(groupId: number): Observable<GroupFullModel> {
    // return Observable.of(this.groupUsers);
    return this.get<{group: GroupFullModel}>('groups/' + groupId).map(response => response.group);
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

  getUsers(searchString: string): Observable<UserModel[]> {
    return this.get<UserModel[]>('users/' + searchString);
  }
}
