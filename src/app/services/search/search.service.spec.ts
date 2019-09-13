/* tslint:disable:no-unused-variable */

import { TestBed, inject  } from '@angular/core/testing';
import { SearchService } from './search.service';

xdescribe('Service: Http', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SearchService],
    });
  });

  it('should ...', inject([SearchService], (service: SearchService) => {
    expect(service).toBeTruthy();
  }));
});
