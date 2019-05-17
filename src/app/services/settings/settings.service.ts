import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const APP_CONFIG_URL: any = '/app.json';

@Injectable()
export class SettingsService {

  private companyName: string;
  private defaultLocale: string;
  private supportedLocales: string[];
  private minUploadSize: number;
  private maxRelatedJobs: number;
  private service: IServiceSettings;
  private integrations: IIntegrationSettings;
  private defaultGridState: string;
  private eeoc: IEeoc;
  private darkTheme: boolean;

  constructor(private http: HttpClient) {  }

  public getSetting(property: string): any {
    return this[property];
  }

  public load(): Promise<any> {
    let request: Promise<any> = this.http.get('http://localhost:4000/app.json').toPromise();
    request.then(this.parseConfig.bind(this));

    return request;
  }

  public parseConfig(data: ISettings): void {
    for (let key in data) {
      if (!data.hasOwnProperty(key)) { continue; }
      let obj: any = data[key];
      this[key] = obj;
    }
  }
}
