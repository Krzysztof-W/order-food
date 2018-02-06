import {Injectable} from '@angular/core';
import {BaseHttpService} from './base-http.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {FoodProviderFullModel, FoodProviderModel} from '../model/food-provider.model';
import {FoodProviderRequestModel} from '../model/food-provider-request.model';
import {FoodRequestModel} from '../model/food-request.model';
import {FoodModel} from '../model/food.model';

@Injectable()
export class OrderService extends BaseHttpService {
  constructor(protected http: HttpClient) {
    super(http);
  }


}
