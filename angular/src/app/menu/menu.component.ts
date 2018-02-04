import { Component, OnInit } from '@angular/core';
import {OrderedFoodModel} from '../model/ordered-food.model';

export enum MenuMode {
  CONFIG,
  SELECT
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html'
})
export class MenuComponent implements OnInit {

  mode: MenuMode = MenuMode.CONFIG;
  menuItems: OrderedFoodModel[];

  constructor() { }

  ngOnInit() {
  }

}
