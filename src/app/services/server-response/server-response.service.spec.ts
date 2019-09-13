/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { ServerResponseService } from './server-response.service';

describe('Service: ServerResponse', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServerResponseService],
    });
  });

  it('should ...', inject([ServerResponseService], (service: ServerResponseService) => {
    expect(service).toBeTruthy();
  }));
});
