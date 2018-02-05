import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/observable/throw'
import 'rxjs/add/operator/catch';
import {AlertService} from './alert.service';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
  constructor(private alertService: AlertService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const requestCopy = request.clone();
    return next.handle(requestCopy)
      .catch((error, caught) => {
        if (error.status == 500) {
          this.alertService.addErrorAlert('Server error 500');
        } else if (error.status == 0) {
          this.alertService.addErrorAlert('Server error');
        }
        return Observable.throw(error);
      }) as any;
  }
}
