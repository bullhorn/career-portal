import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { SettingsService } from './services/settings/settings.service';
import { themeDefault } from './themes/themes';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public title: string = 'app';

  constructor(private router: Router, private settings: SettingsService) { 
    let trackingId: string = this.settings.getSetting('integrations').googleAnalytics.trackingId;
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

  public ngOnInit(): void {
    const themeConfig: IThemeInfo = this.settings.getSetting('theme');

    let themeOptions: any;
    if (themeConfig && themeConfig.themeName === 'custom' && themeConfig.options) {
      themeOptions = new Map(themeConfig.options);
    } else if (!themeConfig || (themeConfig.themeName === 'custom' && !themeConfig.options) || (themeConfig && themeConfig.themeName === 'default')) {
      themeOptions = new Map(themeDefault.options);
    } else {
      themeOptions = new Map(themeDefault.options);
    }

    Array.from(themeOptions.entries()).forEach(([name, value]) => {
      document.body.style.setProperty(`--${name}`, value);
    });

  }

  public action(): void {

  }
}
