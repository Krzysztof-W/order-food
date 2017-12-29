import {GroupModel} from './group-model';
import {UserModel} from './user-model';

export class InvitationModel {
  id: number;
  group: GroupModel;
  invitedUser: UserModel;
  sender: UserModel;
}
