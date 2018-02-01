import {Component, OnInit} from '@angular/core';
import {AuthService, UserLoginModel} from '../service/auth.service';
import {Router} from '@angular/router';
import {AlertService} from "../service/alert.service";
import {log} from "util";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  model: UserLoginModel = new UserLoginModel();

  constructor(private router: Router, private authService: AuthService, private alertService: AlertService) {
  }

  onSubmit() {
    this.authService.login(this.model).subscribe(response => {
      this.router.navigate(['/dashboard']);
    });
  }
}
