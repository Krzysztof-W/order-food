import {UserModel} from './user-model';
import {FoodModel} from './food.model';

export class OrderedFoodModel {
  id: number;
  orderId: number;
  user: UserModel;
  food: FoodModel;
  paid: string;
}
