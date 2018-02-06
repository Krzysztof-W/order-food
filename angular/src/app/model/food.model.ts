import {FoodProviderModel} from './food-provider.model';

export class FoodModel {
  id: number;
  provider: FoodProviderModel;
  name: string;
  description: string;
  price: string;
}
