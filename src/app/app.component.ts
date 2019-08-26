import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { SettingsService } from './services/settings/settings.service';
import { TranslateService } from 'chomsky';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public title: string = SettingsService.settings.companyName;

  constructor(private router: Router, private meta: Meta) {
    this.meta.updateTag({ name: 'google-site-verification', content: SettingsService.settings.integrations.googleSiteVerification.verificationCode });
    TranslateService.use(SettingsService.settings.language).subscribe();
    let trackingId: string = SettingsService.settings.integrations.googleAnalytics.trackingId;
    if (trackingId && !SettingsService.isServer) {
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
