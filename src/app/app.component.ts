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
    this.setTheme();
  }

  public action(): void {

  }

  public setTheme(): void {
    const themeConfig: IThemeInfo = this.settings.getSetting('theme');

    let themeOptions: {name: string, value: string}[];
    if (themeConfig && themeConfig.themeName === 'custom' && themeConfig.options) {
      themeOptions = themeConfig.options;
    } else if (!themeConfig || (themeConfig.themeName === 'custom' && !themeConfig.options) || (themeConfig && themeConfig.themeName === 'default')) {
      themeOptions = themeDefault.options;
    } else {
      themeOptions = themeDefault.options;
    }
    // push defaults if there is a missing style
    themeDefault.options.forEach((defaultOption: {name: string, value: string}) => {
      if (!themeOptions.find((option: {name: string, value: string}) => option.name === defaultOption.name)) {
        themeOptions.push(defaultOption);
      }
    });

    themeOptions.forEach((option: {name: string, value: string}) => {
      document.body.style.setProperty(`--${option.name}`, option.value);
    });
  }
}
