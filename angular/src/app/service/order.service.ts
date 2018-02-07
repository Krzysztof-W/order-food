import {Injectable} from '@angular/core';
import {BaseHttpService} from './base-http.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {FoodProviderFullModel, FoodProviderModel} from '../model/food-provider.model';
import {FoodProviderRequestModel} from '../model/food-provider-request.model';
import {FoodRequestModel} from '../model/food-request.model';
import {FoodModel} from '../model/food.model';
import {OrderFullModel, OrderModel, OrderStatus} from "../model/order.model";
import {OrderedFoodModel} from "../model/ordered-food.model";

@Injectable()
export class OrderService extends BaseHttpService {
  constructor(protected http: HttpClient) {
    super(http);
  }

  openOrder(providerId: number, description: string): Observable<OrderModel> {
    return (this.post<{description: string}>('foodProviders/' + providerId + '/openOrder', {description: description}) as Observable<{order: OrderModel}>)
      .map(response => response.order);
  }

  getOrders(userId: number): Observable<OrderModel[]> {
    return this.get<{orders: OrderModel[]}>('users/' + userId + '/orders').map(response => response.orders);
  }

  getOrder(orderId: number): Observable<OrderFullModel> {
    return this.get<{order: OrderFullModel}>('orders/' + orderId).map(response => response.order).map(this.fixOrder);
  }

  editOrderStatus(orderId: number, status: OrderStatus): Observable<OrderFullModel> {
    return (this.put<{status: string}>('orders/' + orderId, {status: status}) as Observable<{order: OrderFullModel}>)
      .map(response => response.order).map(this.fixOrder);
  }

  addOrderFood(orderId: number, foodId: number): Observable<OrderFullModel> {
    return (this.post<{id: number}>('orders/' + orderId + '/orderFood', {id: foodId}) as Observable<{order: OrderFullModel}>)
      .map(response => response.order).map(this.fixOrder);
  }

  deleteOrderFood(orderedFoodId: number): Observable<OrderFullModel> {
    return (this.delete('orderedFood/' + orderedFoodId) as Observable<{order: OrderFullModel}>)
      .map(response => response.order).map(this.fixOrder);
  }

  setOrderedFoodPaid(orderedFoodId: number): Observable<OrderFullModel> {
    return (this.put<{}>('orderedFood/' + orderedFoodId + '/paid', {}) as Observable<{order: OrderFullModel}>)
      .map(response => response.order).map(this.fixOrder);
  }

  private fixOrder(order: OrderFullModel): OrderFullModel {
    order.foodProvider.food.forEach((food: FoodModel, i: number, array: FoodModel[]) => array[i].price = parseFloat(food.price).toFixed(2));
    order.orderedFood.forEach((food: OrderedFoodModel, i: number, array: OrderedFoodModel[]) => {
      array[i].food.price = parseFloat(food.food.price).toFixed(2);
      console.log(food.paid);
      array[i].paid = food.paid ? 'Yes' : 'No';
    });
    return order;
  }
}
