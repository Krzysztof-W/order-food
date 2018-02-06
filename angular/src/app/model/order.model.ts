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
  provider: FoodProviderModel;
  description: string;
  status: OrderStatus;
  confirmDate: Date;
  orderOwner: UserModel;
}

export class OrderFullModel extends OrderModel {
  orderedFood: OrderedFoodModel[];
}
