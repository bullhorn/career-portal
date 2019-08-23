import { Injectable } from '@angular/core';

import { Resolve } from '@angular/router';

import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { SearchService } from './services/search/search.service';

@Injectable()
export class JobResolver implements Resolve<any> {
  constructor(private searchService: SearchService) { }

  public resolve(route: ActivatedRouteSnapshot): Observable<any> {

    return this.searchService.openJob(route.paramMap.get('id'));
  }
}
