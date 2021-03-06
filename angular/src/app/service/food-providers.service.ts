import {Injectable} from '@angular/core';
import {BaseHttpService} from './base-http.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {FoodProviderFullModel, FoodProviderModel} from '../model/food-provider.model';
import {FoodProviderRequestModel} from '../model/food-provider-request.model';
import {FoodRequestModel} from '../model/food-request.model';
import {FoodModel} from '../model/food.model';

@Injectable()
export class FoodProvidersService extends BaseHttpService {
  constructor(protected http: HttpClient) {
    super(http);
  }

  createProvider(groupId: number, provider: FoodProviderRequestModel): Observable<FoodProviderModel> {
    return this.post<FoodProviderRequestModel>('groups/' + groupId + '/createFoodProvider', provider) as Observable<FoodProviderModel>;
  }

  getProvidersForGroup(groupId: number): Observable<FoodProviderModel[]> {
    return this.get<{foodProviders: FoodProviderModel[]}>('groups/' + groupId + '/foodProviders').map(response => response.foodProviders);
  }

  deleteProvider(id: number): Observable<Object> {
    return this.delete('foodProviders/' + id);
  }

  editProvider(id: number, provider: FoodProviderRequestModel): Observable<FoodProviderModel> {
    return this.put<FoodProviderRequestModel>('foodProviders/' + id, provider) as Observable<FoodProviderModel>;
  }

  getProvider(id: number): Observable<FoodProviderFullModel> {
    return this.get<{foodProvider: FoodProviderFullModel}>('foodProviders/' + id).map(response => response.foodProvider)
      .map(provider => {
        provider.food.forEach((food: FoodModel, i: number, array: FoodModel[]) => array[i].price = parseFloat(food.price).toFixed(2));
        return provider;
      });
  }

  createFood(providerId: number, food: FoodRequestModel): Observable<FoodProviderModel> {
    return this.post<FoodRequestModel>('foodProviders/' + providerId + '/createFood', food) as Observable<FoodProviderModel>;
  }

  deleteFood(id: number): Observable<Object> {
    return this.delete('food/' + id);
  }

  editFood(id: number, food: FoodRequestModel): Observable<FoodModel> {
    return this.put<FoodRequestModel>('food/' + id, food) as Observable<FoodModel>;
  }
}
