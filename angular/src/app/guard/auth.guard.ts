import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {LoggedUserService} from '../service/logged-user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private loggedUserService: LoggedUserService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.loggedUserService.loggedUser.getValue() == null) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}
