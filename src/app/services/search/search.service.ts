import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '../settings/settings.service';
import { Observable, of, forkJoin } from 'rxjs';
import { IServiceSettings } from '../../typings/settings';
import { concatMap, map } from 'rxjs/operators';

@Injectable()
export class SearchService {

  public constructor(private http: HttpClient, public settings: SettingsService) {  }

  get baseUrl(): string {
    let service: IServiceSettings = SettingsService.settings?.service;
    let port: number = service?.port ? service.port : 443;
    let scheme: string = `http${ port === 443  ? 's' : '' }`;

    return `${scheme}://public-rest${service?.swimlane}.bullhornstaffing.com:${port}/rest-services/${service?.corpToken}`;
  }

  public getJobs(filter?: any, params: any = {}, count: number = 30): Observable<any> {
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

  public getCurrentJobIds(filter: any, ignoreFields: string[]): Observable<any[]> {
    const queryString: string = this.getQueryString(filter, ignoreFields);
  
    // Recursive function to fetch all records
    const fetchAllRecords = (start: number = 0, records: any[] = []): Observable<any> => {
      return this.getJobRecords(queryString, start).pipe(
        concatMap((response: any) => {
          // Concatenate records from the response
          const updatedRecords = [...records, ...response.data];
  
          if (updatedRecords.length < response.total) {
            // Continue fetching more records if needed
            return fetchAllRecords(updatedRecords.length, updatedRecords);
          } else {
            // Return the accumulated records when done
            return of(updatedRecords);
          }
        }),
      );
    };
  
    // Start fetching all records
    return fetchAllRecords();
  }
  
  private getQueryString(filter: any, ignoreFields: string[]): string {
    // Construct the query string based on filter and parameters
    const params = {
      query: `(isOpen:1) AND (isDeleted:0)${this.formatAdditionalCriteria(true)}${this.formatFilter(filter, true, ignoreFields)}`,
      count: `500`,
      fields: 'id',
      sort: 'id'
    };
  
    // Join the query parameters with '&' to form the complete query string
    return Object.entries(params).map(([key, value]) => `${key}=${value}`).join('&');
  }
  
  private getJobRecords(queryString: string, start: number = 0): Observable<any> {
    // Fetch job records from the API with the specified query and start offset
    return this.http.get(`${this.baseUrl}/search/JobOrder?start=${start}&${queryString}`);
  }

// Function to get available filter options
public getAvailableFilterOptions(ids: number[], field: string): Observable<any> {
  // If there are no ids, return an empty response
  if(ids.length === 0) {
    return of({count:0, start:0, data:[]});
  }

  // Define the batch size
  const batchSize = 500;

  // Create an array of observables for each batch of ids
  const observables = Array(Math.ceil(ids.length / batchSize)).fill(null).map((_, index) => {
    // Get the ids for the current batch
    const batchIds = ids.slice(index * batchSize, (index + 1) * batchSize);

    // Define the parameters for the HTTP request
    const params: any = {
      count: 500,
      fields: `${field},count(id)`,
      groupBy: field,
      where: `id IN (${batchIds.toString()})`,
      orderBy: this.getOrderByField(field) // Get the order by field based on the field parameter
    }

    // Create the query string from the parameters
    const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');

    // Return the observable for the HTTP request
    return this.http.get(`${this.baseUrl}/query/JobBoardPost?${queryString}`);
  });

  // Use forkJoin to wait for all observables to complete and then process the responses
  return forkJoin(observables).pipe(
    map((responses: any[]) => {
      // Reduce the responses to a single response by merging the data
      const mergedResponse = responses.reduce((acc, response) => {
        // For each item in the response data
        response.data.forEach(item => {
          // Find the index of the existing item in the accumulator data
          const existingItemIndex = acc.data.findIndex(x => this.isSameItem(x, item, field));

          // If the item exists, increment its count
          if(existingItemIndex !== -1) {
            acc.data[existingItemIndex].idCount += item.idCount;
          } else {
            // If the item does not exist, add it to the accumulator data
            acc.data.push(item);
          }
        })

        // Return the accumulator
        return acc;
      }, {count: 0, start: 0, data: []});

      // Return the merged response
      return mergedResponse;
    }),
  )
}

// Function to get the order by field based on the field parameter
private getOrderByField(field: string): string {
  switch (field) {
    case 'publishedCategory(id,name)':
      return 'publishedCategory.name';
    case 'address(state)':
      return 'address.state';
    case 'address(city)':
      return 'address.city';
    default:
      return '-count.id';
  }
}

// Function to check if two items are the same based on the field parameter
private isSameItem(item1: any, item2: any, field: string): boolean {
  switch(field) {
    case 'publishedCategory(id,name)':
      return item1?.publishedCategory?.id === item2?.publishedCategory?.id;
    case 'address(state)':
      return item1?.address?.state === item2?.address?.state;
    case 'address(city)':
      return item1?.address?.city === item2?.address?.city;
    default:
      return false;
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