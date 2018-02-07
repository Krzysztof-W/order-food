import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FoodModel} from '../model/food.model';
import {TableAction, TableColumn} from '../table/table.component';
import {FoodProvidersService} from '../service/food-providers.service';
import {AlertService} from '../service/alert.service';
import {FoodRequestModel} from '../model/food-request.model';
import {FoodProviderFullModel} from '../model/food-provider.model';
import {LoggedUserService} from '../service/logged-user.service';
import {OrderStatus} from "../model/order.model";

export enum MenuMode {
  CONFIG = 'C',
  SELECT = 'S'
}

enum MenuEditState {
  OFF,
  ADD,
  EDIT
}
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html'
})
export class MenuComponent implements OnInit {
  @Input() provider: FoodProviderFullModel;
  @Output() providerChange: EventEmitter<FoodProviderFullModel> = new EventEmitter<FoodProviderFullModel>();
  @Input() mode: MenuMode = MenuMode.CONFIG;
  @Input() orderStatus: OrderStatus = OrderStatus.NEW;
  @Output() selectedFood: EventEmitter<FoodModel> = new EventEmitter<FoodModel>();
  editedFood: FoodRequestModel;
  editedFoodId: number;
  state: MenuEditState = MenuEditState.OFF;

  columns: TableColumn[] = [
    {name: 'Name', data: 'name'},
    {name: 'Description', data: 'description'},
    {name: 'Price', data: 'price'}
  ];
  actions: TableAction[] = [
    {
      name: 'Edit',
      condition: item => this.mode === MenuMode.CONFIG && this.isOwner(),
      action: item => this.openEditFood(item)
    },
    {
      name: 'Delete',
      condition: item => this.mode === MenuMode.CONFIG && this.isOwner(),
      action: item => this.deleteFood(item)
    },
    {
      name: 'Select',
      condition: item => this.mode === MenuMode.SELECT && this.orderStatus === OrderStatus.NEW,
      action: item => this.selectFood(item)
    }
  ];

  constructor(private foodProvidersService: FoodProvidersService,
              private alertService: AlertService,
              private loggedUserService: LoggedUserService) { }

  ngOnInit() {
  }

  selectFood(food: FoodModel): void {
    this.selectedFood.emit(food);
  }

  deleteFood(food: FoodModel): void {
    this.state = MenuEditState.OFF;
    this.foodProvidersService.deleteFood(food.id).subscribe(
      success => {
        this.alertService.addSuccessAlert(`Removed '${food.name}' from menu`);
        this.foodProvidersService.getProvider(this.provider.id).subscribe(
          provider => {
            this.provider = provider;
            this.providerChange.emit(provider);
          },
          error => this.alertService.addErrorAlert('Error while loading provider data')
        );
      },
      error => this.alertService.addErrorAlert('Error while removing food from menu')
    );
  }

  openEditFood(food: FoodModel): void {
    this.editedFood = new FoodRequestModel();
    this.editedFoodId = food.id;
    this.editedFood.name = food.name;
    this.editedFood.description = food.description;
    this.editedFood.price = +food.price;
    this.state = MenuEditState.EDIT;
  }

  openAddFood() {
    this.editedFood = new FoodRequestModel();
    this.state = MenuEditState.ADD;
  }

  addEditFood() {
    if (this.state === MenuEditState.EDIT) {
      this.editFood();
    } else if (this.state === MenuEditState.ADD) {
      this.addFood();
    }
  }

  addFood() {
    this.foodProvidersService.createFood(this.provider.id, this.editedFood).subscribe(
      success => {
        this.alertService.addSuccessAlert(`Added '${this.editedFood.name}' to menu`);
        this.foodProvidersService.getProvider(this.provider.id).subscribe(
          provider => {
            this.provider = provider;
            this.providerChange.emit(provider);
          },
          error => this.alertService.addErrorAlert('Error while loading provider data')
        );
      },
      error => this.alertService.addErrorAlert('Error while adding food to menu')
    );
    this.state = MenuEditState.OFF;
  }

  editFood() {
    this.foodProvidersService.editFood(this.editedFoodId, this.editedFood).subscribe(
      success => {
        this.alertService.addSuccessAlert(`Edited '${this.editedFood.name}'`);
        this.foodProvidersService.getProvider(this.provider.id).subscribe(
          provider => {
            this.provider = provider;
            this.providerChange.emit(provider);
          },
          error => this.alertService.addErrorAlert('Error while loading provider data')
        );
      },
      error => this.alertService.addErrorAlert('Error while editing food')
    );
    this.state = MenuEditState.OFF;
  }

  isConfigMode(): boolean {
    return this.mode === MenuMode.CONFIG;
  }

  isOffState(): boolean {
    return this.state === MenuEditState.OFF;
  }

  isAddState(): boolean {
    return this.state === MenuEditState.ADD;
  }

  isEditState(): boolean {
    return this.state === MenuEditState.EDIT;
  }

  closeAddEdit(): void {
    this.state = MenuEditState.OFF;
  }

  isOwner(): boolean {
    return this.provider.group.owner.id === this.loggedUserService.loggedUser.getValue().id;
  }
}
