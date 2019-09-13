/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { ApplyService } from './apply.service';

describe('Service: Apply', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApplyService],
    });
  });

  it('should ...', inject([ApplyService], (service: ApplyService) => {
    expect(service).toBeTruthy();
  }));
});
