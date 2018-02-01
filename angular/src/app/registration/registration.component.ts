import {Component, OnInit} from '@angular/core';
import {AuthService, UserLoginModel} from '../service/auth.service';
import {Router} from '@angular/router';
import {AlertService} from '../service/alert.service';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html'
})
export class RegistrationComponent {
  model: UserLoginModel = new UserLoginModel();

  constructor(private router: Router, private authService: AuthService, private alertService: AlertService) {
  }

  onSubmit() {
    this.authService.register(this.model).subscribe(
      user => {
        this.router.navigate(['/login']);
        this.alertService.addSuccessAlert(`Successfully created user ${user.username}`);
      },
      error => {
        if (error.status === 400) {
          this.alertService.addErrorAlert('User with selected username already exists');
        } else {
          this.alertService.addErrorAlert();
        }
      }
    );
  }
}
