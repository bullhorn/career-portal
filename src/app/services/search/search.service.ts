import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '../settings/settings.service';
import { Observable, of } from 'rxjs';
import { IServiceSettings } from '../../typings/settings';

@Injectable()
export class SearchService {

  public constructor(private http: HttpClient, public settings: SettingsService) {  }

  get baseUrl(): string {
    let service: IServiceSettings = SettingsService.settings?.service;
    let port: number = service?.port ? service.port : 443;
    let scheme: string = `http${ port === 443  ? 's' : '' }`;

    return `${scheme}://public-rest${service?.swimlane}.bullhornstaffing.com:${port}/rest-services/${service?.corpToken}`;
  }

  public getjobs(filter?: any, params: any = {}, count: number = 30): Observable<any> {
    let queryArray: string[] = [];
    params.query = `(isOpen:1) AND (isDeleted:0)${this.formatAdditionalCriteria(true)}${this.formatFilter(filter, true)}`;
    params.fields = SettingsService.settings.service.fields;
    params.count = count;
    params.sort = SettingsService.settings.additionalJobCriteria.sort;
    params.showTotalMatched = true;

    for (let key in params) {
      queryArray.push(`${key}=${params[key]}`);
    }
    let queryString: string = queryArray.join('&');

    return this.http.get(`${this.baseUrl}/search/JobOrder?${queryString}`);
  }

  public openJob(id: string | number): Observable<any> {
    return this.http.get(`${this.baseUrl}/query/JobBoardPost?where=(id=${id})&fields=${SettingsService.settings?.service?.fields}`);
  }

  public getCurrentJobIds(filter: any, ignoreFields: string[]): Observable<any> {
    let queryArray: string[] = [];
    let params: any = {};

    params.query = `(isOpen:1) AND (isDeleted:0)${this.formatAdditionalCriteria(true)}${this.formatFilter(filter, true, ignoreFields)}`;
    params.count = `500`;
    params.fields = 'id';
    params.sort = 'id';

    for (let key in params) {
      queryArray.push(`${key}=${params[key]}`);
    }
    let queryString: string = queryArray.join('&');

    return this.http.get(`${this.baseUrl}/search/JobOrder?${queryString}`);
  }

  public getAvailableFilterOptions(ids: number[], field: string): Observable<any> {
    let params: any = {};
    let queryArray: string[] = [];
    if (ids.length > 0) {
    params.where = `id IN (${ids.toString()})`;
    params.count = `500`;
    params.fields = `${field},count(id)`;
    params.groupBy = field;
    switch (field) {
      case 'publishedCategory(id,name)':
        params.orderBy = 'publishedCategory.name';
        break;
      case 'address(state)':
        params.orderBy = 'address.state';
        break;
      case 'address(city)':
        params.orderBy = 'address.city';
        break;
      default:
        params.orderBy = '-count.id';
        break;
    }
    for (let key in params) {
      queryArray.push(`${key}=${params[key]}`);
    }
    let queryString: string = queryArray.join('&');

      return this.http.get(`${this.baseUrl}/query/JobBoardPost?${queryString}`); // tslint:disable-line
    } else {
      return of({count: 0, start: 0, data: []});
    }
  }

  private formatAdditionalCriteria(isSearch: boolean): string {
    let field: string =  SettingsService.settings.additionalJobCriteria.field;
    let values: string[] = SettingsService.settings.additionalJobCriteria.values;
    let query: string = '';
    let delimiter: '"' | '\'' = isSearch ? '"' : '\'';
    let equals: ':' | '=' = isSearch ? ':' : '=';

    if (field && values.length > 0 && field !== '[ FILTER FIELD HERE ]' && values[0] !== '[ FILTER VALUE HERE ]') {
        for (let i: number = 0; i < values.length; i++) {
            if (i > 0) {
                query += ` OR `;
            } else {
                query += ' AND (';
            }
            query += `${field}${equals}${delimiter}${values[i]}${delimiter}`;
        }
        query += ')';
    }
    return query;
  }

  private formatFilter(filter: object, isSearch: boolean, ignoreFields: string[] = []): string {
    let additionalFilter: string = '';
    for (let key in filter) {
      if (!ignoreFields.includes(key)) {
        let filterValue: string | string[] = filter[key];
        if (typeof filterValue === 'string') {
          additionalFilter += ` AND (${filterValue})`;
        } else if (filterValue.length) {
          additionalFilter += ` AND (${filterValue.join(' OR ')})`;
        }
      }
    }

    return additionalFilter.replace(/{\?\^\^equals}/g, isSearch ? ':' : '=').replace(/{\?\^\^delimiter}/g, isSearch ? '"' : '\'');
  }

}
