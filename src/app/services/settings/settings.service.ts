import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformServer } from '@angular/common';

const APP_CONFIG_URL: any = './app.json';

@Injectable()
export class SettingsService {

  public static settings: ISettings;
  public static isServer: boolean;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) platformId: string) {
    SettingsService.isServer = isPlatformServer(platformId);
  }

  public load(): Promise<any> {
    let request: Promise<any> = this.http.get(APP_CONFIG_URL).toPromise();
    request.then(this.setConfig.bind(this));

    return request;
  }

  public setConfig(data: ISettings): void {
    SettingsService.settings = data;
  }
}
