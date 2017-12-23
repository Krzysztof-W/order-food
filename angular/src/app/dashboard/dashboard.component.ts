import { Component, OnInit } from '@angular/core';
import {LoggedUserService} from '../service/logged-user.service';
import {UserModel} from '../model/user-model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: UserModel;

  constructor(private loggedUserService: LoggedUserService) { }

  ngOnInit() {
    this.loggedUserService.loggedUser.subscribe(user => this.user = user);
  }

}
