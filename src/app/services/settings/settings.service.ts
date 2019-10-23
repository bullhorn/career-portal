import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformServer } from '@angular/common';
import { TranslateService } from 'chomsky';

const APP_CONFIG_URL: any = './app.json';

@Injectable()
export class SettingsService {

  public static settings: ISettings;
  public static isServer: boolean;
  public static urlRoot: string;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) platformId: string) {
    SettingsService.isServer = isPlatformServer(platformId);
  }

  public async load(): Promise<any> {
    let data: any | ISettings = await this.http.get(APP_CONFIG_URL).toPromise();
    this.setConfig(data);
  }

  public async setConfig(data: ISettings): Promise<any> {
    SettingsService.settings = data;
    if (SettingsService.urlRoot) {
      TranslateService.setLocation(`${SettingsService.urlRoot}i18n/`);
    }
    await TranslateService.use('en-US').toPromise();

  }

}
