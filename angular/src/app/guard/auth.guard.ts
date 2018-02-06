import {Injectable} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {LoggedUserService} from '../service/logged-user.service';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';

@Injectable()
export class AuthGuard implements CanActivate {

  redirectSubscription: Subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private loggedUserService: LoggedUserService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.redirectSubscription != null) {
      this.redirectSubscription.unsubscribe();
      this.redirectSubscription = null;
    }
    if (this.loggedUserService.loggedUser.getValue() == null) {
      this.router.navigate(['login'], { queryParams: { returnUrl: state.url }});
      this.redirectSubscription = this.loggedUserService.loggedUser.filter(user => user != null).subscribe(user => {
        this.redirectSubscription.unsubscribe();
        this.redirectSubscription = null;
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigate([returnUrl]);
      });
      return false;
    }
    return true;
  }
}
