import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import { Alert, AlertType } from 'src/app/models/alert';
import { AlertsService } from 'src/app/services/alerts.service';

@Component({
  selector: 'alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit, OnDestroy {
  @Input() id = 'default-alert';
  @Input() fade = true;

  alerts: Alert[] = [];
  alertSubscription: Subscription = new Subscription;
  routeSubscription: Subscription = new Subscription;

  constructor(private router: Router, private alertService: AlertsService) {}

  ngOnInit() {
      // subscribe to new alert notifications
      this.alertSubscription = this.alertService.onAlert(this.id)
          .subscribe(alert => {
              // clear alerts when an empty alert is received
              if (!alert.message) {
                  // filter out alerts without 'keepAfterRouteChange' flag
                  this.alerts = this.alerts.filter(x => x.keepAfterRouteChange);

                  // remove 'keepAfterRouteChange' flag on the rest
                  this.alerts.forEach((x: any) => delete x.keepAfterRouteChange);
                  return;
              }

              // add alert to array
              this.alerts.push(alert);
              // auto close alert if required
              if (alert.autoClose) {
                  setTimeout(() => this.removeAlert(alert), 3000);
              }
         });

      // clear alerts on location change
      this.routeSubscription = this.router.events.subscribe(event => {
          if (event instanceof NavigationStart) {
              this.alertService.clear(this.id);
          }
      });
  }

  ngOnDestroy() {
      // unsubscribe to avoid memory leaks
      this.alertSubscription.unsubscribe();
      this.routeSubscription.unsubscribe();
  }

  removeAlert(alert: Alert) {
      // check if already removed to prevent error on auto close
      if (!this.alerts.includes(alert)) return;

      if (this.fade) {
          // fade out alert
          if(typeof this.alerts.find(x => x === alert) !== "object"){
            let alertX: any = this.alerts.find(x => x === alert);
            alertX.fade = true;
          }
          // remove alert after faded out
          setTimeout(() => {
              this.alerts = this.alerts.filter(x => x !== alert);
          }, 250);
      } else {
          // remove alert
          this.alerts = this.alerts.filter(x => x !== alert);
      }
  }

  icon(alert: Alert){
    const alertIcons = {
      [AlertType.Success]: 'check-circle',
      [AlertType.Error]: 'alert-circle',
      [AlertType.Info]: 'info',
      [AlertType.Warning]: 'alert-triangle'
    }
    return alertIcons[alert.type];
  }

  cssClass(alert: Alert) {
      if (!alert) return;

      const classes = ['alert', 'alert-dismissable'];
              
      const alertTypeClass = {
          [AlertType.Success]: 'alert-border-success alert-success alert-text-success text-success',
          [AlertType.Error]: 'alert-border-warning alert-warning alert-text-warning text-warning',
          [AlertType.Info]: 'alert-border-info alert-info alert-text-info text-info',
          [AlertType.Warning]: 'alert-border-danger alert-danger alert-text-danger text-danger'
      }

      classes.push(alertTypeClass[alert.type]);

      if (alert.fade) {
          classes.push('fade');
      }
      return classes.join(' ');
  }
}
