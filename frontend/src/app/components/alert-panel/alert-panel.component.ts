import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from './alert-panel.servic';
import { AlertInfo, AlertInfoType } from './alert-panel.model';
import { CommonModule } from '@angular/common';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'widget-alert-panel',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './alert-panel.component.html',
  styleUrls: ['./alert-panel.component.scss']
})
export class AlertPanelComponent implements OnInit, OnDestroy {
  @Input() id = 'default-alert';
  @Input() fade = true;
  @Input() singleMode = true;

  alerts: AlertInfo[] = [];
  alertSubscription!: Subscription;
  routeSubscription!: Subscription;

  protected iconCheck: IconProp = faCheck;

  constructor(private router: Router, private alertService: AlertService) { }

  ngOnInit() {
      this.alertSubscription = this.alertService.onAlert(this.id)
          .subscribe((alert: AlertInfo) => {
              if (!alert.message) {
                  this.alerts = this.alerts.filter(x => x.keepAfterRouteChange);
                  this.alerts.forEach(x => delete x.keepAfterRouteChange);
                  return;
              }

              if (this.singleMode) {
                this.alerts = [];
              }

              this.alerts.push(alert);

              if (alert.autoClose) {
                  setTimeout(() => this.removeAlert(alert), 3000);
              }
         });

      this.routeSubscription = this.router.events.subscribe(event => {
          if (event instanceof NavigationStart) {
              this.alertService.clear(this.id);
          }
      });
  }

  ngOnDestroy() {
      this.alertSubscription.unsubscribe();
      this.routeSubscription.unsubscribe();
  }

  removeAlert(alert: AlertInfo) {
      if (!this.alerts.includes(alert)) return;

      if (this.fade) {
          const alert1: AlertInfo | undefined = this.alerts.find(x => x === alert);

          if (alert1 !== undefined) {
            alert1.fade = true;
          }

          setTimeout(() => {
              this.alerts = this.alerts.filter(x => x !== alert);
          }, 250);
      } else {
          this.alerts = this.alerts.filter(x => x !== alert);
      }
  }

  cssClass(alert: AlertInfo) {
      if (!alert) return "";

      const classes = ['alert', 'alert-dismissable', 'alert-panel'];
              
      const alertTypeClass = {
          [AlertInfoType.Success]: 'alert-success',
          [AlertInfoType.Error]: 'alert-danger',
          [AlertInfoType.Info]: 'alert-info',
          [AlertInfoType.Warning]: 'alert-warning'
      }

      classes.push(alertTypeClass[alert.type]);

      if (alert.fade) {
          classes.push('fade');
      }

      return classes.join(' ');
  }
}
