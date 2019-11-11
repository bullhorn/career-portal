/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { JobDetailsComponent } from './job-details.component';

describe('JobDetailsComponent', () => {
  let component: JobDetailsComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ JobDetailsComponent ],
    });
  });

  beforeEach(inject([JobDetailsComponent], (_component: any) => {
    component = _component;

  }));

  describe('app component', () => {
    it('should be truthy', () => {
      expect(component).toBeTruthy();
    });
  });
});
