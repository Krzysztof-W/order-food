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
  constructor(protected http: HttpClient) {
    super(http);
  }

  addGroup(groupName: string): Observable<Object> {
    return this.post<{name: string}>('createGroup', {name: groupName});
  }

  getGroups(): Observable<GroupModel[]> {
    return this.get<{groups: GroupModel[]}>('groups').map(response => response.groups);
  }

  getGroupDetails(groupId: number): Observable<GroupFullModel> {
    return this.get<{group: GroupFullModel}>('groups/' + groupId).map(response => response.group);
  }

  editGroupName(groupId: number, name: string): Observable<Object> {
    return this.put<{name: string}>('groups/' + groupId, {name: name});
  }

  deleteGroup(groupId: number): Observable<Object> {
    return this.delete('groups/' + groupId);
  }

  removeGroupMember(groupId: number, userId: number): Observable<Object> {
    return this.delete('groups/' + groupId + '/users/' + userId)
  }

  createInvitation(groupId: number, userId: number): Observable<Object> {
    return this.post('groups/' + groupId + '/users/' + userId + '/invitation', {});
  }

  deleteInvitation(id: number): Observable<Object> {
    return this.delete('invitations/' + id);
  }

  processInvitation(id: number, decision: boolean): Observable<Object> {
    return this.put<{decision: boolean}>('invitations/' + id, {decision: decision});
  }

  getUsers(searchString: string): Observable<UserModel[]> {
    return this.get<UserModel[]>('users/' + searchString);
  }
}
