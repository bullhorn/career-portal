import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformServer } from '@angular/common';

const APP_CONFIG_URL: any = './app.json';
const URL_ROOT: any = 'http://localhost:4000/';

@Injectable()
export class SettingsService {

  public static settings: ISettings;
  public static isServer: boolean;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) platformId: string) {
    SettingsService.isServer = isPlatformServer(platformId);
  }

  public load(): Promise<any> {
    let settingPath: string = APP_CONFIG_URL;
    if (SettingsService.isServer) {
      settingPath = `${URL_ROOT}/${APP_CONFIG_URL}`;
    }
    let request: Promise<any> = this.http.get(settingPath).toPromise();
    request.then(this.setConfig.bind(this));

    return request;
  }

  public setConfig(data: ISettings): void {
    SettingsService.settings = data;
  }
}
