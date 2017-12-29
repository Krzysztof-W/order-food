import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

export class AlertModel {
  message: string;
  type: string;
}

@Injectable()
export class AlertService {
  private alerts$: Subject<AlertModel> = new Subject<AlertModel>();

  addAlert(alert: AlertModel) {
    this.alerts$.next(alert);
  }

  addSuccessAlert(message: string) {
    this.addAlert({type: 'success', message: message});
  }

  addErrorAlert(message?: string) {
    this.addAlert({type: 'danger', message: message ? message : 'Error'});
  }

  getAlerts(): Observable<AlertModel> {
    return this.alerts$;
  }
}
