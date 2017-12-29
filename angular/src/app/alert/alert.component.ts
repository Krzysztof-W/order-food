import {Component, OnInit} from '@angular/core';
import {AlertModel, AlertService} from '../service/alert.service';
import {NavigationStart, Router} from '@angular/router';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html'
})
export class AlertComponent implements OnInit {
  alerts: AlertModel[] = [];

  constructor(private alertService: AlertService, private router: Router) {}

  ngOnInit(): void {
    this.alertService.getAlerts().subscribe(alert => this.alerts.push(alert));
    this.router.events.filter(event => event instanceof NavigationStart).subscribe(event => this.alerts = []);
  }

  public closeAlert(alert: AlertModel) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }
}
