import { Component, OnInit } from '@angular/core';
import {AuthService} from '../service/auth.service';
import {LoggedUserService} from '../service/logged-user.service';
import {UserModel} from '../model/user-model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html'
})
export class UserHeaderComponent implements OnInit {
  private user: UserModel;

  constructor(private authService: AuthService,
              private loggedUserService: LoggedUserService,
              private router: Router) { }

  ngOnInit() {
    this.loggedUserService.loggedUser.subscribe(loggedUser => this.user = loggedUser);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
