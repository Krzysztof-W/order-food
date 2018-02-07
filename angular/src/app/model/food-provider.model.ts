import {FoodModel} from './food.model';
import {GroupModel} from './group-model';

export class FoodProviderModel {
  id: number;
  name: string;
  address: string;
  phone: string;
}

export class FoodProviderFullModel extends FoodProviderModel {
  group: GroupModel;
  food: FoodModel[];
}
