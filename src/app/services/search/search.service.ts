import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '../settings/settings.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SearchService {

  public constructor(private http: HttpClient, public settings: SettingsService) {  }

  get baseUrl(): string {
    let service: IServiceSettings = this.settings.getSetting('service');
    let port: number = service.port ? service.port : 443;
    let scheme: string = `http${ service.port === 443  ? 's' : '' }`;

    return `${scheme}://public-rest${service.swimlane}.bullhornstaffing.com:${service.port}/rest-services/${service.corpToken}`;
  }

  public getjobs(filter?: any, params: any = {}, count: number = 30): Observable<any> {
    let queryArray: string[] = [];
    let additionalFilter: any = this.settings.getSetting('defaultFilter');
    let defaultFilter: string;
    if (additionalFilter.field) {
      defaultFilter = ` AND (${additionalFilter.field}='${additionalFilter.value}')`;
    } else {
      defaultFilter = '';
    }
    params.where = `(isOpen=true) AND (isDeleted=false)${defaultFilter}${this.parseFilter(filter, false)}`;
    params.fields = this.settings.getSetting('service').fields;
    params.count = count;
    params.sort = '-dateLastPublished';

    for (let key in params) {
      queryArray.push(`${key}=${params[key]}`);
    }
    let queryString: string = queryArray.join('&');

    return this.http.get(`${this.baseUrl}/query/JobBoardPost?${queryString}`);
  }

  public openJob(id: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/query/JobBoardPost?where=(id=${parseInt(id)})&fields=${this.settings.getSetting('service').fields}`); // tslint:disable-line
  }

  public getCurrentJobIds(filter: any, start: number): Observable<any> {
    let queryArray: string[] = [];
    let params: any = {};
    let additionalFilter: any = this.settings.getSetting('defaultFilter');
    let defaultFilter: string;
    if (additionalFilter.field) {
      defaultFilter = ` AND (${additionalFilter.field}:${additionalFilter.value})`;
    } else {
      defaultFilter = '';
    }
    params.query = `(isOpen:1) AND (isDeleted:0)${defaultFilter}${this.parseFilter(filter, true)}`;
    params.count = `500`;
    params.fields = 'id';
    params.sort = 'id';
    params.start = start;

    for (let key in params) {
      queryArray.push(`${key}=${params[key]}`);
    }
    let queryString: string = queryArray.join('&');

    return this.http.get(`${this.baseUrl}/search/JobOrder?${queryString}`); // tslint:disable-line
  }

  public getAvailableFilterOptions(ids: number[], field: string): Observable<any> {
    let params: any = {};
    let queryArray: string[] = [];
    params.where = `id IN (${ids.toString()})`;
    params.count = `500`;
    params.fields = `${field},count(id)`;
    params.groupBy = field;
    params.sort = 'id';
    params.orderBy = '-count.id';

    for (let key in params) {
      queryArray.push(`${key}=${params[key]}`);
    }
    let queryString: string = queryArray.join('&');

    return this.http.get(`${this.baseUrl}/query/JobBoardPost?${queryString}`); // tslint:disable-line
  }

  private parseFilter(filter: any, search: boolean = false): string {
    let filterFields: any = this.settings.getSetting('service').filterFields;
    let query: string;
    for (let key in filter) {
      if (!filter.hasOwnProperty(key)) { continue; }
      if (!filter[key]) { continue; }
      let obj: any = filter[key];
      if (key.indexOf('(') > -1) {
        key = key.split(/[()]/g).slice(0, 2).join('.');
      }
      let queryPart: string = '';
      if (Array.isArray(obj)) {
        for (let i: number = 0; i < obj.length; i++) {
          if (search) {
            if (queryPart) {
              queryPart = queryPart + ` OR ${key}:(%22${(typeof obj[i] === 'string' ? obj[i] : obj[i].toString()).split('%20', 2)[0]}%22)`;
            } else {
              queryPart = ` AND (${key}:(%22${(typeof obj[i] === 'string' ? obj[i] : obj[i].toString()).split('%20', 2)[0]}%22)`;
            }
          } else {
            let valueType: string =  'string';
            if (filterFields.find((filterField: any) => filterField.field === key || `${filterField.field}.${filterField.value}` === key)) {
              valueType = filterFields.find((filterField: any) => filterField.field === key || `${filterField.field}.${filterField.value}` === key).valueType;
            }
            let quote: string = valueType === 'string' ? "'" : '';
            if (queryPart) {
              queryPart = queryPart + ` OR ${key}=${quote}${obj[i]}${quote}`;
            } else {
              queryPart = ` AND (${key}=${quote}${obj[i]}${quote}`;
            }
          }
        }
      }

      if (search && key === 'keyword') {
        queryPart += ` AND (title:(${obj.trim().split(' ').join(' AND ') + '*'}) OR publicDescription:(${obj.trim().split(' ').join(' AND ') + '*'})`;
      }
      if (!search && key === 'id') {
        queryPart += ` AND id IN (${obj}`;
      }

      query = `${query ? query : ''}${queryPart}${queryPart ? ')' : ''}`;
    }
    return query ? query : '';
  }

  private handleFilterFields(): string {
    let fields: any = '';
    this.settings.getSetting('service').filterFields.forEach((filterField: any) => {
      if (filterField.label === filterField.value) {
        fields += `${filterField.label},`;
      } else {
       fields += `${filterField.field}(${filterField.label},${filterField.value}),`;
      }
    });
    return fields;
  }

}
