import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { SettingsService } from './services/settings/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public title: string = 'app';

  constructor(private router: Router) {
    let trackingId: string = SettingsService.settings.integrations.googleAnalytics.trackingId;
    if (trackingId) {
      this.router.events.subscribe((event: any) => {
        if (event instanceof NavigationEnd) {
          (<any>window).ga('create', trackingId, 'auto');
          (<any>window).ga('set', 'page', event.urlAfterRedirects);
          (<any>window).ga('send', 'pageview');
        }
      });
    }
  }

  public action(): void {
  }
}
