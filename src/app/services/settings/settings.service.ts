import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const APP_CONFIG_URL: any = '/app.json';

@Injectable()
export class SettingsService {

  public static settings: ISettings;

  constructor(private http: HttpClient) {  }

  public load(): Promise<any> {
    let request: Promise<any> = this.http.get(APP_CONFIG_URL).toPromise();
    request.then(this.setConfig.bind(this));

    return request;
  }

  public setConfig(data: ISettings): void {
    SettingsService.settings = data;
  }
}
