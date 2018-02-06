import {GroupModel} from './group-model';
import {InvitationModel} from './invitation-model';

export class UserModel {
  id: number;
  username: string;
  password: string;
}

export class UserFullModel extends UserModel {
  receivedInvitations: InvitationModel[];
  sentInvitations: InvitationModel[];
}
