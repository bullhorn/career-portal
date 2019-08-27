/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AnalyticsService } from './analytics.service';

describe('Service: Analytics', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnalyticsService],
    });
  });

  it('should ...', inject([AnalyticsService], (service: AnalyticsService) => {
    expect(service).toBeTruthy();
  }));
});
