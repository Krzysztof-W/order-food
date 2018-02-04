import {FoodProviderModel} from './food-provider.model';
import {GroupModel} from './group-model';
import {OrderedFoodModel} from './ordered-food.model';
import {UserModel} from './user-model';

export enum OrderStatus {
  NEW = 'N',
  CANCELLED = 'C',
  PROGRESS = 'P',
  SERVED = 'S'
}

export class OrderModel {
  id: number;
  group: GroupModel;
  provider: FoodProviderModel;
  description: string;
  orderedFood: OrderedFoodModel[];
  status: OrderStatus;
  confirmDate: Date;
  orderOwner: UserModel;
}
