import {Component, OnInit} from '@angular/core';
import {OrderFullModel, OrderStatus} from '../model/order.model';
import {OrderService} from '../service/order.service';
import {GroupsService} from '../service/groups.service';
import {ActivatedRoute} from '@angular/router';
import {AlertService} from '../service/alert.service';
import {LoggedUserService} from '../service/logged-user.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TableAction, TableColumn} from '../table/table.component';
import {OrderedFoodModel} from '../model/ordered-food.model';
import {FoodModel} from '../model/food.model';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html'
})
export class OrderComponent implements OnInit {
  order: OrderFullModel;
  selectedFood: FoodModel;

  columns: TableColumn[] = [
    {name: 'User name', data: 'user.username'},
    {name: 'Food', data: 'food.name'},
    {name: 'Price', data: 'food.price'},
    {name: 'Paid', data: 'paid'}
  ];
  actions: TableAction[] = [
    {
      name: 'Remove',
      condition: item => this.isOrderedFoodOwner(item) && this.order.status === OrderStatus.NEW,
      action: item => this.removeOrderedFood(item)
    },
    {
      name: 'Paid',
      condition: item => this.order.status === OrderStatus.PROGRESS && this.isOrderOwner(),
      action: item => this.setAsPaid(item)
    }
  ];

  constructor(private route: ActivatedRoute,
              private groupsService: GroupsService,
              private modalService: NgbModal,
              private alertService: AlertService,
              private loggedUserService: LoggedUserService,
              private orderService: OrderService) { }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.getOrder(id);
  }

  private getOrder(id: number) {
    this.orderService.getOrder(id).subscribe(
      order => {
        this.order = order;
      },
      error => this.alertService.addErrorAlert('Could not load order')
    );
  }

  isOrderedFoodOwner(food: OrderedFoodModel): boolean {
    return food.user.id === this.loggedUserService.loggedUser.getValue().id;
  }

  isOrderOwner(): boolean {
    return this.order.orderOwner.id === this.loggedUserService.loggedUser.getValue().id;
  }

  removeOrderedFood(orderedFood: OrderedFoodModel): void {
    this.orderService.deleteOrderFood(orderedFood.id).subscribe(
      order => {
        this.order = order;
        this.alertService.addSuccessAlert(`Removed '${orderedFood.food.name}' from order`);
      },
      error => this.alertService.addErrorAlert('Error while removing ordered food')
    );
  }

  setAsPaid(orderedFood: OrderedFoodModel) {
    this.orderService.setOrderedFoodPaid(orderedFood.id).subscribe(
      order => {
        this.order = order;
        this.alertService.addSuccessAlert(`'${orderedFood.food.name}' set as paid`);
      },
      error => this.alertService.addErrorAlert('Error while updating ordered food')
    );
  }

  openFoodOrder(content, food: FoodModel) {
    this.selectedFood = food;
    this.modalService.open(content).result.then((description: string) => {
        this.orderService.addOrderFood(this.order.id, this.selectedFood.id).subscribe(
          order => {
            this.order = order;
            this.alertService.addSuccessAlert(`Food ordered`);
          },
          error => this.alertService.addErrorAlert('Error while ordering food')
        );
      }, (reason) => {}
    );
  }

  sumOrderValue(): string {
    return this.order.orderedFood.reduce((x: number, y) => x + (+y.food.price), 0).toFixed(2);
  }
}
