import { Injectable } from '@angular/core';

import { Resolve } from '@angular/router';

import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SearchService } from './services/search/search.service';
import { ServerResponseService } from './services/server-response/server-response.service';
import { SettingsService } from './services/settings/settings.service';

@Injectable()
export class JobResolver implements Resolve<any> {
  constructor(private searchService: SearchService, private serverResponse: ServerResponseService, private settingsService: SettingsService) { }

  public async resolve(route: ActivatedRouteSnapshot): Promise<any> {

    if (!SettingsService.loaded) {
      await this.settingsService.load();
    }
    const data = await this.searchService.openJob(route.paramMap.get('id')).pipe(catchError( () => {
      this.serverResponse.setNotFound();
      console.error('invalid job id'); // tslint:disable-line
      return of({jobs: []});
    },
    )).toPromise();
    return data;
  }
}
