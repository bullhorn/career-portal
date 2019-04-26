import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SettingsService } from '../settings/settings.service';
import { Observable } from 'rxjs';

@Injectable()
export class ApplyService {

  public constructor(private http: HttpClient, public settings: SettingsService) {

  }
  get baseUrl(): string {
    let service: IServiceSettings = SettingsService.settings.service;
    let port: number = service.port ? service.port : 443;
    let scheme: string = `http${ service.port === 443  ? 's' : '' }`;

    return `${scheme}://public-rest${service.swimlane}.bullhornstaffing.com:${service.port}/rest-services/${service.corpToken}/apply`;
  }

  public apply(id: number, params: any): Observable<any> {
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'multipart/form-data',
      }),
    };
    let body: FormData = new FormData();
    for (let key in params) {
      if (!params.hasOwnProperty(key)) { continue; }
      body.append(key, params[key]);
    }

    let applyParams: any = this.assembleParams(params);
    return this.http.post(`${this.baseUrl}/${id}/raw?${applyParams}`, body);
  }

  private assembleParams(data: any): string {
    let params: string[] = [];
    params.push(`externalID=Resume`);
    params.push(`type=Resume`);
    for (let key in data) {
      if (!data.hasOwnProperty(key)) { continue; }
      if (!data[key]) { continue; }
      let value: any = data[key];
      if (key !== 'resume') {
        params.push(`${key}=${value}`);
      } else {
        params.push(`format=${ value.name ? value.name.substring(value.name.lastIndexOf('.') + 1) : 'txt'}`);
      }
    }
    return params.join('&');
  }
}
