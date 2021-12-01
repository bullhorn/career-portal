import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '../settings/settings.service';
import { Observable } from 'rxjs';
import { IServiceSettings } from '../../typings/settings';

@Injectable()
export class ApplyService {

  public constructor(private http: HttpClient, public settings: SettingsService) {

  }
  get baseUrl(): string {
    let service: IServiceSettings = SettingsService.settings.service;
    let port: number = service.port ? service.port : 443;
    let scheme: string = `http${ port === 443  ? 's' : '' }`;

    return `${scheme}://public-rest${service.swimlane}.bullhornstaffing.com:${port}/rest-services/${service.corpToken}/apply`;
  }

  public apply(id: number, params: any, formData: FormData): Observable<any> {
    let applyParams: any = this.assembleParams(params);
    return this.http.post(`${this.baseUrl}/${id}/raw?${applyParams}`, formData);
  }

  private assembleParams(data: any): string {
    let params: string[] = [];
    params.push(`externalID=Resume`);
    params.push(`type=Resume`);
    for (let key in data) {
      if (!data.hasOwnProperty(key)) { continue; }
      if (!data[key]) { continue; }
      let value: any = data[key];
      params.push(`${key}=${value}`);
    }
    return params.join('&');
  }
}
