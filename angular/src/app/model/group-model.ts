import {UserModel} from './user-model';

export class GroupModel {
  id: number;
  name: string;
  owner: UserModel;
}

export class GroupFullModel extends GroupModel {
  users: UserModel[];
}
